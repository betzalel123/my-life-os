import React from 'react';
import {
  Circle,
  Plus,
  Loader2,
  AlignLeft,
  Trash2,
  Play,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

export default function TasksSection({
  tasks,
  setTasks,
  energyLevel,
  setEnergyLevel,
  newTask,
  setNewTask,
  addTask,
  focusTask,
  isFocusActive,
  isStrategyLoading,
  isBreakingDown,
  setIsFocusActive,
  startPrepare,
  openHelper,
  onSelectTask,
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black italic">המשימות שלי</h2>
          <p className="text-slate-500 font-bold">סדר וארגון בדרך שלך</p>
        </div>
      </header>

      <section className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-200/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-slate-50 p-3 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 pl-2">אנרגיה:</span>
            {['low', 'medium', 'high'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setEnergyLevel(lvl)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  energyLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:bg-white'
                }`}
              >
                <span className="text-[11px] uppercase">
                  {lvl === 'low' ? 'נמוכה' : lvl === 'medium' ? 'בינונית' : 'גבוהה'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={addTask}
          className="mb-8 flex gap-3 p-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl focus-within:border-indigo-400 focus-within:bg-white transition-all w-full"
        >
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="משהו חדש לעשות?..."
            className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-lg"
          />
          <button
            type="submit"
            className="px-6 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={20} /> הוסף
          </button>
        </form>

        <div className="space-y-4">
          {tasks.filter((t) => !t.completed).map((task) => (
            <div
              key={task.id}
              className={`rounded-[2rem] border-2 transition-all group ${
                focusTask?.id === task.id
                  ? 'bg-indigo-50 border-indigo-500 shadow-sm p-4'
                  : energyLevel === task.energyRequired
                  ? 'bg-indigo-50/40 border-indigo-200 p-4'
                  : 'border-transparent hover:bg-slate-50 p-4'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === task.id ? { ...t, completed: true } : t
                      )
                    )
                  }
                  className="transition-transform active:scale-75 mt-1"
                >
                  {task.energyRequired === 'analyzing' ? (
                    <Loader2 className="animate-spin text-indigo-400" size={24} />
                  ) : (
                    <Circle
                      className={`hover:text-indigo-500 transition-colors ${
                        task.energyRequired === 'low'
                          ? 'text-rose-500'
                          : task.energyRequired === 'medium'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                      size={24}
                    />
                  )}
                </button>

                <div className="flex-1 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="block w-full text-right"
                  >
                    <p
                      className={`font-bold text-lg ${
                        focusTask?.id === task.id ? 'text-indigo-900' : 'text-slate-800'
                      }`}
                    >
                      {task.emoji || '📝'} {task.text}
                    </p>
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
                          <ArrowRight size={10} /> כניסה לריכוז
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openHelper();
                          }}
                          className="whitespace-nowrap text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                        >
                          <MessageCircle size={10} /> קשה לי להתחיל
                        </button>
                      </div>
                    )}

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
                          <div className="mr-8 space-y-1.5 border-r-2 border-indigo-100/50 pr-4 animate-in slide-in-from-top-1 duration-300">
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
                                    className="text-slate-400 group-hover/sub:text-indigo-500 transition-colors"
                                    size={15}
                                  />
                                )}

                                <span
                                  className={`text-[13px] font-medium transition-all ${
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

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" className="p-2 text-indigo-400">
                    <Play size={20} />
                  </button>
                  <button type="button" className="p-2 text-slate-400">
                    <AlignLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTasks((prev) => prev.filter((t) => t.id !== task.id))
                    }
                    className="p-2 text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
