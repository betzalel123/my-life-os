import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Zap, ListTodo, Wallet, Calendar, 
  Compass, GraduationCap, Briefcase, Home, Plus, 
  Circle, Lightbulb, Play, Pause, Timer, Clock, 
  BatteryLow, BatteryMedium, BatteryFull, RefreshCw,
  Heart, Star, Coffee, Smile, CheckCircle2, X,
  TrendingUp, TrendingDown, ChevronRight, Target,
  BrainCircuit, Sparkles, Trash2
} from 'lucide-react';

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) { return defaultValue; }
};

const App = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState('medium');
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [newTask, setNewTask] = useState('');
  const [chores, setChores] = useState(() => loadFromLocal('lifeos_chores', [
    { id: 1, text: 'לשטוף כלים', completed: false, icon: '🍽️' },
    { id: 2, text: 'כביסה', completed: false, icon: '🧺' }
  ]));
  const [newChore, setNewChore] = useState('');
  const [transactions, setTransactions] = useState(() => loadFromLocal('lifeos_transactions', []));
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Auto-save
  useEffect(() => {
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_chores', JSON.stringify(chores));
    window.localStorage.setItem('lifeos_transactions', JSON.stringify(transactions));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
    window.localStorage.setItem('lifeos_activeTab', JSON.stringify(activeTab));
  }, [tasks, chores, transactions, brainDump, activeTab]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Finance Calc
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-xs font-bold cursor-pointer">
          <Heart size={14} fill="currentColor" /> SOS
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black italic text-indigo-600 uppercase">LifeOS AI Pro</h1>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <Zap size={22} />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <section className="bg-slate-800 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold italic text-slate-200">מנוע המיקוד</h2>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-5xl font-mono font-black">{formatTime(timeLeft)}</div>
                <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95">
                  {isTimerRunning ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Wallet className="text-emerald-500" /> תקציב מהיר</h3>
                  <div className="bg-emerald-50 p-4 rounded-2xl mb-2 text-center border border-emerald-100">
                    <p className="text-2xl font-black text-emerald-700">₪{income - expenses}</p>
                  </div>
                </section>
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Home className="text-indigo-500" /> מטלות בית</h3>
                  <div className="space-y-2">
                    {chores.slice(0,3).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm">
                        <span>{c.icon}</span><span className="flex-1 font-bold">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">תפריט דופמין ✨</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                      <Coffee className="text-rose-400" /> <span className="text-sm font-bold">ריקוד ספונטני</span>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                      <Sparkles className="text-indigo-400" /> <span className="text-sm font-bold">סידור מיקרו</span>
                    </div>
                  </div>
                </section>
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <h3 className="text-xl font-bold mb-4">Brain Dump 💡</h3>
                   <textarea value={brainDump} onChange={(e) => setBrainDump(e.target.value)} className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm outline-none resize-none border-none" placeholder="מה בראש שלך?" />
                </section>
              </div>
            </div>
          </div>
        )}

        {/* --- TASKS TAB --- */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic">ניהול משימות חכם</h2>
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex gap-4 mb-8">
                {['low', 'medium', 'high'].map(lvl => (
                  <button key={lvl} onClick={() => setEnergyLevel(lvl)} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${energyLevel === lvl ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                    אנרגיה {lvl === 'low' ? '😴' : lvl === 'medium' ? '💪' : '⚡'}
                  </button>
                ))}
              </div>
              <div className="relative mb-6">
                <input type="text" placeholder="להוסיף משימה חדשה..." className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-5 px-6 outline-none" />
                <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl shadow-lg"><Plus /></button>
              </div>
              <div className="space-y-4">
                <p className="text-center text-slate-400 italic py-10">אין משימות לרמת האנרגיה הזו...</p>
              </div>
            </div>
          </div>
        )}

        {/* --- FINANCE TAB --- */}
        {activeTab === 'finance' && (
          <div className="space-y-8">
             <h2 className="text-3xl font-black italic">ניהול פיננסי</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-lg">
                  <p className="text-sm font-bold opacity-80">יתרה נוכחית</p>
                  <p className="text-4xl font-black">₪{income - expenses}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-sm font-bold text-slate-400">הוצאות החודש</p>
                  <p className="text-4xl font-black text-rose-500">₪{expenses}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-sm font-bold text-slate-400">הכנסות החודש</p>
                  <p className="text-4xl font-black text-emerald-500">₪{income}</p>
                </div>
             </div>
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
                <h3 className="text-xl font-bold mb-6 italic">תנועות אחרונות</h3>
                <p className="text-center text-slate-400 py-10">עוד לא הוספת תנועות החודש.</p>
             </div>
          </div>
        )}

        {/* --- OTHER TABS --- */}
        {['vision', 'schedule', 'skills', 'tools'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-400">
             <BrainCircuit size={48} className="mb-4 opacity-20" />
             <p className="text-xl font-black italic">הטאב הזה בתהליכי בנייה... 🔨</p>
          </div>
        )}
      </main>

      {/* Navigation Dock */}
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
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>
              <item.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
