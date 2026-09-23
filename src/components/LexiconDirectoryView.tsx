import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Filter, Sparkles, Compass } from 'lucide-react';
import { LEXICON, LexiconItem } from '../data/garhwaliData';

export const LexiconDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const categories = ['All', 'Ecological', 'Topographical', 'Cultural', 'Social/Kinship'];

  const filteredLexicon = LEXICON.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.journalisticContext.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, term: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Intro Masthead */}
      <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <BookOpen className="w-5 h-5 text-[#f97316]" />
            <h2 className="font-heading-dev text-xl sm:text-2xl font-bold text-[#f8fafc]">
              हिमालयी पारिभाषिक एवं सांस्कृतिक कोश (Specialized Lexicon)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94a3b8] font-devanagari">
            धारा, गधेरा, बुग्याल, मैती, नौला, डांडा-कांडा, बांद एवं रंवाई-जौनपुर विशिष्ट आंचलिक शब्दावली
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-[#162032] text-[#fb923c] border border-[#1e293b] font-medium">
            {filteredLexicon.length} प्रामाणिक पद
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शब्दावली या अर्थ खोजें... (Search terms)"
            className="w-full bg-[#070b12] text-[#f8fafc] text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#1e293b] focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#ea580c] text-white font-semibold shadow-sm'
                  : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#162032] border border-[#1e293b]'
              }`}
            >
              {cat === 'All' ? 'समस्त शब्दावली (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lexicon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLexicon.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] hover:border-[#334155] transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#162032] text-[#38bdf8] border border-[#1e293b]">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(`${item.term}: ${item.meaning}`, item.term)}
                  className="text-[#64748b] hover:text-[#fb923c] transition-colors p-1"
                  title="पद कॉपी करें"
                >
                  {copiedTerm === item.term ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h3 className="font-heading-dev text-xl font-bold text-[#f8fafc] mb-0.5">
                {item.term}
              </h3>
              <p className="font-mono text-[11px] text-[#94a3b8] italic mb-3">
                {item.transliteration}
              </p>

              <p className="text-xs text-[#cbd5e1] leading-relaxed mb-3">
                {item.meaning}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#1e293b] bg-[#070b12] p-3 rounded-lg text-xs">
              <div>
                <strong className="text-[#fb923c] text-[11px] block">पत्रकारीय एवं मुद्रण संदर्भ:</strong>
                <p className="text-[11px] text-[#94a3b8] leading-snug">
                  {item.journalisticContext}
                </p>
              </div>

              <div className="pt-1.5 border-t border-[#1e293b]">
                <strong className="text-[#38bdf8] text-[11px] block font-devanagari">वाक्य प्रयोग:</strong>
                <p className="font-devanagari text-xs text-[#f1f5f9] italic">
                  "{item.exampleSentence}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
