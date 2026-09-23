import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { GarhwaliApiResponse } from '../utils/fallbackTranslator';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GarhwaliApiResponse | null;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garhwali-linguistic-response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e293b] bg-[#070b12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#162032] border border-orange-500/40 flex items-center justify-center text-[#f97316]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading-dev text-base font-bold text-[#f8fafc]">
                  Strict JSON Schema Response
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Validated Schema
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Compliant with Central Pahari linguistic & regional news publishing JSON specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1e293b] text-xs font-medium text-[#fb923c] border border-[#1e293b] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-xs font-medium text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#162032] text-[#94a3b8] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="p-4 flex-1 overflow-y-auto bg-[#070b12] font-mono text-xs text-[#38bdf8] leading-relaxed selection:bg-[#ea580c]/40 selection:text-white">
          <pre className="whitespace-pre-wrap break-words">{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-[#070b12] border-t border-[#1e293b] flex items-center justify-between text-xs text-[#94a3b8]">
          <span>
            API Target: <code className="text-[#fb923c]">POST /api/garhwali/translate</code>
          </span>
          <span>Zero preamble • Raw JSON compliant</span>
        </div>
      </div>
    </div>
  );
};
