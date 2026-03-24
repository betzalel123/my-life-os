import React from 'react';
import {
  Wallet,
  Calendar,
  Target,
  Sparkles,
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
  processBrainDump,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
  dopamineMenu,
  isDopamineLoading,
  generateDopamineMenu,
  balance = 0,
  expenses = 0,
  updateActiveTab,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      !task.completed &&
      (task.energyRequired === energyLevel || task.energyRequired === 'analyzing')
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-slate-900 text-white shadow-2xl relative overflow-hidden p-4 rounded-2xl opacity-80 h-20">
          <div className="relative z-10 flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-indigo-600 shrink-0">
                <Target className="text-white" size={16} />
              </div>

              <h2 className="text-sm font-black uppercase tracking-widest opacity-60 italic truncate">
                מנוע המיקוד ממתין למשימה...
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-white/30 font-mono text-xl">
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  isTimerRunning
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-emerald-500 text-emerald-950'
                }`}
              >
                {isTimerRunning ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
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
                title="רולטת החלטות"
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
              className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
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
                    onClick={() => toggleTask(task.id)}
                    className="transition-transform active:scale-75"
                    type="button"
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
                            : task.energyRequired === 'high'
                            ? 'text-emerald-500'
                            : 'text-indigo-400'
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
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="מחק"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Lightbulb size={22} className="text-amber-500" />
              Brain Dump
            </h3>

            <button
              onClick={processBrainDump}
              disabled={!brainDump.trim()}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              type="button"
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
              <p className="text-xl font-black text-emerald-700">₪{balance}</p>
            </div>
            <div className="bg-rose-50 p-3 rounded-2xl text-center">
              <span className="text-[9px] font-black text-rose-600 uppercase">
                הוצאות
              </span>
              <p className="text-xl font-black text-rose-700">₪{expenses}</p>
            </div>
          </div>

          {updateActiveTab && (
            <button
              onClick={() => updateActiveTab('finance')}
              className="w-full mt-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all uppercase tracking-widest"
              type="button"
            >
              לניהול מלא
            </button>
          )}
        </section>

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

        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Flame size={20} className="text-rose-500" />
              תפריט דופמין
            </h3>

            <button
              onClick={generateDopamineMenu}
              disabled={isDopamineLoading}
              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
              type="button"
            >
              {isDopamineLoading ? (
                <LoaderIcon />
              ) : (
                <RefreshCw size={12} />
              )}
              רענן
            </button>
          </div>

          {isDopamineLoading && (
            <div className="flex justify-center p-4">
              <RefreshCw className="animate-spin text-rose-400" size={24} />
            </div>
          )}

          {dopamineMenu && !isDopamineLoading && (
            <div className="space-y-2">
              {dopamineMenu.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-3"
                >
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                    <Smile size={14} />
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
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function LoaderIcon() {
  return <RefreshCw size={12} className="animate-spin" />;
}
