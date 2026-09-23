import React from 'react';
import { Newspaper, Mic, BookOpen } from 'lucide-react';

export type MainTask = 'text' | 'voice' | 'features';

interface TaskSelectorProps {
  currentTask: MainTask;
  onSelectTask: (task: MainTask) => void;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({ currentTask, onSelectTask }) => {
  return (
    <div className="rounded-xl bg-[#0f172a] border border-[#1e293b] p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
          <span className="text-xs font-semibold text-[#f8fafc] uppercase tracking-wider font-devanagari">
            कार्य चयन (Select Studio Workflow):
          </span>
        </div>
        <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
          अपनी आवश्यकतानुसार विकल्प पर क्लिक करें
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Task 1: Text Translation */}
        <button
          type="button"
          onClick={() => onSelectTask('text')}
          className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between group relative ${
            currentTask === 'text'
              ? 'bg-[#1e293b] border-[#ea580c] ring-1 ring-[#ea580c]/50 shadow-sm'
              : 'bg-[#0b101b] border-[#1e293b] hover:border-[#334155] hover:bg-[#162032]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  currentTask === 'text'
                    ? 'bg-[#ea580c] text-white'
                    : 'bg-[#1e293b] text-[#f97316] group-hover:bg-[#334155]'
                }`}
              >
                <Newspaper className="w-4 h-4" />
              </div>
              <span className="font-heading-dev font-bold text-sm sm:text-base text-[#f8fafc]">
                1. पाठ अनुवाद
              </span>
            </div>
            {currentTask === 'text' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-950/80 text-[#fdba74] border border-orange-800/60">
                सक्रिय
              </span>
            )}
          </div>
          <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
            समाचार, आलेख, प्रेस विज्ञप्ति, वर्चुअल ळ-कीबोर्ड एवं मुद्रण प्रारूप
          </p>
        </button>

        {/* Task 2: Real-time Voice Translator */}
        <button
          type="button"
          onClick={() => onSelectTask('voice')}
          className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between group relative ${
            currentTask === 'voice'
              ? 'bg-[#1e293b] border-[#ea580c] ring-1 ring-[#ea580c]/50 shadow-sm'
              : 'bg-[#0b101b] border-[#1e293b] hover:border-[#334155] hover:bg-[#162032]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors relative ${
                  currentTask === 'voice'
                    ? 'bg-[#ea580c] text-white'
                    : 'bg-[#1e293b] text-[#f97316] group-hover:bg-[#334155]'
                }`}
              >
                <Mic className="w-4 h-4" />
              </div>
              <span className="font-heading-dev font-bold text-sm sm:text-base text-[#f8fafc] flex items-center gap-1.5">
                2. आवाज़ अनुवादक
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-950/80 text-[#fdba74] border border-orange-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse"></span>
              लाइव आवाज़
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
            बटन दबाएं, किसी भी भाषा में बोलें — तुरंत शुद्ध गढ़वळि/कुमाऊँनी/जौनसारी बोलचाल व आवाज़ में अनुवाद
          </p>
        </button>

        {/* Task 3: Other Features */}
        <button
          type="button"
          onClick={() => onSelectTask('features')}
          className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between group relative ${
            currentTask === 'features'
              ? 'bg-[#1e293b] border-[#ea580c] ring-1 ring-[#ea580c]/50 shadow-sm'
              : 'bg-[#0b101b] border-[#1e293b] hover:border-[#334155] hover:bg-[#162032]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  currentTask === 'features'
                    ? 'bg-[#ea580c] text-white'
                    : 'bg-[#1e293b] text-[#f97316] group-hover:bg-[#334155]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-heading-dev font-bold text-sm sm:text-base text-[#f8fafc]">
                3. अन्य सुविधाएं
              </span>
            </div>
            {currentTask === 'features' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-950/80 text-[#fdba74] border border-orange-800/60">
                सक्रिय
              </span>
            )}
          </div>
          <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
            8 पहाड़ी भाषाएं/बोलियां (कुमाऊँनी व जौनसारी सहित), पारिभाषिक कोश, आखाणा-पखाणा, ळ-नियम एवं API
          </p>
        </button>
      </div>
    </div>
  );
};
