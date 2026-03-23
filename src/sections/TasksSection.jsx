import React from 'react';
import { Plus, Circle, CheckCircle2, Trash2 } from 'lucide-react';

export default function TasksSection({
  tasks,
  newTask,
  setNewTask,
  addTask,
  toggleTask,
  deleteTask,
}) {
  return (
    <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 min-h-[500px]">
      <h2 className="text-[34px] font-black text-slate-800 mb-8">משימות</h2>

      <form onSubmit={addTask} className="relative mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="להוסיף משימה..."
          className="w-full h-[76px] bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-4 pr-8 pl-24 text-xl outline-none focus:border-indigo-300 transition-all text-slate-700 placeholder:text-slate-300"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-slate-300 text-xl font-black italic py-16 text-center">
            עדיין אין משימות
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[1.7rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4 hover:shadow-sm transition-all"
            >
              <button type="button" onClick={() => toggleTask(task.id)}>
                {task.completed ? (
                  <CheckCircle2 className="text-emerald-500" size={26} />
                ) : (
                  <Circle className="text-slate-300 hover:text-indigo-300" size={26} />
                )}
              </button>

              <div className="flex-1 text-right">
                <div
                  className={`text-xl font-black ${
                    task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}
                >
                  {task.text}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
