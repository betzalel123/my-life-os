import React from 'react';
import { Sparkles, Play, Pause } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export default function FocusEngineCard({
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
}) {
  return (
    <section className="text-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out bg-slate-900 p-6 rounded-[3rem] min-h-[220px]">
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
              <Sparkles size={12} />
              פוקוס
            </span>
          </div>

          <div className="text-xl font-mono font-black text-white/80 tabular-nums bg-white/10 px-4 py-1 rounded-xl">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-2xl font-black text-white leading-tight truncate px-4">
            מנוע המיקוד ממתין למשימה...
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <h2 className="text-[72px] md:text-[100px] font-mono font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl">
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="flex justify-center gap-4 mt-auto pb-2">
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-8 py-3 rounded-[2rem] font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all ${
              isTimerRunning
                ? 'bg-amber-500 text-amber-950'
                : 'bg-emerald-500 text-emerald-950'
            }`}
          >
            {isTimerRunning ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
            {isTimerRunning ? 'השהה' : 'המשך'}
          </button>
        </div>
      </div>
    </section>
  );
}
