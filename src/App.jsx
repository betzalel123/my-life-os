import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Zap, ListTodo, Wallet, Calendar,
  Compass, GraduationCap, Briefcase, Plus, Circle,
  Lightbulb, Play, Pause, Heart, CheckCircle2,
  BrainCircuit, Sparkles, Trash2, Target, Gift,
  Flame, RefreshCw, Coffee
} from 'lucide-react';

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch { return defaultValue; }
};

const App = () => {
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState(() => loadFromLocal('lifeos_energyLevel', 'medium'));
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [timeLeft, setTimeLeft] = useState(() => loadFromLocal('lifeos_timeLeft', 25 * 60));
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    window.localStorage.setItem('lifeos_activeTab', activeTab);
    window.localStorage.setItem('lifeos_energyLevel', energyLevel);
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_brainDump', brainDump);
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
    } else { clearInterval(interval); }
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
    setTasks([{ id: Date.now(), text: newTask.trim(), completed: false, energyRequired: energyLevel }, ...tasks]);
    setNewTask('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 px-8 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-slate-400 font-black text-xl ml-4">{currentTime.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</div>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold shadow-sm hover:bg-rose-100 transition-all">
            <Heart size={14} fill="currentColor" /> הצלה
          </button>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black italic text-slate-900">LifeOS <span className="text-indigo-600 not-italic">AI Pro</span></h1>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <Zap size={22} />
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8">
            
            {/* טיימר עליון כהה */}
            <section className="bg-[#2d3748] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-indigo-400">
                  <RefreshCw size={20} />
                </div>
                <h2 className="text-xl font-bold italic text-slate-200">מנוע המיקוד ממתין למשימה...</h2>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-5xl font-mono font-black">{formatTime(timeLeft)}</div>
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-14 h-14 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                >
                  {isTimerRunning ? <Pause size={28} fill="white" /> : <Play size={28} className="mr-[-4px]" fill="white" />}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* עמודה ימנית (ווידג'טים קטנים) */}
              <div className="lg:col-span-4 space-y-8">
                {/* תקציב מהיר */}
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
                  <div className="flex justify-between items-center mb-6">
                    <Wallet className="text-emerald-500" size={24} />
                    <h3 className="text-lg font-bold">תקציב מהיר</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-50">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">נשאר לשימוש</span>
                      <p className="text-xl font-black text-emerald-700">₪0</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-2xl text-center border border-rose-50">
                      <span className="text-[10px] font-black text-rose-600 uppercase">הוצאות</span>
                      <p className="text-xl font-black text-rose-700">₪0</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-50">לניהול מלא</button>
                </section>

                {/* לו"ז קרוב */}
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <Calendar className="text-indigo-500" size={24} />
                    <h3 className="text-lg font-bold">לו"ז קרוב</h3>
                  </div>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white"><Target size={20}/></div>
                      <div>
                        <p className="font-bold text-slate-800">אימון ערב</p>
                        <p className="text-[10px] text-indigo-600 font-bold">19:00 • עכשיו בביצוע</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* עמודה מרכזית (משימות ותפריט דופמין) */}
              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h3 className="text-2xl font-black flex items-center gap-3">מה כדאי לעשות עכשיו? <ListTodo size={24} className="text-indigo-600" /></h3>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border">
                       <span className="text-[10px] font-bold text-slate-400 px-2 leading-tight">כמה אנרגיה יש לי עכשיו?</span>
                       {['נמוכה', 'בינונית', 'גבוהה'].map(lvl => (
                         <button 
                           key={lvl} 
                           onClick={() => setEnergyLevel(lvl === 'נמוכה' ? 'low' : lvl === 'בינונית' ? 'medium' : 'high')}
                           className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                             (energyLevel === 'low' && lvl === 'נמוכה') || (energyLevel === 'medium' && lvl === 'בינונית') || (energyLevel === 'high' && lvl === 'גבוהה')
                             ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
                           }`}
                         >
                           {lvl}
                         </button>
                       ))}
                    </div>
                  </div>

                  <form onSubmit={addTask} className="relative mb-6">
                    <input 
                      type="text" 
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="משהו חדש לעשות? כתבי כאן..." 
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-indigo-300 transition-all"
                    />
                    <button className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Plus size={20}/></button>
                  </form>

                  <div className="py-12 border-2 border-dashed border-slate-50 rounded-[2rem] text-center text-slate-300 italic text-sm flex flex-col items-center gap-2">
                    <Coffee size={32} className="opacity-20" />
                    אין משימות לרמת האנרגיה הזו. אולי זה זמן לנוח? ☕
                  </div>
                </section>

                {/* תפריט דופמין */}
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-rose-500 font-bold cursor-pointer hover:opacity-70 transition-opacity">
                      <RefreshCw size={16} /> <span className="text-xs uppercase">רענן</span>
                    </div>
                    <h3 className="text-xl font-bold flex items-center gap-2">תפריט דופמין <Flame size={20} className="text-rose-500" fill="currentColor" /></h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'ריקוד ספונטני לשיר אחד', desc: 'בחרו שיר שאתם אוהבים ופשוט תזיזו את הגוף למשך 3 דקות.', icon: <Sparkles className="text-rose-400" /> },
                      { title: 'סידור "מיקרו" של משטח קטן', desc: 'פנו רק את השידה ליד המיטה או חלק קטן משולחן הכתיבה.', icon: <Gift className="text-emerald-400" /> },
                      { title: 'שרבוט יצירתי ל-5 דקות', desc: 'קחו דף ועט ופשוט תציירו צורות אקראיות.', icon: <Lightbulb className="text-amber-400" /> }
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-start gap-4 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Brain Dump */}
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">Brain Dump <Lightbulb size={22} className="text-amber-500" /></h3>
                   <textarea 
                     value={brainDump} 
                     onChange={(e) => setBrainDump(e.target.value)}
                     placeholder="פרוקי פה הכל..." 
                     className="w-full h-40 bg-slate-50/50 rounded-3xl p-6 text-sm outline-none border-none focus:ring-2 focus:ring-amber-50 resize-none"
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

      {/* Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-[#1e293b] text-white rounded-[2.5rem] shadow-2xl p-2 flex items-center justify-around gap-1 border border-white/5">
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
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-200'}`}
            >
              <item.icon size={20} />
              <span className="text-[11px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
