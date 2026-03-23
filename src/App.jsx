import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Zap,
  ListTodo,
  Wallet,
  Calendar,
  Compass,
  GraduationCap,
  Briefcase,
  Home,
  Plus,
  Circle,
  Lightbulb,
  Play,
  Pause,
  RefreshCw,
  Heart,
  Coffee,
  Smile,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  Trash2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState(() =>
    loadFromLocal('lifeos_activeTab', 'dashboard')
  );
  const [energyLevel, setEnergyLevel] = useState(() =>
    loadFromLocal('lifeos_energyLevel', 'medium')
  );

  const [tasks, setTasks] = useState(() =>
    loadFromLocal('lifeos_tasks', [])
  );
  const [newTask, setNewTask] = useState('');

  const [chores, setChores] = useState(() =>
    loadFromLocal('lifeos_chores', [
      { id: 1, text: 'לשטוף כלים', completed: false, icon: '🍽️' },
      { id: 2, text: 'כביסה', completed: false, icon: '🧺' },
    ])
  );
  const [newChore, setNewChore] = useState('');

  const [transactions, setTransactions] = useState(() =>
    loadFromLocal('lifeos_transactions', [])
  );
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
  });

  const [brainDump, setBrainDump] = useState(() =>
    loadFromLocal('lifeos_brainDump', '')
  );

  const [timeLeft, setTimeLeft] = useState(() =>
    loadFromLocal('lifeos_timeLeft', 25 * 60)
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_chores', JSON.stringify(chores));
    window.localStorage.setItem('lifeos_transactions', JSON.stringify(transactions));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
    window.localStorage.setItem('lifeos_activeTab', JSON.stringify(activeTab));
    window.localStorage.setItem('lifeos_energyLevel', JSON.stringify(energyLevel));
    window.localStorage.setItem('lifeos_timeLeft', JSON.stringify(timeLeft));
  }, [tasks, chores, transactions, brainDump, activeTab, energyLevel, timeLeft]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(25 * 60);
  };

  const toggleChore = (id) => {
    setChores((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      )
    );
  };

  const addChore = (e) => {
    e.preventDefault();
    if (!newChore.trim()) return;

    setChores((prev) => [
      {
        id: Date.now(),
        text: newChore.trim(),
        completed: false,
        icon: '🏠',
      },
      ...prev,
    ]);
    setNewChore('');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        energyRequired: energyLevel,
      },
      ...prev,
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.description.trim() || !newTransaction.amount) return;

    setTransactions((prev) => [
      {
        id: Date.now(),
        description: newTransaction.description.trim(),
        amount: Number(newTransaction.amount),
        type: newTransaction.type,
      },
      ...prev,
    ]);

    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
    });
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const filteredTasks = tasks.filter(
    (t) => !t.completed && t.energyRequired === energyLevel
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold">
          <Heart size={14} fill="currentColor" /> SOS
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black italic text-indigo-600 uppercase">
            LifeOS AI Pro
          </h1>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <Zap size={22} />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <section className="bg-[#2d3748] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-indigo-400">
                  <RefreshCw size={20} />
                </div>
                <h2 className="text-xl font-bold italic text-slate-200">
                  מנוע המיקוד
                </h2>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm font-bold transition-all"
                >
                  איפוס
                </button>

                <div className="text-4xl md:text-5xl font-mono font-black">
                  {formatTime(timeLeft)}
                </div>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-400 transition-all"
                >
                  {isTimerRunning ? (
                    <Pause size={28} fill="white" />
                  ) : (
                    <Play size={28} fill="white" />
                  )}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Wallet className="text-emerald-500" /> תקציב מהיר
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">
                        נשאר
                      </span>
                      <p className="text-xl font-black text-emerald-700">₪{balance}</p>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
                      <span className="text-[10px] font-black text-rose-600 uppercase">
                        הוצאות
                      </span>
                      <p className="text-xl font-black text-rose-700">₪{expenses}</p>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    מטלות בית <Home className="text-indigo-500" />
                  </h3>

                  <form onSubmit={addChore} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newChore}
                      onChange={(e) => setNewChore(e.target.value)}
                      placeholder="להוסיף מטלה..."
                      className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-3 rounded-xl"
                    >
                      <Plus size={18} />
                    </button>
                  </form>

                  <div className="space-y-2">
                    {chores.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => toggleChore(c.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          c.completed
                            ? 'bg-slate-50 opacity-50'
                            : 'bg-white hover:border-indigo-100 shadow-sm'
                        }`}
                      >
                        <span className="text-lg">{c.icon}</span>
                        <span
                          className={`text-sm font-bold flex-1 ${
                            c.completed ? 'line-through' : ''
                          }`}
                        >
                          {c.text}
                        </span>
                        {c.completed ? (
                          <CheckCircle2 className="text-emerald-500" size={18} />
                        ) : (
                          <Circle className="text-slate-200" size={18} />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-black">מה כדאי לעשות עכשיו?</h3>

                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border">
                      {['נמוכה', 'בינונית', 'גבוהה'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() =>
                            setEnergyLevel(
                              lvl === 'נמוכה'
                                ? 'low'
                                : lvl === 'בינונית'
                                ? 'medium'
                                : 'high'
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            (energyLevel === 'low' && lvl === 'נמוכה') ||
                            (energyLevel === 'medium' && lvl === 'בינונית') ||
                            (energyLevel === 'high' && lvl === 'גבוהה')
                              ? 'bg-amber-500 text-white shadow-md'
                              : 'text-slate-400'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={addTask} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="משימה חדשה..."
                      className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 rounded-xl"
                    >
                      <Plus size={18} />
                    </button>
                  </form>

                  {filteredTasks.length === 0 ? (
                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-400 italic text-sm">
                      אין משימות לרמת האנרגיה הזו... ☕
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50"
                        >
                          <button onClick={() => toggleTask(task.id)}>
                            {task.completed ? (
                              <CheckCircle2 className="text-emerald-500" size={18} />
                            ) : (
                              <Circle className="text-slate-300" size={18} />
                            )}
                          </button>
                          <span className="flex-1 font-bold text-sm">{task.text}</span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-300 hover:text-rose-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">תפריט דופמין ✨</h3>

                  <div className="space-y-4">
                    <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Smile className="text-rose-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">ריקוד ספונטני לשיר אחד</h4>
                        <p className="text-xs text-slate-500">תזיזו את הגוף למשך 3 דקות!</p>
                      </div>
                    </div>

                    <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Sparkles className="text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">סידור מיקרו של משטח קטן</h4>
                        <p className="text-xs text-slate-500">
                          פנו רק את השידה או חלק קטן מהשולחן.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Coffee className="text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">להכין משהו טעים קטן</h4>
                        <p className="text-xs text-slate-500">
                          תה, קפה, או חטיף קטן שנותן התחלה רכה.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-4">Brain Dump 💡</h3>
                  <textarea
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    className="w-full h-40 bg-slate-50/50 rounded-3xl p-6 text-sm outline-none border-none focus:ring-2 focus:ring-amber-100 resize-none"
                    placeholder="פרוקי פה הכל..."
                  />
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black mb-6">משימות</h2>

              <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="להוסיף משימה..."
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-100"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 rounded-xl">
                  <Plus size={18} />
                </button>
              </form>

              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-slate-400 italic text-center py-10">
                    עדיין אין משימות.
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50"
                    >
                      <button onClick={() => toggleTask(task.id)}>
                        {task.completed ? (
                          <CheckCircle2 className="text-emerald-500" size={18} />
                        ) : (
                          <Circle className="text-slate-300" size={18} />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className={`font-bold text-sm ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.text}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          אנרגיה: {task.energyRequired === 'low' ? 'נמוכה' : task.energyRequired === 'medium' ? 'בינונית' : 'גבוהה'}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black mb-6">כסף</h2>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <TrendingUp size={18} />
                    <span className="font-bold text-sm">הכנסות</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">₪{income}</div>
                </div>

                <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-600 mb-2">
                    <TrendingDown size={18} />
                    <span className="font-bold text-sm">הוצאות</span>
                  </div>
                  <div className="text-2xl font-black text-rose-700">₪{expenses}</div>
                </div>

                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Wallet size={18} />
                    <span className="font-bold text-sm">יתרה</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-700">₪{balance}</div>
                </div>
              </div>

              <form onSubmit={addTransaction} className="grid md:grid-cols-4 gap-3 mb-6">
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="תיאור"
                  className="bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-100"
                />

                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="סכום"
                  className="bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-100"
                />

                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-100"
                >
                  <option value="expense">הוצאה</option>
                  <option value="income">הכנסה</option>
                </select>

                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-xl px-4 py-3 font-bold"
                >
                  הוסף
                </button>
              </form>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-slate-400 italic text-center py-10">
                    עדיין אין תנועות.
                  </div>
                ) : (
                  transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-sm">{t.description}</div>
                      </div>

                      <div
                        className={`font-black ${
                          t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}₪{t.amount}
                      </div>

                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {['schedule', 'vision', 'skills', 'tools'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-400">
            <BrainCircuit size={48} className="mb-4 opacity-20" />
            <p className="text-xl font-black italic">הטאב של {activeTab} חוזר בקרוב... 🔨</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-[#1e293b] text-white rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around gap-1 border border-white/5">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
            { id: 'tasks', icon: ListTodo, label: 'משימות' },
            { id: 'finance', icon: Wallet, label: 'כסף' },
            { id: 'schedule', icon: Calendar, label: 'לו"ז' },
            { id: 'vision', icon: Compass, label: 'חזון' },
            { id: 'skills', icon: GraduationCap, label: 'ספר' },
            { id: 'tools', icon: Briefcase, label: 'כלים' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-indigo-600 shadow-lg scale-105'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
