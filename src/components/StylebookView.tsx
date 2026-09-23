import React from 'react';
import { Feather, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { RETROFLEX_RULES } from '../data/garhwaliData';

export const StylebookView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Masthead */}
      <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#162032] border border-orange-500/40 flex items-center justify-center text-[#f97316]">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading-dev text-xl sm:text-2xl font-bold text-[#f8fafc]">
              साहित्यिक एवं मुद्रण वर्तनी मार्गदर्शिका (Regional Publishing Stylebook)
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-devanagari">
              साहित्य अकादमी, दैनिक समाचार पत्र, 'चिट्ठी-पत्री' एवं 'हिलांस' पत्रिकाओं के स्वीकृत मुद्रण नियम
            </p>
          </div>
        </div>
      </div>

      {/* Retroflex ळ Rules Section */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1e293b]">
          <span className="w-7 h-7 rounded-lg bg-[#ea580c] text-white font-bold text-base flex items-center justify-center font-devanagari">
            ळ
          </span>
          <div>
            <h3 className="font-heading-dev text-lg sm:text-xl font-bold text-[#f8fafc]">
              मूर्धन्य 'ळ' (Retroflex L) - मुद्रण अनिवार्यता
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Central Pahari Retroflex Lateral Flap Rules & Print Standards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RETROFLEX_RULES.map((rule, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#070b12] border border-[#1e293b] space-y-2">
              <h4 className="font-heading-dev text-base font-bold text-[#f8fafc] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {rule.char}
              </h4>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {rule.usage}
              </p>
              <div className="p-2.5 rounded bg-[#162032] border border-[#1e293b] text-xs font-devanagari">
                <strong className="text-[#fb923c] block text-[11px] mb-0.5">उदाहरण:</strong>
                <span className="text-[#f1f5f9]">{rule.examples}</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] italic">
                {rule.editorialStandard}
              </p>
            </div>
          ))}
        </div>

        {/* Incorrect vs Correct Orthography Table */}
        <div className="rounded-xl border border-[#1e293b] bg-[#070b12] overflow-hidden">
          <div className="p-3.5 bg-[#111827] border-b border-[#1e293b] text-xs font-semibold text-[#f8fafc] flex items-center justify-between">
            <span>अशुद्ध 'ल' बनाम मानक 'ळ' तालिका (Press Proofreading Chart)</span>
            <span className="text-[11px] text-[#94a3b8]">समाचार प्रूफ-रीडिंग संदर्भ</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-[#94a3b8] bg-[#070b12]">
                <th className="p-3">अमानक रूप (ल - Incorrect)</th>
                <th className="p-3">साहित्यिक/प्रकाशन मानक (ळ - Correct)</th>
                <th className="p-3">अर्थ (Meaning)</th>
                <th className="p-3">व्याकरणिक नियम</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              <tr className="hover:bg-[#162032]">
                <td className="p-3 font-devanagari text-rose-400 line-through">बलद (Balad)</td>
                <td className="p-3 font-devanagari font-bold text-[#fb923c]">बळद (Baḷad)</td>
                <td className="p-3 text-[#cbd5e1]">बैल (Bullock)</td>
                <td className="p-3 text-[#94a3b8]">Intervocalic retroflex consonant</td>
              </tr>
              <tr className="hover:bg-[#162032]">
                <td className="p-3 font-devanagari text-rose-400 line-through">गली (Gali)</td>
                <td className="p-3 font-devanagari font-bold text-[#fb923c]">गळि (Gaḷi)</td>
                <td className="p-3 text-[#cbd5e1]">सड़क / पगडंडी (Path/Alley)</td>
                <td className="p-3 text-[#94a3b8]">Short terminal -i with retroflex flap</td>
              </tr>
              <tr className="hover:bg-[#162032]">
                <td className="p-3 font-devanagari text-rose-400 line-through">बुग्याल (Bugyal)</td>
                <td className="p-3 font-devanagari font-bold text-[#fb923c]">बुग्याळ (Bugyāḷ)</td>
                <td className="p-3 text-[#cbd5e1]">अल्पाइन चारागाह (Alpine meadow)</td>
                <td className="p-3 text-[#94a3b8]">Geographical Central Pahari nominal suffix</td>
              </tr>
              <tr className="hover:bg-[#162032]">
                <td className="p-3 font-devanagari text-rose-400 line-through">नौला (Naula)</td>
                <td className="p-3 font-devanagari font-bold text-[#fb923c]">नौळा (Nauḷā)</td>
                <td className="p-3 text-[#cbd5e1]">पारंपरिक जल-कुंड (Traditional stepwell)</td>
                <td className="p-3 text-[#94a3b8]">Hydrological heritage noun preserves lateral flap</td>
              </tr>
              <tr className="hover:bg-[#162032]">
                <td className="p-3 font-devanagari text-rose-400 line-through">शीतल (Sheetal)</td>
                <td className="p-3 font-devanagari font-bold text-[#fb923c]">सीतळ (Sītaḷ)</td>
                <td className="p-3 text-[#cbd5e1]">ठंडा / शांत (Cool/Pleasant)</td>
                <td className="p-3 text-[#94a3b8]">Phonetic softening of sibilant + retroflex lateral</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Press Headlines & Register Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] space-y-3">
          <h3 className="font-heading-dev text-base font-bold text-[#f8fafc] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            समाचार शीर्षक रचना नियम (Headline Conventions)
          </h3>
          <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>संक्षिप्त व धारदार:</strong> मुख्य समाचार शीर्षक में अनावश्यक सहायक क्रियाएं (उदा. 'है/थी') न जोड़ें; गढ़वळि में क्रिया-रूप स्वयं काल का बोध कराता है (उदा. <em>'अलकनंदा उफाण पर, राजमार्ग बन्द'</em>)।
            </li>
            <li>
              <strong>किकर (Kicker):</strong> समाचार की आंचलिक पृष्ठभूमि तय करने के लिए 3-5 शब्दों का किकर दें (उदा. <em>'चमोली आपदा बुलेटिन'</em> या <em>'घाटी पर्यावरण विशेष'</em>)।
            </li>
            <li>
              <strong>आंचलिक उपमा:</strong> मानवीय एवं भावनात्मक आलेखों में आखाणा या लोक-प्रतीक (उदा. <em>डांडा-कांडा, पलि-भौंत, ब्वे कु आंगण</em>) शीर्षक में सहज विश्वसनीयता जोड़ते हैं।
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] space-y-3">
          <h3 className="font-heading-dev text-base font-bold text-[#f8fafc] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#38bdf8]" />
            साहित्य अकादमी एवं समाचार पत्र संदर्भ
          </h3>
          <ul className="text-xs text-[#cbd5e1] space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>दैनिक समाचार पत्र:</strong> श्रीनगरिया आधार पर मानक मुद्रण, जहाँ 'छ/छा/छी/छन' सहायक क्रियाओं का अनुशासन बरता जाता है।
            </li>
            <li>
              <strong>चिट्ठी-पत्री एवं हिलांस पत्रिकाएं:</strong> मध्य पहाड़ी व्याकरण की शुद्धता, अवग्रह (ऽ) का संयमित प्रयोग तथा अमानक मिश्रण से परहेज।
            </li>
            <li>
              <strong>साहित्य अकादमी मान्यता:</strong> मानक गढ़वळि व कुमाऊँनी में लोक-साहित्य और समकालीन गद्य के मध्य संतुलन, तथा देवनागरी में 'ळ' की अनिवार्य प्रविष्टि।
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
