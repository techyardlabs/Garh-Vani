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
} from 'lucide-react';
import { playPcmBase64, speakDevanagariFallback } from '../utils/audioPlayer';
import { VoiceTranslationResult, generateVoiceFallback } from '../utils/voiceTranslator';

interface VoiceHistoryItem {
  id: string;
  timestamp: string;
  sourceText: string;
  sourceLang: string;
  garhwaliText: string;
  transliteration: string;
  dialectName: string;
  audioBase64?: string;
}

const VOICE_PRESETS = [
  { text: 'नमस्ते, आप कैसे हैं और कहाँ जा रहे हैं?', lang: 'Hindi', label: '🙏 नमस्कार एवं हालचाल' },
  { text: 'बद्रीनाथ और केदारनाथ जाने का सीधा रास्ता किधर से है?', lang: 'Hindi', label: '🏔️ तीर्थ मार्ग व दिशा' },
  { text: 'पहाड़ों में आज बहुत ठंड है और सुंदर बर्फ गिर रही है।', lang: 'Hindi', label: '❄️ मौसम व हिमपात' },
  { text: 'गाँव में प्राकृतिक धारा का मीठा पानी कहाँ मिलेगा?', lang: 'Hindi', label: '💧 निर्मल जल व धारा' },
  { text: 'कुमाऊँ के नौले और झोड़ा-चांचरी संस्कृति बहुत सुंदर है।', lang: 'Hindi', label: '🌸 कुमाऊँनी धरोहर व नौले' },
  { text: 'हनोल में महासू देवता का दर्शन करने कब जाना चाहिए?', lang: 'Hindi', label: '⚡ महासू देवता व जौनसार' },
  { text: 'Hello, how can I travel to the high mountain meadows?', lang: 'English', label: '🇬🇧 Travel to Bugyals' },
  { text: 'यह बहुत प्राचीन और पवित्र पहाड़ी मंदिर है।', lang: 'Hindi', label: '🛕 मंदिर व संस्कृति' },
];

const DIALECT_OPTIONS = [
  { id: 'srinagariya', name: 'श्रीनगरिया (साहित्यिक मानक)', region: 'अलकनंदा घाटी', tag: 'मानक प्रेस' },
  { id: 'tehriyali', name: 'टिहरियाळि', region: 'भागीरथी-भिलंगना बेसिन', tag: 'टिहरी गढ़वाल' },
  { id: 'salani', name: 'सलाणी', region: 'गंगा-सळान / पौड़ी-कोटद्वार', tag: 'पौड़ी अंचल' },
  { id: 'badhani_chamoli', name: 'बधाणी / चमोली', region: 'पिंडर अंचल / उच्च हिमालय', tag: 'चमोली' },
  { id: 'nagpuriya', name: 'नागपुरिया', region: 'मंदाकिनी / रुद्रप्रयाग', tag: 'रुद्रप्रयाग' },
  { id: 'jaunpuri_ravalti', name: 'जौनपुरी / रवाल्टी', region: 'पश्चिमी सीमांत / यमुना घाटी', tag: 'रंवाई-जौनपुर' },
  { id: 'kumaoni', name: 'कुमाऊँनी (Kumaoni)', region: 'अल्मोड़ा / नैनीताल / पिथौरागढ़', tag: 'कुमाऊँ मानक' },
  { id: 'jaunsari', name: 'जौनसारी (Jaunsari)', region: 'चक्राता / कालसी / जौनसार-बावर', tag: 'जौनसार-बावर' },
];

export const VoiceTranslatorView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [targetDialect, setTargetDialect] = useState('srinagariya');
  const [sourceLang, setSourceLang] = useState('Auto');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<VoiceHistoryItem[]>([]);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  // Active translation result
  const [currentResult, setCurrentResult] = useState<VoiceTranslationResult>(() =>
    generateVoiceFallback('नमस्ते, आप कैसे हैं और कहाँ जा रहे हैं?', 'Hindi', 'srinagariya')
  );

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<any>(null);

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
      setLiveTranscript(spoken);

      if (final && final.trim().length > 1) {
        handleTriggerTranslation(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [targetDialect, sourceLang]);

  // Set recognition language dynamically
  const getRecognitionLang = () => {
    if (sourceLang === 'English') return 'en-US';
    if (sourceLang === 'Bengali') return 'bn-IN';
    if (sourceLang === 'Punjabi') return 'pa-IN';
    return 'hi-IN'; // Default Hindi / Indian accents
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type or use quick speech presets below.');
      return;
    }

    try {
      recognitionRef.current.lang = getRecognitionLang();
      setLiveTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Recognition start issue, restarting:', e);
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
          setIsListening(true);
        }, 150);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
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

  // Trigger translation from text (either spoken or preset)
  const handleTriggerTranslation = async (text: string) => {
    if (!text || text.trim().length === 0) return;
    setIsTranslating(true);

    try {
      const response = await fetch('/api/garhwali/voice-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          sourceLang,
          targetDialect,
        }),
      });

      let resData: VoiceTranslationResult;
      if (response.ok) {
        resData = await response.json();
      } else {
        resData = generateVoiceFallback(text, sourceLang, targetDialect);
      }

      setCurrentResult(resData);

      // Add to conversation history
      const historyEntry: VoiceHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sourceText: text,
        sourceLang: resData.detectedSourceLang || sourceLang,
        garhwaliText: resData.garhwaliText,
        transliteration: resData.transliteration,
        dialectName: resData.dialectName,
        audioBase64: resData.audioBase64,
      };

      setVoiceHistory((prev) => [historyEntry, ...prev.slice(0, 19)]);

      // Auto speak if enabled
      if (autoSpeak) {
        playGarhwaliSpeech(resData.garhwaliText, resData.dialectName, resData.audioBase64);
      }
    } catch (err) {
      console.warn('Voice translation fallback:', err);
      const fallback = generateVoiceFallback(text, sourceLang, targetDialect);
      setCurrentResult(fallback);
      if (autoSpeak) {
        playGarhwaliSpeech(fallback.garhwaliText, fallback.dialectName);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Play Garhwali spoken audio
  const playGarhwaliSpeech = async (text: string, dialectName: string, base64Audio?: string) => {
    setIsPlayingAudio(true);
    try {
      if (base64Audio) {
        await playPcmBase64(base64Audio);
        return;
      }

      // Try server TTS route first
      const ttsRes = await fetch('/api/garhwali/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          dialectName,
          style: 'authentic natural Central Pahari spoken cadence with retroflex ळ clarity',
        }),
      });

      if (ttsRes.ok) {
        const audioJson = await ttsRes.json();
        if (audioJson.audioBase64) {
          await playPcmBase64(audioJson.audioBase64, audioJson.sampleRate || 24000);
          return;
        }
      }

      // Devanagari fallback synthesis
      await speakDevanagariFallback(text);
    } catch (err) {
      console.warn('Speech playback fallback:', err);
      await speakDevanagariFallback(text);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // When user switches dialect in the view, recalculate or update current result
  const handleDialectChange = (newDialect: string) => {
    setTargetDialect(newDialect);
    if (currentResult.dialectVariants && currentResult.dialectVariants[newDialect as keyof typeof currentResult.dialectVariants]) {
      const variantText = currentResult.dialectVariants[newDialect as keyof typeof currentResult.dialectVariants];
      const opt = DIALECT_OPTIONS.find((d) => d.id === newDialect);
      setCurrentResult((prev) => ({
        ...prev,
        targetDialect: newDialect,
        dialectName: opt ? opt.name : newDialect,
        garhwaliText: variantText,
      }));
      if (autoSpeak) {
        playGarhwaliSpeech(variantText, opt?.name || newDialect);
      }
    } else {
      handleTriggerTranslation(currentResult.sourceText);
    }
  };

  // Highlight retroflex ळ in rendered text
  const renderDevanagariWithRetroflex = (text: string) => {
    if (!text.includes('ळ')) {
      return text;
    }
    const parts = text.split(/(ळ)/g);
    return parts.map((part, index) =>
      part === 'ळ' ? (
        <span
          key={index}
          className="text-[#f0be54] font-black underline decoration-[#f0be54]/60 decoration-2 underline-offset-4 bg-[#2b2413] px-1 py-0.5 rounded mx-0.5"
          title="मूर्धन्य ळ (Garhwali Retroflex ळ)"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Voice Translation Header */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-950/80 text-[#fdba74] border border-orange-800/60 text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#f97316] animate-pulse" />
                रियल-टाइम आवाज़ अनुवादक (Live Voice Mode)
              </span>
              <span className="text-xs text-[#94a3b8] hidden sm:inline">
                Central Pahari Spoken Voice Engine
              </span>
            </div>
            <h2 className="font-heading-dev text-2xl sm:text-3xl font-bold text-[#f8fafc]">
              माइक दबाएं और किसी भी भाषा में बोलें — तुरंत पहाड़ी अनुवाद
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-devanagari">
              हिन्दी, अंग्रेज़ी या किसी भी भाषा में आवाज़ इनपुट दें। सिस्टम स्वतः शुद्ध उच्चारण और 8 प्रांतीय शैलियों (कुमाऊँनी व जौनसारी सहित) में अनुवाद करेगा।
            </p>
          </div>

          {/* Quick Settings: Auto Speak & Source Language */}
          <div className="flex items-center gap-3 bg-[#070b12] p-2 rounded-lg border border-[#1e293b]">
            {/* Auto-Speak Toggle */}
            <button
              type="button"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                autoSpeak
                  ? 'bg-[#1e293b] text-[#fb923c] border border-orange-800/40'
                  : 'bg-[#0f172a] text-[#64748b] hover:text-[#94a3b8]'
              }`}
              title="अनुवाद होते ही स्वतः आवाज़ सुनाएं"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-[#f97316]" /> : <VolumeX className="w-4 h-4" />}
              <span>स्वतः बोलें: {autoSpeak ? 'चालू' : 'बंद'}</span>
            </button>

            {/* Input Language Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <Languages className="w-3.5 h-3.5 text-[#94a3b8]" />
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-[#0f172a] text-[#f8fafc] border border-[#1e293b] rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[#ea580c]"
              >
                <option value="Auto">Auto Detect (सभी भाषाएं)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="English">English</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Central Real-time Voice Controller */}
        <div className="mt-8 flex flex-col items-center justify-center py-6">
          {/* Big Mic Button with Warm Orange Glow */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-orange-600/20 animate-ping"></span>
                <span className="absolute w-48 h-48 rounded-full bg-amber-500/10 animate-pulse"></span>
              </>
            )}

            <button
              type="button"
              onClick={toggleListening}
              disabled={isTranslating}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-lg transition-all duration-200 relative z-10 ${
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
          <div className="mt-5 text-center space-y-1">
            <p className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc]">
              {isListening
                ? 'सुन रहा हूँ... अपनी बात बोलिए (Listening)'
                : isTranslating
                ? 'अनुवाद व उच्चारण तैयार हो रहा है...'
                : isPlayingAudio
                ? 'उच्चारण सुनाया जा रहा है...'
                : 'माइक दबाकर बोलना शुरू करें (Press to speak any sentence)'}
            </p>
            <p className="text-xs text-[#94a3b8] font-devanagari">
              {isListening
                ? 'बोलना समाप्त होते ही स्वतः अनुवाद हो जाएगा'
                : 'माइक्रोफोन सुविधा सभी आधुनिक ब्राउज़रों में सक्रिय है'}
            </p>
          </div>

          {/* Live Interim Transcript Bubble */}
          {(liveTranscript || isListening) && (
            <div className="mt-4 max-w-xl w-full mx-auto p-4 rounded-lg bg-[#070b12] border border-[#1e293b] text-center animate-in fade-in">
              <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider block mb-1">
                पहचाने गए शब्द (Speech Transcript):
              </span>
              <p className="text-base sm:text-lg font-devanagari text-[#f8fafc] italic">
                "{liveTranscript || 'बोलिए...'}"
              </p>
            </div>
          )}
        </div>

        {/* Target Dialect Bar */}
        <div className="mt-6 pt-5 border-t border-[#1e293b]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#f97316]" />
              <span className="text-xs font-bold text-[#f8fafc] uppercase font-devanagari">
                आवाज़ की लक्षित बोली व भाषा (Target Dialect / Language):
              </span>
            </div>
            <span className="text-[11px] text-[#94a3b8]">
              किसी भी बोली पर क्लिक करके उच्चारण सुनें
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {DIALECT_OPTIONS.map((dialect) => {
              const isSelected = targetDialect === dialect.id;
              return (
                <button
                  key={dialect.id}
                  type="button"
                  onClick={() => handleDialectChange(dialect.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-[#1e293b] border-[#ea580c] text-white shadow-sm ring-1 ring-[#ea580c]/50'
                      : 'bg-[#0b101b] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-heading-dev font-bold text-xs">
                      {dialect.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#64748b] truncate">
                    {dialect.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Spoken Translation Output Card */}
      {currentResult && (
        <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#1e293b] border border-orange-500/30 flex items-center justify-center text-[#f97316]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] block">
                  अनुवादित स्वर (Spoken Result)
                </span>
                <h3 className="font-heading-dev font-bold text-lg text-[#f8fafc]">
                  {currentResult.dialectName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Replay Audio Button */}
              <button
                type="button"
                onClick={() =>
                  playGarhwaliSpeech(
                    currentResult.garhwaliText,
                    currentResult.dialectName,
                    currentResult.audioBase64
                  )
                }
                disabled={isPlayingAudio}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs transition-colors shadow-sm shadow-orange-950/30"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'आवाज़ बज रही है...' : 'उच्चारण पुनः सुनें'}</span>
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(currentResult.garhwaliText)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-xs text-[#cbd5e1] hover:text-white transition-colors"
                title="पाठ कॉपी करें"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Spoken Text Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Speech Source */}
            <div className="lg:col-span-5 p-4 rounded-lg bg-[#070b12] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2">
                  <span className="font-medium">आपकी आवाज़ (Source Spoken Text):</span>
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

            {/* Translated Garhwali Speech */}
            <div className="lg:col-span-7 p-5 rounded-lg bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#fb923c] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                    पहाड़ी स्वर व वर्तनी:
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">
                    मानक मुद्रण संपुष्ट
                  </span>
                </div>

                <div className="font-devanagari text-2xl sm:text-3xl font-bold text-[#f8fafc] leading-snug tracking-wide">
                  {renderDevanagariWithRetroflex(currentResult.garhwaliText)}
                </div>

                <div className="mt-3 font-mono text-sm text-[#fdba74] bg-[#070b12] p-2.5 rounded-md border border-[#1e293b] leading-relaxed">
                  {currentResult.transliteration}
                </div>
              </div>

              {/* Key Spoken Vocabulary Chips */}
              {currentResult.keyVocabulary && currentResult.keyVocabulary.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1e293b]">
                  <span className="text-[11px] text-[#94a3b8] block mb-1.5 font-devanagari">
                    प्रयुक्त पहाड़ी शब्दावली (Dialectal Lexicon):
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

          {/* Multi-Dialect Comparison Bar */}
          {currentResult.dialectVariants && (
            <div className="rounded-lg bg-[#070b12] border border-[#1e293b] p-4">
              <h4 className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#ea580c]" />
                अन्य अंचलों व घाटियों में यह वाक्य कैसे बोला जाता है? (Click to Hear):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.entries(currentResult.dialectVariants).map(([dKey, dText]) => {
                  const opt = DIALECT_OPTIONS.find((d) => d.id === dKey);
                  const isCurrent = targetDialect === dKey;
                  return (
                    <div
                      key={dKey}
                      onClick={() => handleDialectChange(dKey)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#1e293b] border-[#ea580c] shadow-sm'
                          : 'bg-[#0b101b] border-[#1e293b] hover:bg-[#162032] hover:border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#f8fafc]">
                          {opt ? opt.name.split(' ')[0] : dKey}
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-[#f97316]" />
                      </div>
                      <p className="text-sm font-devanagari text-[#cbd5e1] line-clamp-2">
                        {renderDevanagariWithRetroflex(dText)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preset Spoken Phrases for Quick Testing */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
            <h4 className="text-xs sm:text-sm font-bold text-[#f8fafc] font-devanagari">
              नमूना बोलचाल वाक्य (1-क्लिक बोलें और परखें):
            </h4>
          </div>
          <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
            क्लिक करते ही तुरंत आवाज़ व अनुवाद सक्रिय होगा
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
                    <span className="text-[#fb923c]">{item.dialectName}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] italic">
                    "{item.sourceText}"
                  </p>
                  <p className="text-sm font-devanagari font-bold text-[#f8fafc]">
                    {item.garhwaliText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => playGarhwaliSpeech(item.garhwaliText, item.dialectName, item.audioBase64)}
                    className="p-2 rounded-md bg-[#162032] hover:bg-[#1e293b] text-[#f97316] transition-colors"
                    title="आवाज़ सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.garhwaliText)}
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
