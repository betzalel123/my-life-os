import React from 'react';
import {
  ListTodo,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Dices,
  Sparkles,
  Plus,
  Loader2,
  Circle,
  AlignLeft,
  Trash2,
  Lightbulb,
  Wallet,
  Calendar,
  Flame,
  RotateCcw,
  Smile,
  Home,
  Coffee,
  Play,
  Pause,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import FocusEngineCard from '../components/dashboard/FocusEngineCard';

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
  onProcessBrainDump,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
  timerMode,
  isTimerMinimized,
  setIsTimerMinimized,
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
  onSelectTask,
}) {
  const visibleTasks = tasks.filter(
    (t) =>
      !t.completed &&
      (t.energyRequired === energyLevel || t.energyRequired === 'analyzing')
  );

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
          timerMode={timerMode}
          focusTask={focusTask}
          activeHabitStack={null}
          isFocusActive={isFocusActive}
          isTimerMinimized={isTimerMinimized}
          setIsTimerMinimized={setIsTimerMinimized}
          isStrategyLoading={isStrategyLoading}
          isBreakingDown={isBreakingDown}
          setIsFocusActive={setIsFocusActive}
          startPrepare={startPrepare}
        />

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
              <ListTodo size={24} className="text-indigo-600" />
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
                    {lvl === 'low' ? (
                      <BatteryLow size={12} />
                    ) : lvl === 'medium' ? (
                      <BatteryMedium size={12} />
                    ) : (
                      <BatteryFull size={12} />
                    )}
                    <span className="text-[10px] font-black">
                      {lvl === 'low' ? 'נמוכה' : lvl === 'medium' ? 'בינונית' : 'גבוהה'}
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
            {visibleTasks.length === 0 && (
              <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-500">
                <p className="text-slate-400 font-bold italic text-sm">
                  אין משימות לרמת האנרגיה הזו. אולי זה זמן לנוח? ☕
                </p>
              </div>
            )}

            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-[2rem] border-2 transition-all group ${
                  focusTask?.id === task.id
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm p-4'
                    : 'border-transparent hover:bg-slate-50 p-3'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, completed: true } : t
                        )
                      )
                    }
                    className="transition-transform active:scale-75"
                  >
                    {task.energyRequired === 'analyzing' ? (
                      <Loader2 className="animate-spin text-indigo-400" size={22} />
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
                    <button
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className="block w-full text-right"
                    >
                      <span
                        className={`font-bold text-base block truncate ${
                          focusTask?.id === task.id ? 'text-indigo-900' : 'text-slate-800'
                        }`}
                      >
                        <span className="ml-2 inline-block align-middle">
                          {task.emoji || '📝'}
                        </span>
                        {task.text}
                      </span>
                    </button>

                    {focusTask?.id === task.id &&
                      !isFocusActive &&
                      !isStrategyLoading &&
                      isBreakingDown !== task.id && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFocusActive(true);
                              startPrepare(task);
                            }}
                            className="whitespace-nowrap text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-all"
                          >
                            <ArrowRight size={10} />
                            כניסה לריכוז
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openHelper();
                            }}
                            className="whitespace-nowrap text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                          >
                            <MessageCircle size={10} />
                            קשה לי להתחיל
                          </button>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                      title="פשט משימה"
                    >
                      <AlignLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTasks((prev) => prev.filter((t) => t.id !== task.id))
                      }
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                      title="מחק"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {focusTask?.id === task.id && (
                  <div className="mt-3">
                    {isBreakingDown === task.id ? (
                      <div className="mr-8 p-3 bg-white/40 rounded-xl border border-dashed border-indigo-200 flex items-center gap-3 animate-pulse">
                        <Loader2 className="animate-spin text-indigo-400" size={16} />
                        <span className="text-[11px] font-bold text-indigo-500 italic">
                          ה-AI מפרק את המשימה לשלבים קטנים...
                        </span>
                      </div>
                    ) : (
                      task.subTasks &&
                      task.subTasks.length > 0 && (
                        <div className="mr-8 space-y-1.5 border-r-2 border-indigo-100/50 pr-4">
                          {task.subTasks.map((st) => (
                            <div
                              key={st.id}
                              onClick={() =>
                                setTasks((prev) =>
                                  prev.map((t) =>
                                    t.id === task.id
                                      ? {
                                          ...t,
                                          subTasks: t.subTasks.map((s) =>
                                            s.id === st.id
                                              ? { ...s, completed: !s.completed }
                                              : s
                                          ),
                                        }
                                      : t
                                  )
                                )
                              }
                              className="flex items-center gap-3 cursor-pointer group/sub"
                            >
                              {st.completed ? (
                                <CheckCircle2 className="text-emerald-500" size={15} />
                              ) : (
                                <Circle
                                  size={15}
                                  className="text-slate-400 group-hover/sub:text-indigo-500 transition-colors"
                                />
                              )}

                              <span
                                className={`text-[13px] font-medium ${
                                  st.completed
                                    ? 'line-through text-slate-300'
                                    : 'text-slate-600'
                                }`}
                              >
                                {st.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Lightbulb size={22} className="text-amber-500" />
              Brain Dump
            </h3>

            <button
              type="button"
              onClick={onProcessBrainDump}
              disabled={!String(brainDump || '').trim()}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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