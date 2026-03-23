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
  Clock3,
  Target,
  Gift,
  Flame,
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
    loadFromLocal('lifeos_energyLevel', 'high')
  );
  const [tasks, setTasks] = useState(() =>
    loadFromLocal('lifeos_tasks', [])
  );
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() =>
    loadFromLocal('lifeos_brainDump', '')
  );
  const [timeLeft, setTimeLeft] = useState(() =>
    loadFromLocal('lifeos_timeLeft', 25 * 60)
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    window.localStorage.setItem('lifeos_activeTab', JSON.stringify(activeTab));
    window.localStorage.setItem('lifeos_energyLevel', JSON.stringify(energyLevel));
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
    window.localStorage.setItem('lifeos_timeLeft', JSON.stringify(timeLeft));
  }, [activeTab, energyLevel, tasks, brainDump, timeLeft]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

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
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter(
    (task) => !task.completed && task.energyRequired === energyLevel
  );

  const energyButtons = [
    { key: 'low', label: 'נמוכה' },
    { key: 'medium', label: 'בינונית' },
    { key: 'high', label: 'גבוהה' },
  ];

  const dopamineCards = [
    {
      title: 'ריקוד ספונטני לשיר אחד',
      desc: 'בחרו שיר שאתם אוהבים ופשוט תזיזו את הגוף במשך 3 דקות.',
      icon: Smile,
    },
    {
      title: 'סידור מיקרו של משטח קטן',
      desc: 'פנו רק פינה קטנה אחת — שידה, מדף קטן או חלק מהשולחן.',
      icon: Sparkles,
    },
    {
      title: 'שרבוט יצירתי ל־5 דקות',
      desc: 'קחו דף ועט ותעשו קווים, צורות או קשקושים בלי לחשוב יותר מדי.',
      icon: Lightbulb,
    },
  ];

  const quickSchedule = {
    title: 'אימון ערב',
    subtitle: '19:00 • עכשיו בביצוע',
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 font-sans pb-36" dir="rtl">
      <header className="sticky top-0 z-40 h-[92px] px-8 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 font-black text-2xl tracking-wide">
            {currentTime.toLocaleTimeString('he-IL', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </div>

          <button className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black text-xl flex items-center gap-3 shadow-sm">
            הצלה
            <Heart size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <h1 className="text-[30px] font-black italic text-slate-900">
            LifeOS <span className="text-indigo-500 not-italic">AI Pro</span>
          </h1>
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
            <Zap size={28} />
          </div>
        </div>
      </header>

      <main className="max-w-[1650px] mx-auto px-8 py-14">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 xl:col-span-4 space-y-10">
              <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-400" />
                <div className="flex items-center justify-between mb-8">
                  <Wallet className="text-emerald-500" size={28} />
                  <h2 className="text-[28px] font-black text-slate-800">תקציב מהיר</h2>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-rose-50 rounded-[2rem] p-7 text-center">
                    <div className="text-rose-500 text-lg font-black mb-2">הוצאות</div>
                    <div className="text-5xl font-black text-rose-600">₪0</div>
                  </div>

                  <div className="bg-emerald-50 rounded-[2rem] p-7 text-center">
                    <div className="text-emerald-600 text-lg font-black mb-2">נשאר לשימוש</div>
                    <div className="text-5xl font-black text-emerald-700">₪0</div>
                  </div>
                </div>

                <button className="w-full h-16 rounded-[1.4rem] bg-slate-100 text-slate-400 font-black text-xl">
                  לניהול מלא
                </button>
              </section>

              <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-8">
                  <Calendar className="text-indigo-500" size={28} />
                  <h2 className="text-[28px] font-black text-slate-800">לו״ז קרוב</h2>
                </div>

                <div className="rounded-[2rem] bg-indigo-50 border border-indigo-100 p-6 flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Target size={24} />
                  </div>

                  <div className="text-right flex-1 pr-4">
                    <div className="text-[26px] font-black text-slate-800">{quickSchedule.title}</div>
                    <div className="text-indigo-500 font-black text-lg mt-1">{quickSchedule.subtitle}</div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-4 py-2 rounded-2xl bg-rose-50 text-rose-500 font-black text-lg flex items-center gap-2">
                    רענן
                    <Flame size={18} />
                  </div>
                  <h2 className="text-[28px] font-black text-slate-800">תפריט דופמין</h2>
                </div>

                <div className="space-y-4">
                  {dopamineCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={index}
                        className="rounded-[2rem] border border-slate-200 bg-slate-50/60 p-5 flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center shrink-0">
                          <Icon size={22} />
                        </div>
                        <div className="text-right">
                          <div className="font-black text-xl text-slate-800">{card.title}</div>
                          <div className="text-slate-500 text-base mt-1 leading-relaxed">{card.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-8">
                  <Lightbulb className="text-amber-500" size={28} />
                  <h2 className="text-[28px] font-black text-slate-800">Brain Dump</h2>
                </div>

                <textarea
                  value={brainDump}
                  onChange={(e) => setBrainDump(e.target.value)}
                  placeholder="פרוקי פה הכל..."
                  className="w-full h-[260px] rounded-[2rem] bg-slate-50 border-none outline-none resize-none p-8 text-2xl text-slate-700 placeholder:text-slate-300"
                />
              </section>
            </div>

            <div className="col-span-12 xl:col-span-8 space-y-10">
              <section className="bg-[#465168] text-white rounded-[2.8rem] px-10 py-8 shadow-xl flex items-center justify-between">
                <div className="text-6xl font-black font-mono tracking-tight opacity-70">
                  --:--
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-[34px] font-black italic text-slate-200">
                    מנוע המיקוד ממתין למשימה...
                  </div>
                  <button
                    onClick={() => setIsTimerRunning((prev) => !prev)}
                    className="w-14 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition-all flex items-center justify-center"
                  >
                    {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200/60">
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="text-right">
                    <h2 className="text-[42px] leading-tight font-black text-slate-800">
                      מה כדאי לעשות
                      <br />
                      עכשיו?
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 rounded-[2rem] border border-slate-200 px-5 py-3">
                    <span className="text-slate-400 font-black text-lg">כמה אנרגיה יש לי עכשיו?</span>

                    <div className="flex items-center gap-2 bg-slate-100 rounded-[1.5rem] p-1.5">
                      {energyButtons.map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => setEnergyLevel(btn.key)}
                          className={`px-7 py-3 rounded-[1.2rem] text-lg font-black transition-all ${
                            energyLevel === btn.key
                              ? 'bg-emerald-500 text-white shadow'
                              : 'text-slate-400'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    <div className="w-px h-12 bg-slate-200 mx-1" />

                    <button className="w-12 h-12 rounded-xl bg-white text-indigo-500 flex items-center justify-center shadow-sm border border-slate-200">
                      <Sparkles size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm border border-slate-200">
                      <Gift size={20} />
                    </button>
                  </div>
                </div>

                <form onSubmit={addTask} className="relative mb-8">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="משהו חדש לעשות? כתבו כאן..."
                    className="w-full h-20 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white pr-8 pl-24 text-2xl outline-none text-slate-700 placeholder:text-slate-300"
                  />
                  <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg"
                  >
                    <Plus size={24} />
                  </button>
                </form>

                {filteredTasks.length === 0 ? (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/40 h-[210px] flex items-center justify-center text-slate-300 text-[30px] font-black italic text-center px-10">
                    אין משימות לרמת האנרגיה הזו. אולי הזמן לנוח? ☕
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4"
                      >
                        <button onClick={() => toggleTask(task.id)}>
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
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
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
                    <button onClick={() => toggleTask(task.id)}>
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
        )}

        {activeTab === 'finance' && (
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200/60">
            <h2 className="text-4xl font-black mb-8">כסף</h2>
            <div className="text-slate-400 text-2xl">המסך הזה עדיין בבנייה.</div>
          </section>
        )}

        {['schedule', 'vision', 'skills', 'tools'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-400">
            <BrainCircuit size={48} className="mb-4 opacity-20" />
            <p className="text-xl font-black italic">הטאב של {activeTab} חוזר בקרוב... 🔨</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 w-full max-w-[860px] px-6">
        <nav className="bg-[#182544] text-white rounded-[2.6rem] shadow-2xl px-6 py-4 flex items-center justify-between border border-white/5">
          {[
            { id: 'tools', icon: Briefcase, label: 'כלים' },
            { id: 'skills', icon: GraduationCap, label: 'ספר' },
            { id: 'vision', icon: Compass, label: 'חזון' },
            { id: 'schedule', icon: Calendar, label: 'לו"ז' },
            { id: 'finance', icon: Wallet, label: 'כסף' },
            { id: 'tasks', icon: ListTodo, label: 'משימות' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-2 px-5 py-3 rounded-[2rem] transition-all min-w-[92px] ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[18px] font-black">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
