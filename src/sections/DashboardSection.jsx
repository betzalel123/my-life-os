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
  RefreshCw,
  Smile,
  Music,
  Zap,
} from 'lucide-react';

const IconMap = {
  Sparkles,
  Gift,
  Lightbulb,
  Coffee,
  Flame,
  Smile,
  Music,
  Zap,
};

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
  dopamineOptions = [
    {
      title: 'ריקוד ספונטני לשיר אחד',
      desc: 'בחרי שיר שאת אוהבת ופשוט תזיזי את הגוף לכמה דקות.',
      iconName: 'Music',
      accent: 'text-rose-400',
    },
    {
      title: 'סידור מיקרו של משטח קטן',
      desc: 'רק פינה אחת. לא יותר.',
      iconName: 'Gift',
      accent: 'text-indigo-400',
    },
    {
      title: 'שרבוט יצירתי',
      desc: 'כמה קווים על דף בלי לחשוב יותר מדי.',
      iconName: 'Lightbulb',
      accent: 'text-amber-400',
    },
  ],
  refreshDopamineMenu,
  isLoadingGemini = false,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter(
    (task) => !task.completed && task.energyRequired === energyLevel
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        {/* מנוע מיקוד - קומפקטי */}
        <section className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                <Target size={18} className="text-white" />
              </div>

              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">
                  מנוע מיקוד
                </div>
                <h2 className="text-sm md:text-base font-black truncate">
                  מנוע המיקוד ממתין למשימה...
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 px-4 py-2 rounded-2xl text-lg md:text-2xl font-mono font-black tracking-tight">
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  isTimerRunning
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-emerald-500 text-emerald-950'
                }`}
              >
                {isTimerRunning ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* משימות */}
        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target size={20} />
              </span>
              מה כדאי לעשות עכשיו?
            </h3>

            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-3xl">
              <div className="flex flex-col gap-1 pr-1 pl-2">
                <span className="text-[11px] font-bold text-slate-500 leading-none">
                  כמה אנרגיה יש לי עכשיו?
                </span>
              </div>

              <div className="flex gap-1 bg-slate-200/40 p-1 rounded-2xl">
                {['low', 'medium', 'high'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setEnergyLevel(lvl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                      energyLevel === lvl
                        ? `${
                            lvl === 'low'
                              ? 'bg-rose-500'
                              : lvl === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          } text-white shadow-md font-bold scale-105`
                        : 'text-slate-400 hover:bg-white hover:text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] font-black">
                      {lvl === 'low'
                        ? 'נמוכה'
                        : lvl === 'medium'
                        ? 'בינונית'
                        : 'גבוהה'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-200 mx-1" />

              <button
                type="button"
                className="p-2 text-indigo-600 hover:bg-white rounded-2xl transition-all"
                title="רולטה"
              >
                <Dices size={16} />
              </button>

              <button
                type="button"
                className="p-2 text-amber-500 hover:bg-white rounded-2xl transition-all"
                title="סידור חכם"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <form
            onSubmit={addTask}
            className="mb-6 flex gap-3 p-1.5 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all duration-300"
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="משהו חדש לעשות? כתבי כאן..."
              className="flex-1 bg-transparent px-4 py-1.5 outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
            >
              <Plus size={18} />
            </button>
          </form>

          <div className="space-y-3">
            {filteredTasks.length === 0 && (
              <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic text-sm">
                  אין משימות לרמת האנרגיה הזו. אולי זה זמן לנוח? ☕
                </p>
              </div>
            )}

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[2rem] border-2 border-transparent hover:bg-slate-50 p-3 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="transition-transform active:scale-75"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="text-emerald-500" size={22} />
                    ) : (
                      <Circle
                        className={`hover:text-indigo-500 transition-colors ${
                          task.energyRequired === 'low'
                            ? 'text-rose-500'
                            : task.energyRequired === 'medium'
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                        size={22}
                      />
                    )}
                  </button>

                  <div className="flex-1 overflow-hidden">
                    <span className="font-bold text-base block truncate text-slate-800">
                      <span className="ml-2 inline-block align-middle">
                        {task.emoji || '📝'}
                      </span>
                      {task.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="מחק"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brain Dump */}
        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Lightbulb size={22} className="text-amber-500" />
              Brain Dump
            </h3>

            <button
              type="button"
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md hover:bg-amber-600 transition-all flex items-center gap-2"
            >
              <Sparkles size={14} />
              הפוך למשימות
            </button>
          </div>

          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="פרוקי פה הכל..."
            className="w-full h-44 bg-slate-50 border-none rounded-[2rem] p-5 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-amber-200 transition-all"
          />
        </section>
      </div>

      <div className="space-y-8">
        {/* תקציב מהיר */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
            <Wallet size={20} className="text-emerald-500" />
            תקציב מהיר
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-center">
              <span className="text-[9px] font-black text-emerald-600 uppercase">
                נשאר לשימוש
              </span>
              <p className="text-xl font-black text-emerald-700">₪0</p>
            </div>
            <div className="bg-rose-50 p-3 rounded-2xl text-center">
              <span className="text-[9px] font-black text-rose-600 uppercase">
                הוצאות
              </span>
              <p className="text-xl font-black text-rose-700">₪0</p>
            </div>
          </div>
        </section>

        {/* לו"ז קרוב */}
        <section className="bg-white border border-slate-200/50 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-lg font-black italic flex items-center gap-2 text-slate-800 mb-4">
              <Calendar size={20} className="text-indigo-500" />
              לו"ז קרוב
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                  <Target size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-black text-indigo-900 block">
                    אימון ערב
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    19:00 • עכשיו בביצוע
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* תפריט דופמין */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Flame size={20} className="text-rose-500" />
              תפריט דופמין
            </h3>

            <button
              type="button"
              onClick={refreshDopamineMenu}
              disabled={isLoadingGemini}
              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
            >
              {isLoadingGemini ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              רענן
            </button>
          </div>

          <div className="space-y-2">
            {dopamineOptions.map((item, i) => {
              const IconComponent = IconMap[item.iconName] || Sparkles;

              return (
                <div
                  key={i}
                  className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-3"
                >
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <IconComponent
                      size={14}
                      className={item.accent || 'text-rose-500'}
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-800">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
