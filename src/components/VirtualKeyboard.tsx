import React from 'react';
import { HelpCircle } from 'lucide-react';

interface VirtualKeyboardProps {
  onInsertChar: (char: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onInsertChar }) => {
  const characters = [
    { char: 'ळ', label: 'Retroflex L (मूर्धन्य ळ)', desc: 'Fundamental Garhwali lateral flap (e.g. बळद, गळि, पाळ, टिहरियाळि)', primary: true },
    { char: 'ँ', label: 'चन्द्रबिन्दु (Anunasika)', desc: 'Nasalized vowel marker (गौं, भ्वैं, दाँत)' },
    { char: 'ं', label: 'अनुस्वार (Anusvara)', desc: 'Nasal homorganic (छां, जांदन, डांडा)' },
    { char: 'ऽ', label: 'अवग्रह (Avagraha)', desc: 'Vowel elongation indicator in Pahari poetry & folk songs' },
    { char: 'ण्', label: 'मूर्धन्य ण्', desc: 'Retroflex nasal consonant (बाण, घण्डियाळ, रंवाई)' },
    { char: 'ङ', label: 'कण्ठ्य ङ', desc: 'Velar nasal' },
    { char: 'ञ', label: 'तालव्य ञ', desc: 'Palatal nasal' },
    { char: 'ः', label: 'विसर्ग', desc: 'Central Pahari aspirated terminal' },
    { char: 'ऋ', label: 'स्वर ऋ', desc: 'Vocalic r' },
    { char: 'ॠ', label: 'दीर्घ ॠ', desc: 'Long vocalic r' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-[#070b12] border border-[#1e293b] text-xs">
      <div className="flex items-center gap-1 text-[11px] font-medium text-[#94a3b8] pr-2 border-r border-[#1e293b]">
        <span>पहाड़ी वर्णसहायक:</span>
      </div>

      {characters.map((item) => (
        <button
          key={item.char}
          type="button"
          onClick={() => onInsertChar(item.char)}
          title={`${item.label} - ${item.desc}`}
          className={`px-2.5 py-1 rounded font-devanagari font-medium text-sm transition-all flex items-center gap-1 ${
            item.primary
              ? 'bg-[#ea580c] text-white font-bold shadow-sm shadow-orange-950/40 hover:bg-[#c2410c] ring-1 ring-orange-400/40'
              : 'bg-[#162032] text-[#e2e8f0] hover:bg-[#1e293b] hover:text-white border border-[#1e293b]'
          }`}
        >
          <span>{item.char}</span>
          {item.primary && <span className="text-[10px] uppercase font-sans font-bold px-1 rounded bg-black/40 text-orange-200">मानक</span>}
        </button>
      ))}

      <div className="ml-auto hidden sm:flex items-center gap-1 text-[11px] text-[#94a3b8]">
        <HelpCircle className="w-3.5 h-3.5 text-[#f97316]" />
        <span>साहित्यिक मुद्रण मा 'ल' की जगह 'ळ' अनिवार्य छ</span>
      </div>
    </div>
  );
};
