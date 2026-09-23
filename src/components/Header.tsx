import React from 'react';
import { Newspaper, Mic, BookOpen, Sparkles } from 'lucide-react';
import { DIALECTS } from '../data/garhwaliData';

export type ActiveTab = 'text' | 'voice' | 'features';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  apiConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-[#1e293b] bg-[#0c121e]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Editorial Kicker Bar */}
      <div className="border-b border-[#1e293b]/70 bg-[#070b12] px-4 sm:px-6 py-1.5 text-xs text-[#94a3b8] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[#f97316] font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            साहित्यिक एवं मुद्रण पीठ (Central Pahari Editorial Standards)
          </span>
          <span className="hidden lg:inline text-[#64748b]">·</span>
          <span className="hidden lg:inline text-[#94a3b8]">
            गढ़वळि, कुमाऊँनी व जौनसारी भाषा वैज्ञानिक कोश
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#cbd5e1]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            8 पहाड़ी बोलियां व भाषाएं सक्रिय
          </span>
          <span className="hidden sm:inline text-[#475569]">·</span>
          <span className="hidden sm:inline font-devanagari text-[#e2e8f0]">
            दैनिक जागरण · चिट्ठी-पत्री · हिलांस मुद्रण शैली
          </span>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#ea580c] via-[#c2410c] to-[#9a3412] flex items-center justify-center shadow-md shadow-orange-950/30 ring-1 ring-orange-400/30 shrink-0">
            <span className="font-heading-dev text-2xl text-white font-bold leading-none">गढ़</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-heading-dev font-bold tracking-tight text-[#f8fafc]">
                गढ़-वाणी
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#1e293b] text-[#fb923c] border border-[#334155]">
                भाषाविज्ञान, स्वर व सम्पादक पीठ
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] font-devanagari mt-0.5">
              साहित्यिक गढ़वळि, कुमाऊँनी व जौनसारी पाठ एवं रियल-टाइम आवाज़ अनुवादक ब्यूरो
            </p>
          </div>
        </div>

        {/* Dialect Indicator Strip */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-lg bg-[#0a0f18] border border-[#1e293b]">
          <span className="text-[11px] text-[#64748b] px-2 font-medium">अंचल:</span>
          {DIALECTS.map((d) => (
            <span
              key={d.id}
              title={d.region}
              className="text-[11px] px-2 py-0.5 rounded text-[#cbd5e1] hover:text-[#f97316] font-devanagari transition-colors"
            >
              {d.nameDevanagari.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Primary Navigation - 3 Core Tasks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1.5 py-1.5 border-t border-[#1e293b]/80">
          {/* Task 1: Text Translation */}
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-[#ea580c] text-white shadow-sm shadow-orange-950/40'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/60'
            }`}
          >
            <Newspaper className={`w-4 h-4 ${activeTab === 'text' ? 'text-white' : 'text-[#f97316]'}`} />
            <span>1. पाठ अनुवाद (Text Translation)</span>
          </button>

          {/* Task 2: Live Voice Translator */}
          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'voice'
                ? 'bg-[#ea580c] text-white shadow-sm shadow-orange-950/40'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/60'
            }`}
          >
            <div className="relative">
              <Mic className={`w-4 h-4 ${activeTab === 'voice' ? 'text-white' : 'text-[#f97316]'}`} />
              {activeTab !== 'voice' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f97316] animate-ping"></span>
              )}
            </div>
            <span>2. आवाज़ अनुवादक (Voice Translator)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
              activeTab === 'voice' ? 'bg-orange-800 text-orange-100' : 'bg-[#1e293b] text-[#fb923c]'
            }`}>
              Live
            </span>
          </button>

          {/* Task 3: Other Features */}
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'features'
                ? 'bg-[#ea580c] text-white shadow-sm shadow-orange-950/40'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/60'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'features' ? 'text-white' : 'text-[#f97316]'}`} />
            <span>3. अन्य सुविधाएं (Other Features)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
