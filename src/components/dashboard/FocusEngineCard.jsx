import React from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Zap,
  Target,
  Gamepad2,
  ChevronUp,
} from 'lucide-react';

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
  timerMode = 'work',
  focusTask = null,
  activeHabitStack = null,
  isFocusActive = false,
  isTimerMinimized = false,
  setIsTimerMinimized = () => {},
  isStrategyLoading = false,
  isBreakingDown = null,
  setIsFocusActive = () => {},
  startPrepare = () => {},
}) {
  const isExpanded =
    (isFocusActive || activeHabitStack) && !isTimerMinimized;

  return (
    <section
      className={`text-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out ${
        timerMode === 'hyperfocus'
          ? 'bg-fuchsia-900'
          : timerMode === 'transition'
          ? 'bg-indigo-400'
          : 'bg-slate-900'
      } ${
        isExpanded
          ? 'p-6 rounded-[3rem] opacity-100 min-h-[350px]'
          : 'p-4 rounded-2xl opacity-80 h-20'
      }`}
    >
      <div
        className={`absolute inset-0 bg-white/5 pointer-events-none transition-opacity duration-1000 ${
          isTimerRunning && !isTimerMinimized ? 'opacity-20' : 'opacity-0'
        }`}
      />

      {!isExpanded ? (
        <div className="relative z-10 flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg animate-pulse ${
                timerMode === 'hyperfocus' ? 'bg-fuchsia-600' : 'bg-indigo-600'
              }`}
            >
              {timerMode === 'hyperfocus' ? (
                <Gamepad2 className="text-white" size={16} />
              ) : (
                <Target className="text-white" size={16} />
              )}
            </div>

            <h2 className="text-sm font-black uppercase tracking-widest opacity-60 italic">
              {isTimerMinimized
                ? timerMode === 'hyperfocus'
                  ? 'בצלילה עמוקה'
                  : `בעבודה: ${focusTask?.text || activeHabitStack?.name || ''}`
                : focusTask
                ? `נבחרה משימה: ${focusTask.text}`
                : 'מנוע המיקוד ממתין למשימה...'}
            </h2>
          </div>

          {focusTask &&
            !isStrategyLoading &&
            isBreakingDown !== focusTask.id &&
            !isFocusActive &&
            !activeHabitStack &&
            timerMode !== 'hyperfocus' && (
              <button
                type="button"
                onClick={() => {
                  setIsFocusActive(true);
                  startPrepare(focusTask);
                }}
                className="bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-colors"
              >
                <Zap size={14} fill="currentColor" />
                התחל סשן מיקוד
              </button>
            )}

          {isTimerMinimized && (
            <button
              type="button"
              onClick={() => {
                setIsTimerMinimized(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white/60 hover:text-white text-[10px] uppercase font-black tracking-widest bg-white/10 px-4 py-2 rounded-xl transition-colors"
            >
              הרחב חזרה למעלה
            </button>
          )}

          {!focusTask &&
            !isTimerMinimized &&
            !isFocusActive &&
            !activeHabitStack &&
            timerMode !== 'hyperfocus' && (
              <div className="text-white/30 font-mono text-xl">--:--</div>
            )}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse">
                <Sparkles size={12} />
                הכנת AI
              </span>
            </div>

            <div className="text-xl font-mono font-black text-white/80 tabular-nums bg-white/10 px-4 py-1 rounded-xl">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-black text-white leading-tight truncate px-4">
                <span className="ml-2 inline-block align-middle">
                  {focusTask?.emoji}
                </span>
                {focusTask?.text || activeHabitStack?.name || 'מנוע מיקוד'}
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center flex-1">
              <h2 className="text-[100px] font-mono font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl">
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

              <button
                type="button"
                onClick={() => {
                  setIsTimerMinimized(true);
                  setTimeout(() => {
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }, 100);
                }}
                className="px-6 py-3 rounded-[2rem] bg-white/10 hover:bg-white/20 font-black text-sm transition-colors border border-white/20 flex items-center gap-2"
              >
                <ChevronUp size={18} />
                מזער
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
