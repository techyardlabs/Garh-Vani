import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { SAMPLE_INPUTS, SampleInput, DIALECTS } from '../data/garhwaliData';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TranslationStudioProps {
  onTranslate: (text: string, sourceLang: string, register: string, focusDialect: string) => Promise<void>;
  isLoading: boolean;
}

export const TranslationStudio: React.FC<TranslationStudioProps> = ({ onTranslate, isLoading }) => {
  const [inputText, setInputText] = useState(SAMPLE_INPUTS[0].text);
  const [sourceLang, setSourceLang] = useState<'Auto' | 'Hindi' | 'English'>('Hindi');
  const [register, setRegister] = useState<'साहित्यिक / पत्रकारीय' | 'लोकवार्ता / बोलचाल' | 'शासकीय / प्रेस विज्ञप्ति'>('साहित्यिक / पत्रकारीय');
  const [focusDialect, setFocusDialect] = useState<string>('all');
  const [, setCopiedPreset] = useState<number | null>(null);

  const handleInsertChar = (char: string) => {
    setInputText((prev) => prev + char);
  };

  const handleSelectSample = (sample: SampleInput, index: number) => {
    setInputText(sample.text);
    setSourceLang(sample.sourceLang);
    setCopiedPreset(index);
    setTimeout(() => setCopiedPreset(null), 1500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onTranslate(inputText, sourceLang, register, focusDialect);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="space-y-4">
      {/* Sample Presets Strip */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#f8fafc] flex items-center gap-1.5 font-devanagari">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
            मानक क्षेत्रीय आलेख एवं समाचार नमूना (Editorial Presets):
          </span>
          <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
            क्लिक करके नमूना पाठ लोड करें
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {SAMPLE_INPUTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample, idx)}
              className="text-left p-2.5 rounded-lg bg-[#0b101b] hover:bg-[#162032] border border-[#1e293b] hover:border-[#f97316]/50 transition-all text-xs group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-medium text-[#fb923c] block mb-0.5">
                  {sample.category} · {sample.sourceLang}
                </span>
                <p className="font-devanagari font-medium text-[#e2e8f0] group-hover:text-white line-clamp-1">
                  {sample.title}
                </p>
              </div>
              <span className="text-[10px] text-[#94a3b8] mt-1 italic line-clamp-1 font-devanagari">
                {sample.headlineHint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Card */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-sm overflow-hidden">
        {/* Input Configuration Bar */}
        <div className="border-b border-[#1e293b] bg-[#070b12] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Source Language Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8] font-medium">स्रोत भाषा:</span>
            <div className="flex rounded-md bg-[#162032] p-0.5 border border-[#1e293b]">
              {(['Auto', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSourceLang(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    sourceLang === lang
                      ? 'bg-[#ea580c] text-white font-semibold'
                      : 'text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  {lang === 'Auto' ? 'स्वतः (Auto)' : lang === 'Hindi' ? 'हिन्दी (Hindi)' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Register Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#94a3b8] font-medium">सम्पादकीय शैली / टोन:</span>
            <select
              value={register}
              onChange={(e) => setRegister(e.target.value as any)}
              className="bg-[#162032] text-[#f8fafc] border border-[#1e293b] rounded-md px-2.5 py-1 text-xs font-devanagari focus:outline-none focus:border-[#ea580c]"
            >
              <option value="साहित्यिक / पत्रकारीय">साहित्यिक / पत्रकारीय मानक (High Register Editorial)</option>
              <option value="लोकवार्ता / बोलचाल">लोकवार्ता / बोलचाल (Conversational & Folk Cadence)</option>
              <option value="शासकीय / प्रेस विज्ञप्ति">शासकीय / प्रेस विज्ञप्ति (Official Press Release)</option>
            </select>
          </div>

          {/* Focus Dialect */}
          <div className="flex items-center gap-2">
            <span className="text-[#94a3b8] font-medium">क्षेत्रीय लक्ष्य:</span>
            <select
              value={focusDialect}
              onChange={(e) => setFocusDialect(e.target.value)}
              className="bg-[#162032] text-[#f8fafc] border border-[#1e293b] rounded-md px-2.5 py-1 text-xs font-devanagari focus:outline-none focus:border-[#ea580c]"
            >
              <option value="all">सबी 8 बोलियां व भाषाएं (All Dialects & Languages)</option>
              {DIALECTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameDevanagari}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 bg-editorial-grid">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="यहाँ हिन्दी या अंग्रेजी समाचार पाठ, आलेख, संवाद या प्रेस नोट प्रविष्ट करें... (Type or paste Hindi or English text here)"
            className="w-full bg-[#070b12]/95 text-[#f8fafc] placeholder-[#64748b] p-4 rounded-lg border border-[#1e293b] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/40 font-devanagari text-base sm:text-lg leading-relaxed transition-all resize-y"
          />

          {/* Virtual Character Assistant */}
          <div className="mt-3">
            <VirtualKeyboard onInsertChar={handleInsertChar} />
          </div>

          {/* Actions Bar */}
          <div className="mt-3 pt-3 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-3 text-xs text-[#94a3b8]">
            <div className="flex items-center gap-3">
              <span>
                शब्द: <strong className="text-[#f8fafc]">{wordCount}</strong>
              </span>
              <span>·</span>
              <span>
                वर्ण: <strong className="text-[#f8fafc]">{charCount}</strong>
              </span>
              <span className="hidden sm:inline text-[#475569]">|</span>
              <span className="hidden sm:inline text-[#64748b]">
                शॉर्टकट: <strong>Ctrl / ⌘ + Enter</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputText('')}
                className="px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white border border-[#1e293b] transition-colors flex items-center gap-1.5"
                title="साफ करें"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>खाली करें</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-devanagari font-bold text-sm tracking-wide transition-all ${
                  isLoading || !inputText.trim()
                    ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed border border-[#334155]'
                    : 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm shadow-orange-950/40 ring-1 ring-orange-400/40 hover:scale-[1.01]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {isLoading ? 'भाषावैज्ञानिक विश्लेषण व अनुवाद जारी...' : 'गढ़वळि मा अनुवाद व सम्पादन करा'}
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
