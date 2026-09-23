// Audio playback utility for Garhwali, Kumaoni, and Jaunsari pronunciation
// Handles WAV & PCM base64 audio from Gemini TTS, HTMLAudioElement playback, and Web Speech API fallback

let currentAudioElement: HTMLAudioElement | null = null;
let currentWebAudioSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function stopCurrentAudio(): void {
  // Stop HTMLAudioElement
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }

  // Stop Web Audio BufferSource
  if (currentWebAudioSource) {
    try {
      currentWebAudioSource.stop();
    } catch {
      // ignore
    }
    currentWebAudioSource = null;
  }

  // Stop Web Speech Synthesis
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Play audio base64 from Gemini TTS.
 * Gemini TTS returns WAV or 16-bit linear PCM at 24000Hz.
 */
export function playPcmBase64(
  base64Data: string,
  sampleRate = 24000,
  onEnded?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    stopCurrentAudio();

    if (!base64Data || base64Data.trim().length === 0) {
      resolve();
      return;
    }

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 1. If it's a WAV container (RIFF...WAVE), play with HTMLAudioElement
      // This is the most reliable cross-browser way to play audio in Chrome, Safari, Firefox
      const isWav =
        len >= 12 &&
        bytes[0] === 0x52 && // R
        bytes[1] === 0x49 && // I
        bytes[2] === 0x46 && // F
        bytes[3] === 0x46 && // F
        bytes[8] === 0x57 && // W
        bytes[9] === 0x41 && // A
        bytes[10] === 0x56 && // V
        bytes[11] === 0x45; // E

      if (isWav) {
        try {
          const blob = new Blob([bytes], { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          currentAudioElement = audio;

          const finish = () => {
            URL.revokeObjectURL(url);
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            if (onEnded) onEnded();
            resolve();
          };

          audio.onended = finish;
          audio.onerror = (e) => {
            console.warn('HTMLAudio error, falling back to Web Audio:', e);
            finish();
          };

          audio.play().catch((err) => {
            console.warn('HTMLAudio play blocked/failed, trying Web Audio:', err);
            playWithWebAudio(bytes, sampleRate).then(() => {
              if (onEnded) onEnded();
              resolve();
            });
          });
          return;
        } catch (e) {
          console.warn('Blob audio creation failed, trying Web Audio:', e);
        }
      }

      // 2. Play using Web Audio API
      playWithWebAudio(bytes, sampleRate)
        .then(() => {
          if (onEnded) onEnded();
          resolve();
        })
        .catch(() => {
          if (onEnded) onEnded();
          resolve();
        });
    } catch (err) {
      console.warn('Base64 decode/play error:', err);
      if (onEnded) onEnded();
      resolve();
    }
  });
}

function playWithWebAudio(bytes: Uint8Array, sampleRate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = getAudioContext();

      // Check if it's a RIFF container that decodeAudioData can decode directly
      if (bytes.length > 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
        // Clone into a fresh ArrayBuffer to avoid detached or SharedArrayBuffer issues
        const copyBuf = new ArrayBuffer(bytes.byteLength);
        new Uint8Array(copyBuf).set(bytes);
        ctx.decodeAudioData(
          copyBuf,
          (decodedBuffer) => {
            const source = ctx.createBufferSource();
            source.buffer = decodedBuffer;
            source.connect(ctx.destination);
            currentWebAudioSource = source;
            source.onended = () => {
              if (currentWebAudioSource === source) currentWebAudioSource = null;
              resolve();
            };
            source.start(0);
          },
          () => {
            // Fallback to manual PCM decoding
            playRawPcm(ctx, bytes, sampleRate).then(resolve).catch(reject);
          }
        );
        return;
      }

      // Raw 16-bit linear PCM
      playRawPcm(ctx, bytes, sampleRate).then(resolve).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}

function playRawPcm(ctx: AudioContext, bytes: Uint8Array, sampleRate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const numSamples = Math.floor(bytes.byteLength / 2);
      if (numSamples === 0) {
        resolve();
        return;
      }

      const float32 = new Float32Array(numSamples);
      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

      for (let i = 0; i < numSamples; i++) {
        float32[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      currentWebAudioSource = source;

      source.onended = () => {
        if (currentWebAudioSource === source) currentWebAudioSource = null;
        resolve();
      };
      source.start(0);
    } catch (err) {
      console.warn('Raw PCM decode error:', err);
      reject(err);
    }
  });
}

/**
 * High-quality browser Devanagari synthesis fallback when TTS audio is unavailable
 */
export function speakDevanagariFallback(
  text: string,
  targetLanguage: 'garhwali' | 'kumaoni' | 'jaunsari' = 'garhwali'
): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      stopCurrentAudio();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';

      // Tailor speech cadence to regional style
      if (targetLanguage === 'kumaoni') {
        utterance.rate = 0.85; // Measured, musical cadence of Kumaon
        utterance.pitch = 1.08;
      } else if (targetLanguage === 'jaunsari') {
        utterance.rate = 0.88; // Distinct hill rhythm
        utterance.pitch = 1.02;
      } else {
        utterance.rate = 0.86; // Garhwali steady cadence
        utterance.pitch = 1.04;
      }

      // Try to find an Indian English or Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('India'));
      if (hiVoice) {
        utterance.voice = hiVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      resolve();
    }
  });
}
