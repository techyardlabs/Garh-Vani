import React, { useState } from 'react';
import { 
  Volume2, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  FileText, 
  Sparkles, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  VolumeX,
  Code2
} from 'lucide-react';
import { GarhwaliApiResponse } from '../utils/fallbackTranslator';
import { playPcmBase64, speakDevanagariFallback } from '../utils/audioPlayer';

interface EditorialResultsViewProps {
  data: GarhwaliApiResponse;
  onOpenJsonModal: () => void;
}

export const EditorialResultsView: React.FC<EditorialResultsViewProps> = ({ data, onOpenJsonModal }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeDialectTab, setActiveDialectTab] = useState<'srinagariya' | 'tehriyali' | 'salani' | 'badhani_chamoli' | 'nagpuriya' | 'jaunpuri_ravalti' | 'kumaoni' | 'jaunsari'>('srinagariya');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingDialect, setPlayingDialect] = useState<string | null>(null);
  const [showFullLexicon, setShowFullLexicon] = useState(false);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePlayAudio = async (text: string, dialectName: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setPlayingDialect(dialectName);

    try {
      // First attempt server-side Gemini TTS
      const res = await fetch('/api/garhwali/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          dialectName,
          style: 'natural Central Pahari spoken cadence with accurate retroflex ळ',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.audioBase64) {
          await playPcmBase64(json.audioBase64, json.sampleRate || 24000);
          setIsPlayingAudio(false);
          setPlayingDialect(null);
          return;
        }
      }
      // If server TTS is unavailable, fallback to Web Speech
      await speakDevanagariFallback(text);
    } catch (err) {
      console.warn('TTS fetch failed, falling back to Web Speech:', err);
      await speakDevanagariFallback(text);
    } finally {
      setIsPlayingAudio(false);
      setPlayingDialect(null);
    }
  };

  const handleDownloadPressCopy = () => {
    const content = `========================================================
गढ़-वाणी: साहित्यिक गढ़वळि सम्पादकीय एवं मुद्रण प्रति (PRESS RELEASE)
========================================================

[शीर्षक दीर्घा / HEADLINES]
मुख्य शीर्षक (Lead): ${data.editorial_headlines.lead_headline}
किकर (Kicker): ${data.editorial_headlines.kicker}
उप-शीर्षक (Subhead): ${data.editorial_headlines.subhead}
फीचर शीर्षक (Feature): ${data.editorial_headlines.feature_title}

--------------------------------------------------------
[साहित्यिक/प्रकाशन मानक गढ़वळि (STANDARD LITERARY GARHWALI)]
(श्रीनगरिया - साहित्य अकादमी एवं क्षेत्रीय समाचार मुद्रण मानक)
--------------------------------------------------------
${data.standard_literary_garhwali.devanagari}

[रोमन लिप्यंतरण / PHONETIC TRANSLITERATION]
${data.standard_literary_garhwali.transliteration}

[सम्पादकीय टिप्पणी / EDITORIAL NOTES]
${data.standard_literary_garhwali.editorial_notes}

--------------------------------------------------------
[8 प्रांतीय एवं क्षेत्रीय बोलियां तुलनात्मक रूप / REGIONAL DIALECT TRANSLATIONS]
--------------------------------------------------------
1. श्रीनगरिया (Srinagariya):
${data.dialect_translations.srinagariya.devanagari}

2. टिहरियाळि (Tehriyali):
${data.dialect_translations.tehriyali.devanagari}

3. सलाणी (Salani):
${data.dialect_translations.salani.devanagari}

4. बधाणी / चमोली (Badhani / Chamoli):
${data.dialect_translations.badhani_chamoli.devanagari}

5. नागपुरिया (Nagpuriya):
${data.dialect_translations.nagpuriya.devanagari}

6. जौनपुरी / रवाल्टी (Jaunpuri / Ravalti):
${data.dialect_translations.jaunpuri_ravalti.devanagari}

7. कुमाऊँनी (Kumaoni):
${data.dialect_translations.kumaoni?.devanagari || 'उपलब्ध'}

8. जौनसारी (Jaunsari):
${data.dialect_translations.jaunsari?.devanagari || 'उपलब्ध'}

--------------------------------------------------------
[पारिस्थितिकी एवं सांस्कृतिक शब्दावली / ECOLOGICAL LEXICON]
--------------------------------------------------------
${data.editorial_lexicon.map(item => `• ${item.term} [${item.category}]: ${item.meaning}`).join('\n')}

--------------------------------------------------------
[संदर्भित आखाणा-पखाणा / PROVERBS]
--------------------------------------------------------
${data.relevant_proverbs.map(p => `• "${p.akhana_pakhana}" (${p.transliteration})\n  अर्थ: ${p.literal_meaning}\n  सम्पादकीय उपयोग: ${p.editorial_application}`).join('\n\n')}

========================================================
गढ़-वाणी भाषाविज्ञान पीठ द्वारा सम्पादित | मानक गढ़वळि मुद्रण ब्यूरो
========================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `garh-vani-editorial-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to highlight retroflex 'ळ' in Devanagari text
  const renderHighlightedDevanagari = (text: string) => {
    if (!text.includes('ळ')) return text;
    const parts = text.split(/(ळ)/g);
    return parts.map((part, i) => {
      if (part === 'ळ') {
        return (
          <span
            key={i}
            className="text-[#fb923c] bg-orange-950/40 px-0.5 rounded font-bold underline decoration-[#ea580c] decoration-2 underline-offset-2"
            title="मानक मूर्धन्य ळ (Retroflex L)"
          >
            ळ
          </span>
        );
      }
      return part;
    });
  };

  const currentDialect = data.dialect_translations[activeDialectTab];

  return (
    <div className="space-y-6">
      {/* Editorial Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-[#162032] text-[#fb923c] font-medium border border-[#1e293b] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
            पंजीकृत शैली: {data.detected_register}
          </span>
          <span className="text-[#94a3b8]">
            स्रोत भाषा: <strong className="text-[#f8fafc]">{data.source_language}</strong>
          </span>
          <span className="text-[#475569]">|</span>
          <span className="text-[#94a3b8]">
            मुद्रण मानक: <strong className="text-[#e2e8f0]">साहित्य अकादमी एवं दैनिक प्रेस</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#fb923c]" />
            <span>Strict JSON API</span>
          </button>

          <button
            onClick={handleDownloadPressCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white border border-transparent font-medium transition-colors shadow-sm shadow-orange-950/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>प्रेस कॉपी डाउनलोड (.txt)</span>
          </button>
        </div>
      </div>

      {/* 1. NEWS HEADLINE SUITE (समाचार शीर्षक दीर्घा) */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden shadow-sm">
        <div className="border-b border-[#1e293b] bg-[#070b12] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <h3 className="font-heading-dev text-base sm:text-lg font-bold text-[#f8fafc] tracking-wide">
              समाचार शीर्षक दीर्घा (Newspaper Column Headlines)
            </h3>
          </div>
          <span className="text-xs text-[#94a3b8] hidden sm:inline">
            दैनिक समाचार पत्र एवं क्षेत्रीय प्रेस प्रारूप
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-editorial-grid">
          {/* Lead Headline */}
          <div className="p-4 rounded-lg bg-[#070b12]/95 border border-[#1e293b] relative group">
            <div className="flex items-center justify-between text-[11px] text-[#fb923c] font-medium mb-1.5">
              <span>📰 मुख्य समाचार शीर्षक (Lead Headline)</span>
              <button
                onClick={() => handleCopy(data.editorial_headlines.lead_headline, 'lead')}
                className="opacity-80 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
                title="शीर्षक कॉपी करें"
              >
                {copiedSection === 'lead' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'lead' ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
            <p className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc] leading-snug">
              {renderHighlightedDevanagari(data.editorial_headlines.lead_headline)}
            </p>
          </div>

          {/* Kicker */}
          <div className="p-4 rounded-lg bg-[#070b12]/95 border border-[#1e293b] relative group">
            <div className="flex items-center justify-between text-[11px] text-[#38bdf8] font-medium mb-1.5">
              <span>⚡ किकर / फ्लैश हेडिंग (Kicker)</span>
              <button
                onClick={() => handleCopy(data.editorial_headlines.kicker, 'kicker')}
                className="opacity-80 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
              >
                {copiedSection === 'kicker' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'kicker' ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
            <p className="font-devanagari text-base font-semibold text-[#e2e8f0] leading-relaxed">
              {renderHighlightedDevanagari(data.editorial_headlines.kicker)}
            </p>
          </div>

          {/* Subhead */}
          <div className="p-4 rounded-lg bg-[#070b12]/95 border border-[#1e293b] relative group">
            <div className="flex items-center justify-between text-[11px] text-[#a78bfa] font-medium mb-1.5">
              <span>📌 उप-शीर्षक (Subhead / Blurb)</span>
              <button
                onClick={() => handleCopy(data.editorial_headlines.subhead, 'subhead')}
                className="opacity-80 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
              >
                {copiedSection === 'subhead' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'subhead' ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
            <p className="font-devanagari text-sm font-medium text-[#cbd5e1] leading-relaxed">
              {renderHighlightedDevanagari(data.editorial_headlines.subhead)}
            </p>
          </div>

          {/* Feature Title */}
          <div className="p-4 rounded-lg bg-[#070b12]/95 border border-[#1e293b] relative group">
            <div className="flex items-center justify-between text-[11px] text-[#fb923c] font-medium mb-1.5">
              <span>✒️ फीचर / आलेख शीर्षक (Feature Column Title)</span>
              <button
                onClick={() => handleCopy(data.editorial_headlines.feature_title, 'feature')}
                className="opacity-80 group-hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1"
              >
                {copiedSection === 'feature' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'feature' ? 'कॉपी हो गया' : 'कॉपी'}</span>
              </button>
            </div>
            <p className="font-heading-dev text-base font-bold text-[#f8fafc] leading-relaxed">
              {renderHighlightedDevanagari(data.editorial_headlines.feature_title)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. STANDARD LITERARY GARHWALI (साहित्यिक/प्रकाशन मानक गढ़वळि) */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden shadow-sm">
        <div className="border-b border-[#1e293b] bg-[#070b12] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#162032] border border-orange-500/40 flex items-center justify-center text-[#f97316] font-bold text-xs">
              मानक
            </div>
            <div>
              <h3 className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc]">
                साहित्यिक/प्रकाशन मानक गढ़वळि
              </h3>
              <p className="text-xs text-[#94a3b8] font-devanagari">
                श्रीनगरिया साहित्यिक मानक • पुस्तक, समाचार एवं साहित्य अकादमी प्रकाशन योग्य
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAudio(data.standard_literary_garhwali.devanagari, 'साहित्यिक मानक गढ़वळि')}
              disabled={isPlayingAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isPlayingAudio && playingDialect === 'साहित्यिक मानक गढ़वळि'
                  ? 'bg-orange-500/20 text-[#fdba74] border-orange-500/50 animate-pulse'
                  : 'bg-[#ea580c] hover:bg-[#c2410c] text-white border-transparent shadow-sm'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>
                {isPlayingAudio && playingDialect === 'साहित्यिक मानक गढ़वळि' ? 'उच्चारण हो रहा है...' : 'शुद्ध उच्चारण सुनें'}
              </span>
            </button>

            <button
              onClick={() => handleCopy(data.standard_literary_garhwali.devanagari, 'literary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-colors"
            >
              {copiedSection === 'literary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'literary' ? 'कॉपी हो गया' : 'प्रतिलिपि'}</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 bg-editorial-grid">
          {/* Main Devanagari Literary Text */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#070b12]/95 border border-[#1e293b]">
            <p className="font-devanagari text-lg sm:text-xl text-[#f8fafc] leading-relaxed tracking-wide font-normal">
              {renderHighlightedDevanagari(data.standard_literary_garhwali.devanagari)}
            </p>
          </div>

          {/* Transliteration */}
          <div className="p-4 rounded-lg bg-[#070b12] border border-[#1e293b]">
            <div className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-semibold mb-1 flex items-center justify-between">
              <span>Phonetic Romanized Transliteration</span>
              <button
                onClick={() => handleCopy(data.standard_literary_garhwali.transliteration, 'translit')}
                className="text-[11px] text-[#94a3b8] hover:text-[#fb923c] flex items-center gap-1"
              >
                {copiedSection === 'translit' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'translit' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#cbd5e1] leading-relaxed italic">
              {data.standard_literary_garhwali.transliteration}
            </p>
          </div>

          {/* Editorial Notes */}
          <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1e293b] text-xs text-[#cbd5e1] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#fb923c] font-medium">मुद्रण समीक्षा एवं व्याकरण टिप्पणी: </strong>
              <span>{data.standard_literary_garhwali.editorial_notes}</span>
            </div>
          </div>

          {/* Retroflex ळ Audit Card */}
          {data.standard_literary_garhwali.retroflex_la_audit && data.standard_literary_garhwali.retroflex_la_audit.length > 0 && (
            <div className="rounded-lg border border-[#1e293b] bg-[#070b12] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#f8fafc] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-[#ea580c] text-white font-bold text-[10px] flex items-center justify-center">
                    ळ
                  </span>
                  मूर्धन्य 'ळ' वर्तनी ऑडिट (Retroflex Lateral Flap Audit)
                </span>
                <span className="text-[11px] text-[#94a3b8]">
                  अमानक 'ल' के स्थान पर शुद्ध 'ळ' की पुष्टि
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1e293b] text-[#94a3b8]">
                      <th className="py-1.5 px-2 font-medium">शब्द / रूप</th>
                      <th className="py-1.5 px-2 font-medium">मानक वर्तनी</th>
                      <th className="py-1.5 px-2 font-medium">भाषावैज्ञानिक एवं ध्वनि नियम</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]">
                    {data.standard_literary_garhwali.retroflex_la_audit.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#162032]">
                        <td className="py-2 px-2 font-devanagari font-medium text-[#e2e8f0]">
                          {item.word}
                        </td>
                        <td className="py-2 px-2 font-devanagari font-bold text-[#fb923c]">
                          {item.standard_spelling}
                        </td>
                        <td className="py-2 px-2 text-[#94a3b8] leading-snug">
                          {item.phonetic_rule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. 8-DIALECT COMPARATIVE STUDIO */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden shadow-sm">
        <div className="border-b border-[#1e293b] bg-[#070b12] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
            <h3 className="font-heading-dev text-base sm:text-lg font-bold text-[#f8fafc]">
              8 प्रांतीय एवं क्षेत्रीय बोलियां तुलनात्मक कक्ष (Dialect Matrix)
            </h3>
          </div>
          <span className="text-xs text-[#94a3b8]">
            घाटीवार उच्चारण, सहायक क्रियाएं एवं ध्वनि परिवर्तन
          </span>
        </div>

        {/* Dialect Tabs */}
        <div className="border-b border-[#1e293b] bg-[#070b12] px-4 flex space-x-1 overflow-x-auto scrollbar-none py-2">
          {(
            [
              { key: 'srinagariya', name: '1. श्रीनगरिया (मानक)' },
              { key: 'tehriyali', name: '2. टिहरियाळि (भागीरथी)' },
              { key: 'salani', name: '3. सलाणी (गंगा-सळान)' },
              { key: 'badhani_chamoli', name: '4. बधाणी / चमोली' },
              { key: 'nagpuriya', name: '5. नागपुरिया (मंदाकिनी)' },
              { key: 'jaunpuri_ravalti', name: '6. जौनपुरी / रवाल्टी' },
              { key: 'kumaoni', name: '7. कुमाऊँनी (Kumaoni)' },
              { key: 'jaunsari', name: '8. जौनसारी (Jaunsari)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveDialectTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-devanagari font-medium whitespace-nowrap transition-all ${
                activeDialectTab === tab.key
                  ? 'bg-[#ea580c] text-white font-semibold shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162032]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Active Dialect Content Panel */}
        <div className="p-5 sm:p-6 space-y-4 bg-editorial-grid">
          {currentDialect && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1e293b]">
                <div>
                  <h4 className="font-heading-dev text-lg font-bold text-[#f8fafc]">
                    {currentDialect.dialect_name}
                  </h4>
                  <p className="text-xs text-[#94a3b8] font-devanagari">
                    {currentDialect.dialect_features}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(currentDialect.devanagari, currentDialect.dialect_name)}
                    disabled={isPlayingAudio}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isPlayingAudio && playingDialect === currentDialect.dialect_name
                        ? 'bg-orange-500/20 text-[#fdba74] border-orange-500/50 animate-pulse'
                        : 'bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border-[#1e293b]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#f97316]" />
                    <span>
                      {isPlayingAudio && playingDialect === currentDialect.dialect_name ? 'बोल रहा है...' : 'बोली उच्चारण सुनें'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCopy(currentDialect.devanagari, activeDialectTab)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-colors"
                  >
                    {copiedSection === activeDialectTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === activeDialectTab ? 'कॉपी हो गया' : 'कॉपी'}</span>
                  </button>
                </div>
              </div>

              {/* Dialect Devanagari Text Box */}
              <div className="p-5 rounded-xl bg-[#070b12] border border-[#1e293b]">
                <p className="font-devanagari text-lg sm:text-xl text-[#f8fafc] leading-relaxed font-normal">
                  {renderHighlightedDevanagari(currentDialect.devanagari)}
                </p>
              </div>

              {/* Transliteration */}
              <div className="p-3.5 rounded-lg bg-[#070b12] border border-[#1e293b]">
                <span className="text-[10px] uppercase font-semibold text-[#94a3b8] block mb-1">
                  Roman Phonetics:
                </span>
                <p className="font-mono text-xs text-[#cbd5e1] italic">
                  {currentDialect.transliteration}
                </p>
              </div>

              {/* Morphological specifics badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                {activeDialectTab === 'srinagariya' && data.dialect_translations.srinagariya.auxiliary_verbs_used && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#fb923c] border border-[#1e293b] font-devanagari">
                    सहायक क्रियाएं: {data.dialect_translations.srinagariya.auxiliary_verbs_used.join(', ')}
                  </span>
                )}
                {activeDialectTab === 'tehriyali' && data.dialect_translations.tehriyali.basin_variations && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#38bdf8] border border-[#1e293b] font-devanagari">
                    घाटी भेद: {data.dialect_translations.tehriyali.basin_variations}
                  </span>
                )}
                {activeDialectTab === 'salani' && data.dialect_translations.salani.postposition_markers && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#a78bfa] border border-[#1e293b] font-devanagari">
                    परसर्ग विशेषता: {data.dialect_translations.salani.postposition_markers}
                  </span>
                )}
                {activeDialectTab === 'badhani_chamoli' && data.dialect_translations.badhani_chamoli.archaic_consonants && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#f43f5e] border border-[#1e293b] font-devanagari">
                    प्राचीन संयोग: {data.dialect_translations.badhani_chamoli.archaic_consonants}
                  </span>
                )}
                {activeDialectTab === 'nagpuriya' && data.dialect_translations.nagpuriya.tonal_cadences && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#fbbf24] border border-[#1e293b] font-devanagari">
                    स्वर आरोह-अवरोह: {data.dialect_translations.nagpuriya.tonal_cadences}
                  </span>
                )}
                {activeDialectTab === 'jaunpuri_ravalti' && data.dialect_translations.jaunpuri_ravalti.transitional_markers && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#e879f9] border border-[#1e293b] font-devanagari">
                    सीमांत लक्षण: {data.dialect_translations.jaunpuri_ravalti.transitional_markers}
                  </span>
                )}
                {activeDialectTab === 'kumaoni' && (data.dialect_translations as any).kumaoni?.kumaoni_markers && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#38bdf8] border border-[#1e293b] font-devanagari">
                    कुमाऊँनी लक्षण: {(data.dialect_translations as any).kumaoni.kumaoni_markers}
                  </span>
                )}
                {activeDialectTab === 'jaunsari' && (data.dialect_translations as any).jaunsari?.jaunsari_markers && (
                  <span className="px-2.5 py-1 rounded bg-[#162032] text-[#fb923c] border border-[#1e293b] font-devanagari">
                    जौनसारी व्याकरण: {(data.dialect_translations as any).jaunsari.jaunsari_markers}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. EDITORIAL LEXICON & RELEVANT PROVERBS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editorial Lexicon */}
        <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden shadow-sm flex flex-col">
          <div className="border-b border-[#1e293b] bg-[#070b12] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#fb923c]" />
              <h4 className="font-heading-dev text-base font-bold text-[#f8fafc]">
                पारिस्थितिकी एवं सांस्कृतिक कोश (Specialized Lexicon)
              </h4>
            </div>
            <span className="text-[11px] text-[#94a3b8]">
              {data.editorial_lexicon.length} विशिष्ट पद
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 bg-editorial-grid">
            {data.editorial_lexicon.slice(0, showFullLexicon ? undefined : 3).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#070b12] border border-[#1e293b] text-xs hover:border-[#334155] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-devanagari font-bold text-sm text-[#f8fafc]">
                    {item.term}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#162032] text-[#38bdf8] border border-[#1e293b]">
                    {item.category}
                  </span>
                </div>
                <p className="text-[#cbd5e1] mb-1.5 leading-relaxed">
                  {item.meaning}
                </p>
                <div className="text-[11px] text-[#94a3b8] bg-[#0b101b] p-2 rounded border border-[#1e293b]">
                  <strong className="text-[#fb923c]">पत्रकारीय संदर्भ: </strong>
                  <span>{item.journalistic_context}</span>
                </div>
              </div>
            ))}

            {data.editorial_lexicon.length > 3 && (
              <button
                onClick={() => setShowFullLexicon(!showFullLexicon)}
                className="w-full py-1.5 text-center text-xs text-[#fb923c] hover:text-white font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span>{showFullLexicon ? 'कम दिखाएं' : `और ${data.editorial_lexicon.length - 3} शब्दावली देखें`}</span>
                {showFullLexicon ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Relevant Akhana / Pakhana (Proverbs) */}
        <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden shadow-sm flex flex-col">
          <div className="border-b border-[#1e293b] bg-[#070b12] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ea580c]" />
              <h4 className="font-heading-dev text-base font-bold text-[#f8fafc]">
                संदर्भित आखाणा-पखाणा (Relevant Proverbs)
              </h4>
            </div>
            <span className="text-[11px] text-[#94a3b8]">
              लोक-दर्शन एवं सम्पादकीय प्रयोग
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 bg-editorial-grid">
            {data.relevant_proverbs.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#070b12] border border-[#1e293b] text-xs hover:border-[#334155] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-heading-dev text-sm font-bold text-[#fdba74]">
                    "{p.akhana_pakhana}"
                  </p>
                  <button
                    onClick={() => handleCopy(p.akhana_pakhana, `prov-${idx}`)}
                    className="text-[#94a3b8] hover:text-white"
                    title="आखाणा कॉपी करें"
                  >
                    {copiedSection === `prov-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-[#94a3b8] italic mb-1">
                  {p.transliteration}
                </p>
                <p className="text-[#cbd5e1] mb-1.5 leading-snug">
                  <strong className="text-[#f8fafc]">भावार्थ: </strong> {p.literal_meaning}
                </p>
                <div className="text-[11px] text-[#94a3b8] bg-[#0b101b] p-2 rounded border border-[#1e293b]">
                  <strong className="text-[#fb923c]">सम्पादकीय प्रयोग: </strong> {p.editorial_application}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
