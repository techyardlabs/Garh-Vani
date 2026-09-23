import React, { useState } from 'react';
import { MapPin, Volume2, Sparkles, BookOpen, Compass } from 'lucide-react';
import { DIALECTS, DialectInfo } from '../data/garhwaliData';
import { speakDevanagariFallback } from '../utils/audioPlayer';

export const DialectMapView: React.FC = () => {
  const [selectedDialect, setSelectedDialect] = useState<DialectInfo>(DIALECTS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlaySample = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      await speakDevanagariFallback(text);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Masthead */}
      <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#162032] border border-orange-500/40 flex items-center justify-center text-[#f97316]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading-dev text-xl sm:text-2xl font-bold text-[#f8fafc]">
              मध्य पहाड़ी एवं उत्तराखंड प्रांतीय बोली मानचित्र (Dialectology Matrix)
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-devanagari">
              गढ़वळि, कुमाऊँनी, जौनसारी एवं उत्तराखंड की 8 प्रमुख प्रांतीय भाषाओं व बोलियों का भाषावैज्ञानिक अध्ययन
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Dialect Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIALECTS.map((dialect) => {
          const isSelected = selectedDialect.id === dialect.id;
          return (
            <div
              key={dialect.id}
              onClick={() => setSelectedDialect(dialect)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#162032] border-[#ea580c] shadow-md ring-1 ring-[#ea580c]/50'
                  : 'bg-[#0f172a] border-[#1e293b] hover:border-[#334155] hover:bg-[#131c2e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#070b12] text-[#fb923c] border border-[#1e293b]">
                    {dialect.nameEnglish.split(' ')[0]}
                  </span>
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#f97316]' : 'text-[#64748b]'}`} />
                </div>

                <h3 className="font-heading-dev text-lg font-bold text-[#f8fafc] mb-1">
                  {dialect.nameDevanagari}
                </h3>
                <p className="text-xs text-[#fb923c] font-medium mb-3">
                  {dialect.region}
                </p>
                <p className="text-xs text-[#cbd5e1] leading-relaxed mb-4">
                  {dialect.keyFeatures}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e293b] bg-[#070b12] p-3 rounded-lg">
                <span className="text-[10px] text-[#94a3b8] uppercase font-semibold block mb-1">
                  नमूना वाक्य (Sample):
                </span>
                <p className="font-devanagari text-sm font-medium text-[#f8fafc] mb-1">
                  "{dialect.samplePhrase}"
                </p>
                <p className="text-[11px] text-[#94a3b8] italic">
                  {dialect.sampleTranslation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dialect Deep-Dive Panel */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
          <div>
            <span className="text-xs text-[#fb923c] font-semibold uppercase tracking-wider">
              गहन भाषावैज्ञानिक विश्लेषण (Linguistic Profile)
            </span>
            <h3 className="font-heading-dev text-2xl font-bold text-[#f8fafc] mt-0.5">
              {selectedDialect.nameDevanagari}
            </h3>
            <p className="text-sm text-[#cbd5e1] font-medium">
              {selectedDialect.nameEnglish} · {selectedDialect.region}
            </p>
          </div>

          <button
            onClick={() => handlePlaySample(selectedDialect.samplePhrase)}
            disabled={isPlayingAudio}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium text-xs transition-colors shadow-sm shadow-orange-950/30"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'उच्चारण हो रहा है...' : 'नमूना उच्चारण सुनें'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                प्रमुख भाषावैज्ञानिक विशेषताएं (Distinctive Features)
              </h4>
              <p className="text-sm text-[#cbd5e1] leading-relaxed bg-[#070b12] p-4 rounded-lg border border-[#1e293b]">
                {selectedDialect.keyFeatures}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
                साहित्यिक व मुद्रण प्रयोग (Editorial Applications)
              </h4>
              <p className="text-sm text-[#cbd5e1] leading-relaxed bg-[#070b12] p-4 rounded-lg border border-[#1e293b]">
                {selectedDialect.linguisticNotes}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#070b12] p-5 rounded-xl border border-[#1e293b]">
              <span className="text-xs font-semibold text-[#fb923c] block mb-2 font-devanagari">
                प्रामाणिक वाक्य एवं अर्थ:
              </span>
              <p className="font-devanagari text-xl font-bold text-[#f8fafc] mb-2 leading-relaxed">
                "{selectedDialect.samplePhrase}"
              </p>
              <div className="text-xs text-[#94a3b8] border-t border-[#1e293b] pt-2 space-y-1">
                <p><strong className="text-[#f8fafc]">हिन्दी व अंग्रेजी अनुवाद:</strong> {selectedDialect.sampleTranslation}</p>
                <p><strong className="text-[#fb923c]">मुद्रण मानकता:</strong> {selectedDialect.id === 'srinagariya' ? 'अखिल-गढ़वाल साहित्यिक मानक (Sahitya Akademi / Newspaper benchmark)' : 'घाटी-विशिष्ट लोकवार्ता एवं संवाद मानक'}</p>
              </div>
            </div>

            {/* Quick Dialect Comparison Table */}
            <div className="bg-[#070b12] p-4 rounded-lg border border-[#1e293b] text-xs">
              <span className="text-[11px] font-semibold text-[#94a3b8] uppercase block mb-2">
                केंद्रीय क्रिया तुलना (Verb Comparison: "वह गया"):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-devanagari">
                <div className="p-2 rounded bg-[#162032] border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">श्रीनगरिया</span>
                  <span className="font-bold text-[#f8fafc]">ऊ ग्या</span>
                </div>
                <div className="p-2 rounded bg-[#162032] border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">टिहरियाळि</span>
                  <span className="font-bold text-[#f8fafc]">ऊ गै</span>
                </div>
                <div className="p-2 rounded bg-[#162032] border border-[#1e293b]">
                  <span className="text-[10px] text-[#94a3b8] block">सलाणी</span>
                  <span className="font-bold text-[#f8fafc]">ऊ ग्यो</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
