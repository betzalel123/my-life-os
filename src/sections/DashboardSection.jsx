import React from 'react';
import {
  Lightbulb,
  Sparkles,
  Wallet,
  Calendar,
  Flame,
  RotateCcw,
  Smile,
  Home,
  Trash2,
  Circle,
  Loader2,
} from 'lucide-react';

import FocusEngineCard from '../components/dashboard/FocusEngineCard';
import TaskListCard from '../components/dashboard/TaskListCard';

export default function DashboardSection({
  energyLevel,
  setEnergyLevel,
  tasks,
  setTasks,
  newTask,
  setNewTask,
  addTask,
  brainDump,
  setBrainDump,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
  dopamineMenu,
  isDopamineLoading,
  generateDopamineMenu,
  expenses,
  balance,
  currentTime,
  focusTask,
  isFocusActive,
  isStrategyLoading,
  isBreakingDown,
  setIsFocusActive,
  startPrepare,
  openHelper,
}) {
  const activeScheduleItem = {
    time: '19:00',
    activity: 'אימון ערב',
  };

  const houseChores = [
    { id: 1, text: 'לשטוף כלים', completed: false },
    { id: 2, text: 'לקפל כביסה', completed: false },
    { id: 3, text: 'לסדר שולחן', completed: true },
  ];

  const choresCompleted = houseChores.filter((c) => c.completed).length;
  const choresProgress = houseChores.length
    ? Math.round((choresCompleted / houseChores.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        <FocusEngineCard
          timeLeft={timeLeft}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
        />

        <TaskListCard
          energyLevel={energyLevel}
          setEnergyLevel={setEnergyLevel}
          tasks={tasks}
          setTasks={setTasks}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          focusTask={focusTask}
          isFocusActive={isFocusActive}
          isStrategyLoading={isStrategyLoading}
          isBreakingDown={isBreakingDown}
          setIsFocusActive={setIsFocusActive}
          startPrepare={startPrepare}
          openHelper={openHelper}
        />

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden group">
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

          <button
            type="button"
            className="w-full mt-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all uppercase tracking-widest"
          >
            לניהול מלא
          </button>
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
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-black text-indigo-900 block">
                    {activeScheduleItem.activity}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {activeScheduleItem.time} • עכשיו בביצוע
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono font-bold">
                {currentTime?.toLocaleTimeString('he-IL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
              type="button"
              onClick={generateDopamineMenu}
              disabled={isDopamineLoading}
              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
            >
              {isDopamineLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RotateCcw size={12} />
              )}
              רענן
            </button>
          </div>

          {isDopamineLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-rose-400" size={24} />
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
                    <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Home size={20} className="text-teal-500" />
              מטלות בית
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {choresProgress}% הושלם
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${choresProgress}%` }}
            />
          </div>

          <div className="space-y-2">
            {houseChores.slice(0, 5).map((chore) => (
              <div
                key={chore.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
              >
                <button type="button">
                  <Circle
                    size={20}
                    className={chore.completed ? 'text-emerald-500' : 'text-teal-500'}
                  />
                </button>

                <div className="flex-1">
                  <p
                    className={`text-sm font-bold ${
                      chore.completed ? 'line-through text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {chore.text}
                  </p>
                </div>

                <button
                  type="button"
                  className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
