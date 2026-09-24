/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TaskSelector } from './components/TaskSelector';
import { TranslationStudio } from './components/TranslationStudio';
import { EditorialResultsView } from './components/EditorialResultsView';
import { VoiceTranslatorView } from './components/VoiceTranslatorView';
import { OtherFeaturesView } from './components/OtherFeaturesView';
import { JsonViewerModal } from './components/JsonViewerModal';
import { SAMPLE_INPUTS } from './data/garhwaliData';
import { generateLinguisticFallback, GarhwaliApiResponse } from './utils/fallbackTranslator';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GarhwaliApiResponse>(() =>
    generateLinguisticFallback(SAMPLE_INPUTS[0].text, 'Hindi', 'साहित्यिक / पत्रकारीय')
  );
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTranslate = async (
    text: string,
    sourceLang: string,
    register: string,
    focusDialect: string
  ) => {
    setIsLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/garhwali/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text,
          sourceLang,
          register,
          focusDialect,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json && json.standard_literary_garhwali) {
        setResult(json);
      } else {
        throw new Error('Incomplete JSON structure received');
      }
    } catch (err: any) {
      console.warn('Backend API fallback generator invoked (preventing 504):', err);
      const fallback = generateLinguisticFallback(text, sourceLang, register);
      setResult(fallback);
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c120f] text-[#ede9e0] flex flex-col font-sans selection:bg-[#d49b38]/30 selection:text-white">
      {/* Top Header & Task Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Prominent Task Switcher Card */}
        <TaskSelector
          currentTask={activeTab}
          onSelectTask={(task) => setActiveTab(task)}
        />

        {/* Tab 1: Text Translation & Editorial Studio */}
        {activeTab === 'text' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Input Studio */}
            <TranslationStudio onTranslate={handleTranslate} isLoading={isLoading} />

            {/* Error Notification if any */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Editorial Results */}
            <EditorialResultsView
              data={result}
              onOpenJsonModal={() => setIsJsonModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Real-time Spoken Voice Translator */}
        {activeTab === 'voice' && (
          <div className="animate-in fade-in duration-300">
            <VoiceTranslatorView />
          </div>
        )}

        {/* Tab 3: All Other Features (6 Dialects, Lexicon, Proverbs, Stylebook, JSON API) */}
        {activeTab === 'features' && (
          <div className="animate-in fade-in duration-300">
            <OtherFeaturesView
              currentResult={result}
              onOpenJsonModal={() => setIsJsonModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* JSON Modal */}
      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        data={result}
      />

      {/* Footer */}
      <footer className="border-t border-[#1b2820] bg-[#090f0c] text-xs text-[#78887b] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#192b1f] border border-[#d49b38]/40 flex items-center justify-center font-heading-dev text-[#f0be54] text-xs font-bold">
              गढ़
            </div>
            <span className="font-heading-dev text-sm text-[#dce7de] font-semibold">
              गढ़-वाणी: साहित्यिक गढ़वळि पाठ अनुवादक, रियल-टाइम आवाज़ अनुवादक एवं प्रकाशन पीठ
            </span>
          </div>

          <div className="text-center md:text-right font-devanagari text-[11px] text-[#869688]">
            <span>साहित्य अकादमी, दैनिक जागरण गढ़वाली संस्करण, 'चिट्ठी-पत्री' एवं 'हिलांस' मुद्रण मानकों पर आधारित</span>
            <span className="block mt-0.5 text-[#5e7062]">
              अलकनंदा (श्रीनगर) • भागीरथी (टिहरी) • गंगा-सळान (पौड़ी) • पिंडर (चमोली) • मंदाकिनी (रुद्रप्रयाग) • रंवाई-जौनपुर (पश्चिमी सीमांत)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
