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
    <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200/60">
      <h2 className="text-4xl font-black mb-8">משימות</h2>

      <form onSubmit={addTask} className="relative mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="להוסיף משימה..."
          className="w-full h-20 rounded-[2rem] border border-slate-200 bg-slate-50 pr-8 pl-24 text-2xl outline-none"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-slate-400 py-16 text-2xl italic">עדיין אין משימות</div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4"
            >
              <button type="button" onClick={() => toggleTask(task.id)}>
                {task.completed ? (
                  <CheckCircle2 className="text-emerald-500" size={22} />
                ) : (
                  <Circle className="text-slate-300" size={22} />
                )}
              </button>

              <div className="flex-1 text-right">
                <div className="text-xl font-black text-slate-800">{task.text}</div>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-rose-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
