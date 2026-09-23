import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Radio,
  ArrowRight,
  Languages,
  Headphones,
  Sliders,
  History,
  Trash2,
  Flame,
  Info,
  Send,
  RefreshCw,
  Repeat,
} from 'lucide-react';
import { playPcmBase64, speakDevanagariFallback, stopCurrentAudio } from '../utils/audioPlayer';
import {
  VoiceTranslationResult,
  TargetLanguageType,
  generateVoiceFallback,
} from '../utils/voiceTranslator';

interface VoiceHistoryItem {
  id: string;
  timestamp: string;
  sourceText: string;
  sourceLang: string;
  targetLanguage: TargetLanguageType;
  targetLanguageName: string;
  translatedText: string;
  transliteration: string;
  audioBase64?: string;
}

const VOICE_PRESETS = [
  { text: 'नमस्ते, आप कैसे हैं और कहाँ जा रहे हैं?', lang: 'Hindi', label: '🙏 नमस्कार एवं हालचाल (Hindi)' },
  { text: 'Hello, how can I travel to the high mountain meadows?', lang: 'English', label: '🇬🇧 Travel to Bugyals (English)' },
  { text: 'बद्रीनाथ और केदारनाथ जाने का सीधा रास्ता किधर से है?', lang: 'Hindi', label: '🏔️ तीर्थ मार्ग व दिशा (Hindi)' },
  { text: 'पहाड़ों में आज बहुत ठंड है और सुंदर बर्फ गिर रही है।', lang: 'Hindi', label: '❄️ मौसम व हिमपात (Hindi)' },
  { text: 'Where can I find pure natural spring drinking water in the village?', lang: 'English', label: '💧 Pure Spring Water (English)' },
  { text: 'कुमाऊँ के नौले और झोड़ा-चांचरी संस्कृति बहुत सुंदर है।', lang: 'Hindi', label: '🌸 कुमाऊँनी धरोहर व नौले (Hindi)' },
  { text: 'हनोल में महासू देवता का दर्शन करने कब जाना चाहिए?', lang: 'Hindi', label: '⚡ महासू देवता व जौनसार (Hindi)' },
  { text: 'What is the best traditional food to eat during winter here?', lang: 'English', label: '🍲 Traditional Food (English)' },
];

const GARHWALI_DIALECT_OPTIONS = [
  { id: 'srinagariya', name: 'श्रीनगरिया (साहित्यिक मानक)', region: 'अलकनंदा घाटी', tag: 'मानक प्रेस' },
  { id: 'tehriyali', name: 'टिहरियाळि', region: 'भागीरथी-भिलंगना बेसिन', tag: 'टिहरी गढ़वाल' },
  { id: 'salani', name: 'सलाणी', region: 'गंगा-सळान / पौड़ी-कोटद्वार', tag: 'पौड़ी अंचल' },
  { id: 'badhani_chamoli', name: 'बधाणी / चमोली', region: 'पिंडर अंचल / उच्च हिमालय', tag: 'चमोली' },
  { id: 'nagpuriya', name: 'नागपुरिया', region: 'मंदाकिनी / रुद्रप्रयाग', tag: 'रुद्रप्रयाग' },
  { id: 'jaunpuri_ravalti', name: 'जौनपुरी / रवाल्टी', region: 'पश्चिमी सीमांत / यमुना घाटी', tag: 'रंवाई-जौनपुर' },
];

export const VoiceTranslatorView: React.FC = () => {
  // Target Language: 'garhwali' | 'kumaoni' | 'jaunsari'
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguageType>('garhwali');
  // Sub-dialect if Garhwali is selected
  const [targetDialect, setTargetDialect] = useState('srinagariya');

  // Input conversation language: 'Auto' | 'Hindi' | 'English'
  const [sourceLang, setSourceLang] = useState('Auto');
  const [continuousListening, setContinuousListening] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingLanguage, setPlayingLanguage] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [manualInputText, setManualInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<VoiceHistoryItem[]>([]);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  // Active translation result
  const [currentResult, setCurrentResult] = useState<VoiceTranslationResult>(() =>
    generateVoiceFallback('नमस्ते, आप कैसे हैं और कहाँ जा रहे हैं?', 'Hindi', 'garhwali', 'srinagariya')
  );

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const continuousRef = useRef(continuousListening);
  continuousRef.current = continuousListening;

  // Set recognition language dynamically
  const getRecognitionLang = () => {
    if (sourceLang === 'English') return 'en-IN';
    // 'hi-IN' on modern Chrome/Edge recognizes both Hindi and conversational English / Hinglish with high accuracy
    return 'hi-IN';
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      const spoken = final || interim;
      if (spoken) {
        setLiveTranscript(spoken);
      }

      if (final && final.trim().length > 1) {
        handleTriggerTranslation(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      // If continuous listening is enabled and user hasn't explicitly stopped it, restart gracefully
      if (continuousRef.current && isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          isListeningRef.current = false;
        }
      } else {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startListening = () => {
    stopCurrentAudio();
    setIsPlayingAudio(false);

    if (!recognitionRef.current) {
      alert('माइक्रोफोन पहचान इस ब्राउज़र में उपलब्ध नहीं है। कृपया नीचे दिए गए वाक्य चुनें या पाठ लिखकर अनुवाद करें।');
      return;
    }

    try {
      recognitionRef.current.lang = getRecognitionLang();
      setLiveTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (e) {
      console.warn('Recognition start issue, restarting:', e);
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.lang = getRecognitionLang();
          recognitionRef.current.start();
          setIsListening(true);
          isListeningRef.current = true;
        }, 150);
      } catch (err) {
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    if (liveTranscript.trim().length > 1) {
      handleTriggerTranslation(liveTranscript.trim());
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Trigger translation from text (either spoken, typed, or preset)
  const handleTriggerTranslation = async (
    text: string,
    overrideLang?: TargetLanguageType,
    overrideDialect?: string
  ) => {
    if (!text || text.trim().length === 0) return;
    const activeTargetLang = overrideLang || targetLanguage;
    const activeDialect = overrideDialect || targetDialect;

    setIsTranslating(true);

    try {
      const response = await fetch('/api/garhwali/voice-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          sourceLang,
          targetLanguage: activeTargetLang,
          targetDialect: activeDialect,
        }),
      });

      let resData: VoiceTranslationResult;
      if (response.ok) {
        resData = await response.json();
      } else {
        resData = generateVoiceFallback(text, sourceLang, activeTargetLang, activeDialect);
      }

      setCurrentResult(resData);

      // Determine text to speak for the active language
      const textToSpeak = getActiveTextForLanguage(resData, activeTargetLang);

      // Add to conversation history
      const historyEntry: VoiceHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceText: text,
        sourceLang: resData.detectedSourceLang || sourceLang,
        targetLanguage: activeTargetLang,
        targetLanguageName: getLanguageLabel(activeTargetLang),
        translatedText: textToSpeak,
        transliteration: resData.transliteration,
        audioBase64: resData.audioBase64,
      };

      setVoiceHistory((prev) => [historyEntry, ...prev.slice(0, 19)]);

      // Auto speak if enabled
      if (autoSpeak) {
        playLanguageSpeech(textToSpeak, activeTargetLang, resData.dialectName, resData.audioBase64);
      }
    } catch (err) {
      console.warn('Voice translation fallback:', err);
      const fallback = generateVoiceFallback(text, sourceLang, activeTargetLang, activeDialect);
      setCurrentResult(fallback);
      const textToSpeak = getActiveTextForLanguage(fallback, activeTargetLang);
      if (autoSpeak) {
        playLanguageSpeech(textToSpeak, activeTargetLang, fallback.dialectName);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const getActiveTextForLanguage = (result: VoiceTranslationResult, lang: TargetLanguageType) => {
    if (lang === 'kumaoni') {
      return result.kumaoniText || result.dialectVariants?.kumaoni || result.translatedText;
    }
    if (lang === 'jaunsari') {
      return result.jaunsariText || result.dialectVariants?.jaunsari || result.translatedText;
    }
    return result.garhwaliText || result.dialectVariants?.[targetDialect as keyof typeof result.dialectVariants] || result.translatedText;
  };

  const getLanguageLabel = (lang: TargetLanguageType) => {
    if (lang === 'kumaoni') return 'कुमाऊँनी (Kumaoni)';
    if (lang === 'jaunsari') return 'जौनसारी (Jaunsari)';
    return `गढ़वाली (${GARHWALI_DIALECT_OPTIONS.find((d) => d.id === targetDialect)?.name.split(' ')[0] || 'श्रीनगरिया'})`;
  };

  // Play spoken audio in the selected language with real-time TTS
  const playLanguageSpeech = async (
    text: string,
    lang: TargetLanguageType,
    dialectName = 'Srinagariya',
    base64Audio?: string
  ) => {
    stopCurrentAudio();
    setIsPlayingAudio(true);
    setPlayingLanguage(lang);

    const onAudioEnd = () => {
      setIsPlayingAudio(false);
      setPlayingLanguage(null);
    };

    try {
      if (base64Audio) {
        await playPcmBase64(base64Audio, 24000, onAudioEnd);
        return;
      }

      // Call server TTS endpoint with specific language instructions
      const ttsRes = await fetch('/api/garhwali/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: lang,
          dialectName: lang === 'garhwali' ? dialectName : lang,
          style:
            lang === 'kumaoni'
              ? 'warm and expressive Kumaon cadence'
              : lang === 'jaunsari'
              ? 'authentic Jaunsari hill cadence'
              : 'clear articulation of retroflex ळ and natural Central Pahari pitch cadence',
        }),
      });

      if (ttsRes.ok) {
        const audioJson = await ttsRes.json();
        if (audioJson.audioBase64) {
          await playPcmBase64(audioJson.audioBase64, audioJson.sampleRate || 24000, onAudioEnd);
          return;
        }
      }

      // Devanagari fallback synthesis
      await speakDevanagariFallback(text, lang);
      onAudioEnd();
    } catch (err) {
      console.warn('Speech playback fallback:', err);
      await speakDevanagariFallback(text, lang);
      onAudioEnd();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Switch Target Language: Garhwali, Kumaoni, or Jaunsari
  const handleLanguageSelect = (newLang: TargetLanguageType) => {
    setTargetLanguage(newLang);
    const updatedText = getActiveTextForLanguage(currentResult, newLang);
    setCurrentResult((prev) => ({
      ...prev,
      targetLanguage: newLang,
      targetLanguageName: getLanguageLabel(newLang),
      translatedText: updatedText,
    }));

    if (autoSpeak && updatedText) {
      playLanguageSpeech(updatedText, newLang, currentResult.dialectName);
    }
  };

  // When user switches Garhwali regional dialect
  const handleDialectChange = (newDialect: string) => {
    setTargetDialect(newDialect);
    setTargetLanguage('garhwali');
    if (currentResult.dialectVariants && currentResult.dialectVariants[newDialect as keyof typeof currentResult.dialectVariants]) {
      const variantText = currentResult.dialectVariants[newDialect as keyof typeof currentResult.dialectVariants];
      const opt = GARHWALI_DIALECT_OPTIONS.find((d) => d.id === newDialect);
      setCurrentResult((prev) => ({
        ...prev,
        targetLanguage: 'garhwali',
        targetDialect: newDialect,
        dialectName: opt ? opt.name : newDialect,
        targetLanguageName: `गढ़वाली (${opt?.name.split(' ')[0] || newDialect})`,
        garhwaliText: variantText,
        translatedText: variantText,
      }));
      if (autoSpeak) {
        playLanguageSpeech(variantText, 'garhwali', opt?.name || newDialect);
      }
    } else {
      handleTriggerTranslation(currentResult.sourceText, 'garhwali', newDialect);
    }
  };

  // Highlight retroflex ळ in rendered text
  const renderDevanagariWithRetroflex = (text: string) => {
    if (!text || !text.includes('ळ')) {
      return text;
    }
    const parts = text.split(/(ळ)/g);
    return parts.map((part, index) =>
      part === 'ळ' ? (
        <span
          key={index}
          className="text-[#f0be54] font-black underline decoration-[#f0be54]/60 decoration-2 underline-offset-4 bg-[#2b2413] px-1 py-0.5 rounded mx-0.5"
          title="मूर्धन्य ळ (Central Pahari Retroflex ळ)"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const activeTranslation = getActiveTextForLanguage(currentResult, targetLanguage);

  return (
    <div className="space-y-6">
      {/* Hero Voice Translation Controller Header */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Top Meta Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-950/80 text-[#fdba74] border border-orange-800/60 text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#f97316] animate-pulse" />
                लाइव आवाज़ अनुवादक (Live Voice Conversation)
              </span>
              <span className="text-xs text-[#94a3b8]">
                हिंदी व अंग्रेज़ी सुनें → गढ़वाली, कुमाऊँनी व जौनसारी में बोलें
              </span>
            </div>
            <h2 className="font-heading-dev text-2xl sm:text-3xl font-bold text-[#f8fafc]">
              हिंदी व अंग्रेज़ी में बोलें — तुरंत पहाड़ी आवाज़ में सुनें
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-devanagari">
              माइक चालू करें और स्वाभाविक बातचीत करें। प्रणाली हिंदी व अंग्रेज़ी को समझकर चुने गए विकल्प (गढ़वाली, कुमाऊँनी अथवा जौनसारी) में शुद्ध उच्चारण के साथ बोलेगी।
            </p>
          </div>

          {/* Quick Settings: Auto Speak & Continuous Mode */}
          <div className="flex flex-wrap items-center gap-2.5 bg-[#070b12] p-2.5 rounded-lg border border-[#1e293b]">
            {/* Auto-Speak Toggle */}
            <button
              type="button"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                autoSpeak
                  ? 'bg-[#1e293b] text-[#fb923c] border border-orange-800/40'
                  : 'bg-[#0f172a] text-[#64748b] hover:text-[#94a3b8]'
              }`}
              title="अनुवाद होते ही स्वतः आवाज़ में बोलें"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-[#f97316]" /> : <VolumeX className="w-4 h-4" />}
              <span>स्वतः बोलें: {autoSpeak ? 'चालू' : 'बंद'}</span>
            </button>

            {/* Continuous Conversation Toggle */}
            <button
              type="button"
              onClick={() => setContinuousListening(!continuousListening)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                continuousListening
                  ? 'bg-[#1e293b] text-[#38bdf8] border border-sky-800/40'
                  : 'bg-[#0f172a] text-[#64748b] hover:text-[#94a3b8]'
              }`}
              title="लगातार बातचीत सुनते रहें"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>सतत संवाद: {continuousListening ? 'चालू' : 'बंद'}</span>
            </button>

            {/* Input Spoken Language */}
            <div className="flex items-center gap-1.5 text-xs pl-1">
              <Languages className="w-3.5 h-3.5 text-[#94a3b8]" />
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-[#0f172a] text-[#f8fafc] border border-[#1e293b] rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#ea580c]"
              >
                <option value="Auto">ऑटो: हिंदी + English (वार्तालाप)</option>
                <option value="Hindi">हिंदी (Hindi Speech)</option>
                <option value="English">English (Conversational)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRIMARY TARGET LANGUAGE SELECTOR (गढ़वाली / कुमाऊँनी / जौनसारी) */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#070b12] border border-[#1e293b]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs font-bold text-[#f8fafc] uppercase tracking-wide font-devanagari">
                अनुवाद की भाषा चुनें (Select Target Language):
              </span>
            </div>
            <span className="text-[11px] text-[#94a3b8]">
              किसी भी भाषा को चुनते ही अनुवाद व आवाज़ उस भाषा में बदल जाएगी
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Option 1: गढ़वाली */}
            <button
              type="button"
              onClick={() => handleLanguageSelect('garhwali')}
              className={`p-3.5 rounded-lg border text-left transition-all relative ${
                targetLanguage === 'garhwali'
                  ? 'bg-gradient-to-r from-orange-950/70 to-slate-900 border-[#ea580c] ring-2 ring-[#ea580c]/40 text-white shadow-md'
                  : 'bg-[#0b101b] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading-dev font-bold text-base text-[#f8fafc] flex items-center gap-1.5">
                  <span>🏔️</span> गढ़वाली (Garhwali)
                </span>
                {targetLanguage === 'garhwali' && (
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span>
                )}
              </div>
              <p className="text-xs text-[#cbd5e1] font-devanagari">
                श्रीनगरिया, टिहरियाळि, सलाणी, बधाणी, नागपुरिया, रवाल्टी
              </p>
              <div className="mt-1.5 text-[10px] text-[#fb923c] font-medium">
                शुद्ध मूर्धन्य ळ युक्त प्रामाणिक गढ़वाली
              </div>
            </button>

            {/* Option 2: कुमाऊँनी */}
            <button
              type="button"
              onClick={() => handleLanguageSelect('kumaoni')}
              className={`p-3.5 rounded-lg border text-left transition-all relative ${
                targetLanguage === 'kumaoni'
                  ? 'bg-gradient-to-r from-amber-950/70 to-slate-900 border-[#f59e0b] ring-2 ring-[#f59e0b]/40 text-white shadow-md'
                  : 'bg-[#0b101b] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading-dev font-bold text-base text-[#f8fafc] flex items-center gap-1.5">
                  <span>🌸</span> कुमाऊँनी (Kumaoni)
                </span>
                {targetLanguage === 'kumaoni' && (
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
                )}
              </div>
              <p className="text-xs text-[#cbd5e1] font-devanagari">
                अल्मोड़ा, नैनीताल, पिथौरागढ़, बागेश्वर, चम्पावत
              </p>
              <div className="mt-1.5 text-[10px] text-[#fcd34d] font-medium">
                पैलाग, कसा छा, भल, काँ, लै, रौ, छू
              </div>
            </button>

            {/* Option 3: जौनसारी */}
            <button
              type="button"
              onClick={() => handleLanguageSelect('jaunsari')}
              className={`p-3.5 rounded-lg border text-left transition-all relative ${
                targetLanguage === 'jaunsari'
                  ? 'bg-gradient-to-r from-emerald-950/70 to-slate-900 border-[#10b981] ring-2 ring-[#10b981]/40 text-white shadow-md'
                  : 'bg-[#0b101b] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading-dev font-bold text-base text-[#f8fafc] flex items-center gap-1.5">
                  <span>⚡</span> जौनसारी (Jaunsari)
                </span>
                {targetLanguage === 'jaunsari' && (
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                )}
              </div>
              <p className="text-xs text-[#cbd5e1] font-devanagari">
                चक्राता, कालसी, त्यूणी, हनोल (जौनसार-बावर)
              </p>
              <div className="mt-1.5 text-[10px] text-[#6ee7b7] font-medium">
                तुमु कनक सा, महासू संस्कृति, सो, ब्वलो
              </div>
            </button>
          </div>

          {/* Sub-dialect options when Garhwali is active */}
          {targetLanguage === 'garhwali' && (
            <div className="mt-3 pt-3 border-t border-[#1e293b]">
              <span className="text-[11px] font-semibold text-[#94a3b8] block mb-2 font-devanagari">
                गढ़वाली की प्रांतीय बोली शैली (Garhwali Regional Dialect):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {GARHWALI_DIALECT_OPTIONS.map((dialect) => {
                  const isSelected = targetDialect === dialect.id;
                  return (
                    <button
                      key={dialect.id}
                      type="button"
                      onClick={() => handleDialectChange(dialect.id)}
                      className={`p-2 rounded-md border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1e293b] border-[#ea580c] text-white shadow-sm ring-1 ring-[#ea580c]'
                          : 'bg-[#0b101b] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032]'
                      }`}
                    >
                      <div className="font-heading-dev font-bold text-xs truncate">
                        {dialect.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-[#64748b] truncate">
                        {dialect.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Central Real-time Voice Controller */}
        <div className="mt-6 flex flex-col items-center justify-center py-4">
          {/* Big Mic Button with Active Pulse */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-orange-600/25 animate-ping"></span>
                <span className="absolute w-48 h-48 rounded-full bg-amber-500/15 animate-pulse"></span>
              </>
            )}

            <button
              type="button"
              onClick={toggleListening}
              disabled={isTranslating}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center gap-1.5 shadow-lg transition-all duration-200 relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 via-orange-600 to-amber-500 text-white shadow-orange-600/50 scale-105 ring-4 ring-orange-400'
                  : 'bg-[#ea580c] hover:bg-[#c2410c] text-white hover:scale-105 shadow-orange-950/40 ring-4 ring-orange-500/20'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-9 h-9 animate-pulse text-white" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white font-sans">
                    रोकें (Stop)
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 text-white" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white font-sans">
                    बोलें (Speak)
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Status Caption */}
          <div className="mt-4 text-center space-y-1">
            <p className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc]">
              {isListening
                ? 'सुन रहा हूँ... हिंदी या अंग्रेज़ी में बोलिए (Listening)'
                : isTranslating
                ? 'अनुवाद व शुद्ध उच्चारण तैयार हो रहा है...'
                : isPlayingAudio
                ? `${getLanguageLabel(playingLanguage as TargetLanguageType || targetLanguage)} में आवाज़ सुनाई जा रही है...`
                : 'माइक दबाकर बोलना शुरू करें (Speak in Hindi or English)'}
            </p>
            <p className="text-xs text-[#94a3b8] font-devanagari">
              {isListening
                ? `लक्षित भाषा: ${getLanguageLabel(targetLanguage)} · बोलना रुकते ही स्वतः अनुवाद व वाचन होगा`
                : `वर्तमान लक्षित भाषा: ${getLanguageLabel(targetLanguage)}`}
            </p>
          </div>

          {/* Live Interim Transcript Bubble */}
          {(liveTranscript || isListening) && (
            <div className="mt-4 max-w-xl w-full mx-auto p-4 rounded-lg bg-[#070b12] border border-[#1e293b] text-center animate-in fade-in">
              <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider block mb-1">
                पहचाने गए शब्द (Spoken Transcript):
              </span>
              <p className="text-base sm:text-lg font-devanagari text-[#f8fafc] italic">
                "{liveTranscript || 'बोलिए...'}"
              </p>
            </div>
          )}

          {/* Direct Text Input Box (Speak or Type) */}
          <div className="mt-5 max-w-xl w-full mx-auto flex items-center gap-2">
            <input
              type="text"
              value={manualInputText}
              onChange={(e) => setManualInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTriggerTranslation(manualInputText);
                  setManualInputText('');
                }
              }}
              placeholder="या यहाँ हिंदी/English में लिखें और अनुवाद करें..."
              className="flex-1 bg-[#070b12] text-[#f8fafc] border border-[#1e293b] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#ea580c]"
            />
            <button
              type="button"
              onClick={() => {
                handleTriggerTranslation(manualInputText);
                setManualInputText('');
              }}
              disabled={isTranslating || !manualInputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>अनुवाद व बोलें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Spoken Translation Output Card */}
      {currentResult && (
        <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-5 sm:p-6 shadow-sm space-y-6">
          {/* Header of Results Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-md bg-[#1e293b] border border-orange-500/30 flex items-center justify-center text-[#f97316]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] block">
                  अनुवादित स्वर (Spoken Translation)
                </span>
                <h3 className="font-heading-dev font-bold text-lg text-[#f8fafc]">
                  {getLanguageLabel(targetLanguage)}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Replay Audio Button */}
              <button
                type="button"
                onClick={() =>
                  playLanguageSpeech(
                    activeTranslation,
                    targetLanguage,
                    currentResult.dialectName,
                    targetLanguage === 'garhwali' ? currentResult.audioBase64 : undefined
                  )
                }
                disabled={isPlayingAudio}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm shadow-orange-950/30"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>
                  {isPlayingAudio
                    ? 'आवाज़ बज रही है...'
                    : `उच्चारण सुनें (${targetLanguage === 'kumaoni' ? 'कुमाऊँनी' : targetLanguage === 'jaunsari' ? 'जौनसारी' : 'गढ़वाली'})`}
                </span>
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(activeTranslation)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-xs text-[#cbd5e1] hover:text-white transition-colors"
                title="पाठ कॉपी करें"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Spoken Text Display Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Speech Source */}
            <div className="lg:col-span-5 p-4 rounded-lg bg-[#070b12] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2">
                  <span className="font-medium">आपकी कही बात (Input Spoken):</span>
                  <span className="px-2 py-0.5 rounded bg-[#162032] text-[#cbd5e1] text-[10px]">
                    {currentResult.detectedSourceLang}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-devanagari text-[#e2e8f0] leading-relaxed">
                  "{currentResult.sourceText}"
                </p>
              </div>

              {currentResult.conversationalNote && (
                <div className="mt-4 pt-3 border-t border-[#1e293b] text-xs text-[#94a3b8] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
                  <span>{currentResult.conversationalNote}</span>
                </div>
              )}
            </div>

            {/* Translated Regional Language Speech */}
            <div className="lg:col-span-7 p-5 rounded-lg bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#fb923c] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                    {getLanguageLabel(targetLanguage)} में अनुवादित वाक्य:
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">
                    शुद्ध पहाड़ी उच्चारण
                  </span>
                </div>

                <div className="font-devanagari text-2xl sm:text-3xl font-bold text-[#f8fafc] leading-snug tracking-wide">
                  {renderDevanagariWithRetroflex(activeTranslation)}
                </div>

                <div className="mt-3 font-mono text-sm text-[#fdba74] bg-[#070b12] p-2.5 rounded-md border border-[#1e293b] leading-relaxed">
                  {currentResult.transliteration}
                </div>
              </div>

              {/* Key Spoken Vocabulary Chips */}
              {currentResult.keyVocabulary && currentResult.keyVocabulary.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1e293b]">
                  <span className="text-[11px] text-[#94a3b8] block mb-1.5 font-devanagari">
                    शब्दावली अर्थ (Key Spoken Terms):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.keyVocabulary.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-[#070b12] border border-[#1e293b] text-xs text-[#e2e8f0]"
                      >
                        <strong className="text-[#fb923c] font-semibold">{v.term}</strong>: {v.meaning}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Real-Time Language Switching Bar (Garhwali vs Kumaoni vs Jaunsari) */}
          <div className="rounded-lg bg-[#070b12] border border-[#1e293b] p-4">
            <h4 className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider mb-3 flex items-center gap-2 font-devanagari">
              <Flame className="w-3.5 h-3.5 text-[#ea580c]" />
              अन्य भाषाओं में तुरंत सुनें व तुलना करें (Tap to Switch & Listen):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Garhwali Variant Card */}
              <div
                onClick={() => {
                  handleLanguageSelect('garhwali');
                  playLanguageSpeech(currentResult.garhwaliText, 'garhwali', currentResult.dialectName, currentResult.audioBase64);
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  targetLanguage === 'garhwali'
                    ? 'bg-[#1e293b] border-[#ea580c] ring-1 ring-[#ea580c] shadow-sm'
                    : 'bg-[#0b101b] border-[#1e293b] hover:bg-[#162032] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#f8fafc] flex items-center gap-1">
                    <span>🏔️</span> गढ़वाली (Garhwali)
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#f97316]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें</span>
                  </div>
                </div>
                <p className="text-sm font-devanagari text-[#cbd5e1] line-clamp-2">
                  {renderDevanagariWithRetroflex(currentResult.garhwaliText)}
                </p>
              </div>

              {/* Kumaoni Variant Card */}
              <div
                onClick={() => {
                  handleLanguageSelect('kumaoni');
                  playLanguageSpeech(currentResult.kumaoniText, 'kumaoni', 'Kumaoni');
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  targetLanguage === 'kumaoni'
                    ? 'bg-[#1e293b] border-[#f59e0b] ring-1 ring-[#f59e0b] shadow-sm'
                    : 'bg-[#0b101b] border-[#1e293b] hover:bg-[#162032] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#f8fafc] flex items-center gap-1">
                    <span>🌸</span> कुमाऊँनी (Kumaoni)
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#f59e0b]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें</span>
                  </div>
                </div>
                <p className="text-sm font-devanagari text-[#cbd5e1] line-clamp-2">
                  {renderDevanagariWithRetroflex(currentResult.kumaoniText)}
                </p>
              </div>

              {/* Jaunsari Variant Card */}
              <div
                onClick={() => {
                  handleLanguageSelect('jaunsari');
                  playLanguageSpeech(currentResult.jaunsariText, 'jaunsari', 'Jaunsari');
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  targetLanguage === 'jaunsari'
                    ? 'bg-[#1e293b] border-[#10b981] ring-1 ring-[#10b981] shadow-sm'
                    : 'bg-[#0b101b] border-[#1e293b] hover:bg-[#162032] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#f8fafc] flex items-center gap-1">
                    <span>⚡</span> जौनसारी (Jaunsari)
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#10b981]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें</span>
                  </div>
                </div>
                <p className="text-sm font-devanagari text-[#cbd5e1] line-clamp-2">
                  {renderDevanagariWithRetroflex(currentResult.jaunsariText)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Spoken Phrases for Quick Testing in Hindi & English */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
            <h4 className="text-xs sm:text-sm font-bold text-[#f8fafc] font-devanagari">
              नमूना बातचीत वाक्य (1-क्लिक बोलें और परखें - Hindi & English):
            </h4>
          </div>
          <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
            क्लिक करते ही वर्तमान चुनी भाषा ({getLanguageLabel(targetLanguage)}) में अनुवाद व आवाज़ आएगी
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {VOICE_PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSourceLang(preset.lang);
                handleTriggerTranslation(preset.text);
              }}
              className="p-3 rounded-lg bg-[#0b101b] hover:bg-[#162032] border border-[#1e293b] hover:border-[#f97316]/50 text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#fb923c]">
                  {preset.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#f97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-[#94a3b8] font-devanagari line-clamp-2">
                "{preset.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Voice History */}
      {voiceHistory.length > 0 && (
        <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#f97316]" />
              <h4 className="text-xs sm:text-sm font-bold text-[#f8fafc] font-devanagari">
                हालिया बातचीत इतिहास (Voice History)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setVoiceHistory([])}
              className="flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>इतिहास मिटाएं</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {voiceHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-[#070b12] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#64748b]">
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span className="text-[#fb923c]">{item.targetLanguageName}</span>
                    <span>·</span>
                    <span>इनपुट: {item.sourceLang}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] italic">
                    "{item.sourceText}"
                  </p>
                  <p className="text-sm font-devanagari font-bold text-[#f8fafc]">
                    {item.translatedText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      playLanguageSpeech(item.translatedText, item.targetLanguage, undefined, item.audioBase64)
                    }
                    className="p-2 rounded-md bg-[#162032] hover:bg-[#1e293b] text-[#f97316] transition-colors"
                    title="आवाज़ सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.translatedText)}
                    className="p-2 rounded-md bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white transition-colors"
                    title="कॉपी करें"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
