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
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export default function TaskListCard({
  energyLevel,
  setEnergyLevel,
  tasks,
  setTasks,
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
}) {
  const visibleTasks = tasks.filter(
    (t) =>
      !t.completed &&
      (t.energyRequired === energyLevel || t.energyRequired === 'analyzing')
  );

  return (
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
                type="button"
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
                  onClick={() => {
                    if (
                      typeof window !== 'undefined' &&
                      typeof window.handleSelectTask === 'function'
                    ) {
                      window.handleSelectTask(task);
                    }
                  }}
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

            {focusTask?.id === task.id &&
              task.subTasks &&
              task.subTasks.length > 0 && (
                <div className="mt-3 mr-8 space-y-1.5 border-r-2 border-indigo-100/50 pr-4">
                  {task.subTasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-3">
                      <Circle size={15} className="text-slate-400" />
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
              )}
          </div>
        ))}
      </div>
    </section>
  );
}
