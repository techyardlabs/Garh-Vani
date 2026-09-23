import React, { useState } from 'react';
import { MapPin, BookOpen, Scroll, Feather, Code2, Sparkles, Layers } from 'lucide-react';
import { DialectMapView } from './DialectMapView';
import { LexiconDirectoryView } from './LexiconDirectoryView';
import { ProverbsBankView } from './ProverbsBankView';
import { StylebookView } from './StylebookView';
import { GarhwaliApiResponse } from '../utils/fallbackTranslator';

export type SubFeatureTab = 'dialects' | 'lexicon' | 'proverbs' | 'stylebook' | 'json';

interface OtherFeaturesViewProps {
  initialSubTab?: SubFeatureTab;
  currentResult: GarhwaliApiResponse;
  onOpenJsonModal: () => void;
}

export const OtherFeaturesView: React.FC<OtherFeaturesViewProps> = ({
  initialSubTab = 'dialects',
  currentResult,
  onOpenJsonModal,
}) => {
  const [subTab, setSubTab] = useState<SubFeatureTab>(initialSubTab);

  const subFeatures = [
    {
      id: 'dialects' as SubFeatureTab,
      label: '8 भाषाएं व बोलियां',
      sub: 'गढ़वळि, कुमाऊँनी, जौनसारी, अलकनंदा, भागीरथी आदि',
      icon: MapPin,
    },
    {
      id: 'lexicon' as SubFeatureTab,
      label: 'पारिभाषिक कोश',
      sub: 'पर्यावरण, भूगोल, कृषि व सांस्कृतिक पदावली',
      icon: BookOpen,
    },
    {
      id: 'proverbs' as SubFeatureTab,
      label: 'आखाणा-पखाणा',
      sub: 'प्राचीन लोकोक्तियां व पत्रकारीय संदर्भ',
      icon: Scroll,
    },
    {
      id: 'stylebook' as SubFeatureTab,
      label: 'मुद्रण मानक (Stylebook)',
      sub: 'मूर्धन्य ळ नियम, वर्तनी मानकीकरण व संपादन',
      icon: Feather,
    },
    {
      id: 'json' as SubFeatureTab,
      label: 'Strict JSON API',
      sub: 'पब्लिशिंग व एआई स्कीमा आउटपुट',
      icon: Code2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Feature Tab Bar */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] p-2.5 sm:p-3 shadow-sm">
        <div className="flex items-center gap-2 px-2 pb-2.5 mb-2 border-b border-[#1e293b]">
          <Layers className="w-4 h-4 text-[#ea580c]" />
          <h3 className="font-heading-dev text-sm sm:text-base font-bold text-[#f8fafc]">
            उत्तराखंड भाषापीठ एवं संपादकीय संसाधन (Central Pahari Linguistic Resources)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {subFeatures.map((feat) => {
            const Icon = feat.icon;
            const isSelected = subTab === feat.id;
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => setSubTab(feat.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#162032] border-[#ea580c] text-[#f8fafc] shadow-sm ring-1 ring-[#ea580c]/50'
                    : 'bg-[#070b12] border-[#1e293b] text-[#94a3b8] hover:bg-[#111827] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#f97316]' : 'text-[#64748b]'}`} />
                  <span className="font-heading-dev font-bold text-xs sm:text-sm">
                    {feat.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#94a3b8] line-clamp-1">
                  {feat.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-opacity duration-200">
        {subTab === 'dialects' && <DialectMapView />}
        {subTab === 'lexicon' && <LexiconDirectoryView />}
        {subTab === 'proverbs' && <ProverbsBankView />}
        {subTab === 'stylebook' && <StylebookView />}
        {subTab === 'json' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[#1e293b] bg-[#0f172a] flex items-center justify-between">
              <div>
                <h3 className="font-heading-dev text-xl font-bold text-[#f8fafc]">
                  Strict JSON API Specification
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Strictly conforms to publication format schema without markdown code fences or conversational preambles
                </p>
              </div>
              <button
                onClick={onOpenJsonModal}
                className="px-4 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] text-[#fb923c] border border-[#1e293b] text-xs font-semibold"
              >
                Expand Modal View
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#070b12] border border-[#1e293b] font-mono text-xs text-[#38bdf8] overflow-x-auto leading-relaxed">
              <pre>{JSON.stringify(currentResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
