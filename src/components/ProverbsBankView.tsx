import React, { useState } from 'react';
import { Scroll, Copy, Check, Search, Sparkles, Volume2 } from 'lucide-react';
import { PROVERBS, Proverb } from '../data/garhwaliData';
import { speakDevanagariFallback } from '../utils/audioPlayer';

export const ProverbsBankView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  const filtered = PROVERBS.filter(
    (p) =>
      p.devanagari.includes(search) ||
      p.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      p.literal.toLowerCase().includes(search.toLowerCase()) ||
      p.context.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (p: Proverb, idx: number) => {
    navigator.clipboard.writeText(`"${p.devanagari}"\nअर्थ: ${p.literal}\nसम्पादकीय संदर्भ: ${p.context}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handlePlayAudio = async (text: string, idx: number) => {
    if (playingIdx !== null) return;
    setPlayingIdx(idx);
    try {
      await speakDevanagariFallback(text);
    } finally {
      setPlayingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Masthead */}
      <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Scroll className="w-5 h-5 text-[#ea580c]" />
            <h2 className="font-heading-dev text-xl sm:text-2xl font-bold text-[#f8fafc]">
              गढ़वळि एवं मध्य पहाड़ी आखाणा-पखाणा संग्रह (Proverbs & Editorial Aphorisms)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94a3b8] font-devanagari">
            पहाड़ी लोक-दर्शन, नीति-वचन एवं समाचार आलेखों में सारगर्भित प्रयोग के लिए शास्त्रीय संकलन
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-[#162032] text-[#fb923c] border border-[#1e293b] font-medium self-start md:self-auto">
          {filtered.length} संकलित आखाणा
        </span>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="आखाणा, भावार्थ या विषय खोजें..."
          className="w-full bg-[#070b12] text-[#f8fafc] text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#1e293b] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      {/* Proverbs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] hover:border-[#334155] transition-all flex flex-col justify-between shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#162032] text-[#fb923c] border border-[#1e293b]">
                  {p.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlayAudio(p.devanagari, idx)}
                    className="p-1.5 rounded text-[#94a3b8] hover:text-[#fb923c] hover:bg-[#162032] transition-colors"
                    title="आखाणा सुनें"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingIdx === idx ? 'text-[#f97316] animate-pulse' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(p, idx)}
                    className="p-1.5 rounded text-[#94a3b8] hover:text-[#fb923c] hover:bg-[#162032] transition-colors"
                    title="कॉपी करें"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <h3 className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc] mb-1 leading-snug">
                "{p.devanagari}"
              </h3>
              <p className="font-mono text-xs text-[#94a3b8] italic mb-3">
                {p.transliteration}
              </p>

              <p className="text-xs text-[#cbd5e1] leading-relaxed mb-3">
                <strong className="text-[#f8fafc]">शाब्दिक अर्थ: </strong> {p.literal}
              </p>
            </div>

            <div className="pt-2.5 border-t border-[#1e293b] bg-[#070b12] p-3 rounded-lg text-xs">
              <strong className="text-[#fb923c] text-[11px] block">सम्पादकीय एवं मुद्रण संदर्भ:</strong>
              <p className="text-[11px] text-[#94a3b8] leading-snug">
                {p.context}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
