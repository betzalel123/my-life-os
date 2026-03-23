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
  Plus,
  Circle,
  Lightbulb,
  Play,
  Pause,
  Heart,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  Trash2,
  Target,
  Gift,
  Flame,
  RefreshCw,
  Coffee,
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
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
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
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const formatClock = (date) =>
    date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const dopamineCards = [
    {
      title: 'ריקוד ספונטני לשיר אחד',
      desc: 'בחרו שיר שאתם אוהבים ופשוט תזיזו את הגוף במשך 3 דקות.',
      icon: Sparkles,
      accent: 'text-rose-400',
    },
    {
      title: 'סידור מיקרו של משטח קטן',
      desc: 'פנו רק פינה קטנה אחת — שידה, מדף קטן או חלק מהשולחן.',
      icon: Gift,
      accent: 'text-indigo-400',
    },
    {
      title: 'שרבוט יצירתי ל־5 דקות',
      desc: 'קחו דף ועט ותעשו קווים או צורות בלי לחשוב יותר מדי.',
      icon: Lightbulb,
      accent: 'text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans pb-36" dir="rtl">
      <header className="sticky top-0 z-40 px-8 py-5 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
            <Zap size={28} />
          </div>
          <h1 className="text-[28px] md:text-[34px] font-black italic text-slate-900">
            LifeOS <span className="text-indigo-500 not-italic">AI Pro</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-5 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-black shadow-sm hover:bg-rose-100 transition-all">
            <Heart size={18} fill="currentColor" />
            הצלה
          </button>
          <div className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 font-black text-2xl tracking-wide">
            {formatClock(currentTime)}
          </div>
        </div>
      </header>

      <main className="max-w-[1680px] mx-auto px-8 py-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <section className="bg-[#4b566d] text-white px-9 py-7 rounded-[2.5rem] shadow-xl flex items-center justify-between min-h-[132px]">
              <div className="text-[48px] md:text-[56px] font-mono font-black tracking-tight text-white/75">
                --:--
              </div>

              <div className="flex items-center gap-5">
                <h2 className="text-[24px] md:text-[32px] font-black italic text-slate-200">
                  מנוע המיקוד ממתין למשימה...
                </h2>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-14 h-14 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0"
                >
                  {isTimerRunning ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" />}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 xl:col-span-8">
                <section className="bg-white p-8 rounded-[2.8rem] shadow-sm border border-slate-200/60 min-h-[395px]">
                  <div className="flex items-start justify-between gap-5 mb-7">
                    <h2 className="text-[40px] md:text-[52px] leading-[0.92] font-black text-slate-800 text-right">
                      מה כדאי
                      <br />
                      לעשות
                      <br />
                      עכשיו?
                    </h2>

                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-[2rem] border border-slate-200">
                      <span className="text-slate-400 font-black text-base leading-tight text-right">
                        כמה אנרגיה יש לי
                        <br />
                        עכשיו?
                      </span>

                      <div className="flex items-center gap-2 bg-slate-100 rounded-[1.3rem] p-1.5">
                        {[
                          { key: 'high', label: 'גבוהה' },
                          { key: 'medium', label: 'בינונית' },
                          { key: 'low', label: 'נמוכה' },
                        ].map((lvl) => (
                          <button
                            key={lvl.key}
                            onClick={() => setEnergyLevel(lvl.key)}
                            className={`px-6 py-3 rounded-[1rem] text-sm font-black transition-all ${
                              energyLevel === lvl.key
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-200/60'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>

                      <div className="w-px h-10 bg-slate-200" />

                      <button
                        type="button"
                        className="w-11 h-11 rounded-xl bg-white text-indigo-500 flex items-center justify-center shadow-sm border border-slate-200"
                      >
                        <Sparkles size={18} />
                      </button>
                      <button
                        type="button"
                        className="w-11 h-11 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm border border-slate-200"
                      >
                        <Gift size={18} />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={addTask} className="relative mb-6">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="משהו חדש לעשות? כתבו כאן..."
                      className="w-full h-[76px] bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-4 pr-8 pl-24 text-xl outline-none focus:border-indigo-300 transition-all text-slate-700 placeholder:text-slate-300"
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Plus size={22} />
                    </button>
                  </form>

                  {filteredTasks.length === 0 ? (
                    <div className="h-[165px] rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-slate-300 italic text-[22px] font-black gap-2">
                      <Coffee size={30} className="opacity-25" />
                      אין משימות לרמת האנרגיה הזו. אולי הזמן לנוח? ☕
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-[1.7rem] border border-slate-200 bg-slate-50 px-5 py-4 flex items-center gap-3"
                        >
                          <button type="button" onClick={() => toggleTask(task.id)}>
                            {task.completed ? (
                              <CheckCircle2 className="text-emerald-500" size={20} />
                            ) : (
                              <Circle className="text-slate-300" size={20} />
                            )}
                          </button>

                          <div className="flex-1 text-right">
                            <div className="text-lg font-black text-slate-800">{task.text}</div>
                          </div>

                          <button
                            type="button"
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
              </div>

              <div className="col-span-12 xl:col-span-4 space-y-6">
                <section className="bg-white p-6 rounded-[2.6rem] shadow-sm border border-slate-200/60 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
                  <div className="flex justify-between items-center mb-6">
                    <Wallet className="text-emerald-500" size={24} />
                    <h3 className="text-[28px] font-black text-slate-800">תקציב מהיר</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-emerald-50 p-6 rounded-[1.9rem] text-center">
                      <span className="text-[13px] font-black text-emerald-600 uppercase">נשאר לשימוש</span>
                      <p className="text-[46px] font-black text-emerald-700 leading-none mt-2">₪0</p>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-[1.9rem] text-center">
                      <span className="text-[13px] font-black text-rose-600 uppercase">הוצאות</span>
                      <p className="text-[46px] font-black text-rose-700 leading-none mt-2">₪0</p>
                    </div>
                  </div>

                  <button className="w-full h-[58px] bg-slate-100 text-slate-400 text-lg font-black rounded-[1.3rem]">
                    לניהול מלא
                  </button>
                </section>

                <section className="bg-white p-6 rounded-[2.6rem] shadow-sm border border-slate-200/60">
                  <div className="flex justify-between items-center mb-6">
                    <Calendar className="text-indigo-500" size={24} />
                    <h3 className="text-[28px] font-black text-slate-800">לו"ז קרוב</h3>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-[1.9rem] border border-indigo-100 flex items-center justify-between">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Target size={22} />
                    </div>
                    <div className="text-right flex-1 pr-4">
                      <p className="font-black text-slate-800 text-[24px]">אימון ערב</p>
                      <p className="text-[14px] text-indigo-600 font-black mt-1">19:00 • עכשיו בביצוע</p>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-[2.6rem] shadow-sm border border-slate-200/60">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-rose-500 font-black cursor-pointer hover:opacity-70 transition-opacity">
                      <RefreshCw size={16} />
                      <span className="text-sm">רענן</span>
                    </div>
                    <h3 className="text-[28px] font-black flex items-center gap-2 text-slate-800">
                      תפריט דופמין
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {dopamineCards.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={i}
                          className="p-4 bg-white rounded-[1.8rem] border border-slate-200 flex items-start gap-4 hover:shadow-sm transition-all"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center shadow-sm shrink-0">
                            <Icon className={item.accent} size={20} />
                          </div>
                          <div className="text-right">
                            <h4 className="font-black text-slate-800 text-[18px] mb-0.5">{item.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-white p-6 rounded-[2.6rem] shadow-sm border border-slate-200/60">
                  <h3 className="text-[28px] font-black flex items-center justify-between mb-5 text-slate-800">
                    <Lightbulb size={22} className="text-amber-500" />
                    Brain Dump
                  </h3>

                  <textarea
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder="פרוקי פה הכל..."
                    className="w-full h-[220px] bg-slate-50 rounded-[1.9rem] p-6 text-base outline-none border-none resize-none placeholder:text-slate-300 text-slate-700"
                  />
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-300">
            <BrainCircuit size={48} className="mb-4 opacity-20" />
            <p className="text-xl font-black italic uppercase">הטאב של {activeTab} חוזר בקרוב... 🔨</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[860px] px-6">
        <nav className="bg-[#17264a] text-white rounded-[2.5rem] shadow-2xl p-3 flex items-center justify-around gap-1 border border-white/5">
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
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-indigo-600 shadow-lg scale-105 text-white'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[11px] font-black">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
