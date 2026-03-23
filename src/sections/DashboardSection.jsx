import React from 'react';
import {
  Wallet,
  Calendar,
  Target,
  Sparkles,
  Gift,
  Lightbulb,
  Flame,
  Coffee,
  Plus,
  Circle,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  Dices,
} from 'lucide-react';

export default function DashboardSection({
  energyLevel,
  setEnergyLevel,
  tasks,
  newTask,
  setNewTask,
  addTask,
  toggleTask,
  deleteTask,
  brainDump,
  setBrainDump,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter(
    (task) => !task.completed && task.energyRequired === energyLevel
  );

  const dopamineCards = [
    {
      title: 'ריקוד ספונטני לשיר אחד',
      desc: 'בחרו שיר שאתם אוהבים ופשוט תזיזו את הגוף במשך 3 דקות.',
      icon: Sparkles,
      accent: 'text-rose-400',
    },
    {
      title: 'סידור מיקרו של משטח קטן',
      desc: 'פנו רק פינה קטנה אחת — שידה, מדף קטן או חלק מהשולחן.',
      icon: Gift,
      accent: 'text-indigo-400',
    },
    {
      title: 'שרבוט יצירתי ל־5 דקות',
      desc: 'קחו דף ועט ותעשו קווים או צורות בלי לחשוב יותר מדי.',
      icon: Lightbulb,
      accent: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-8">
        <section className="bg-[#4b566d] text-white rounded-[2.4rem] px-8 py-6 shadow-xl flex items-center justify-between min-h-[120px]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-15 h-15 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0"
            >
              {isTimerRunning ? <Pause size={26} /> : <Play size={26} />}
            </button>

            <h2 className="text-[24px] xl:text-[30px] font-black italic text-slate-200 leading-none">
              מנוע המיקוד ממתין למשימה...
            </h2>
          </div>

          <div className="text-[48px] xl:text-[58px] font-mono font-black tracking-tight opacity-85">
            {formatTime(timeLeft)}
          </div>
        </section>

        <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 min-h-[390px]">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">
            <h2 className="text-[38px] xl:text-[48px] leading-[1.02] font-black text-slate-800 text-right">
              מה כדאי לעשות עכשיו?
            </h2>

            <div className="flex items-center bg-slate-50 rounded-[2rem] border border-slate-200 p-2 gap-3">
              <span className="text-slate-400 font-bold text-sm px-2 whitespace-nowrap">
                כמה אנרגיה יש לי עכשיו?
              </span>

              <div className="flex items-center bg-slate-100 rounded-[1.4rem] p-1 gap-1">
                {[
                  { key: 'high', label: 'גבוהה' },
                  { key: 'medium', label: 'בינונית' },
                  { key: 'low', label: 'נמוכה' },
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => setEnergyLevel(lvl.key)}
                    className={`px-5 py-2 rounded-xl text-[14px] font-black transition-all ${
                      energyLevel === lvl.key
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-200/60'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              <div className="w-px h-8 bg-slate-200" />

              <div className="flex items-center gap-1 pr-1">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-indigo-500 hover:bg-white rounded-xl transition-all"
                >
                  <Dices size={20} />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-amber-500 hover:bg-white rounded-xl transition-all"
                >
                  <Sparkles size={20} />
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={addTask} className="relative mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="משהו חדש לעשות? כתבו כאן..."
              className="w-full h-[76px] bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-4 pr-8 pl-24 text-xl outline-none focus:border-indigo-300 transition-all text-slate-700 placeholder:text-slate-300"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plus size={24} />
            </button>
          </form>

          {filteredTasks.length === 0 ? (
            <div className="h-[160px] rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-slate-300 italic text-[22px] font-black gap-2">
              <Coffee size={32} className="opacity-30" />
              אין משימות לרמת האנרגיה הזו. אולי הזמן לנוח? ☕
            </div>
          ) : (
            <div className="space-y-3">
              {filtered
