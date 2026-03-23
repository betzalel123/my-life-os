import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Zap, ListTodo, Wallet, Calendar, 
  Compass, GraduationCap, Briefcase, Home, Plus, 
  Circle, Lightbulb, Play, Pause, RefreshCw,
  Heart, Coffee, Smile, CheckCircle2, X, BrainCircuit, Sparkles
} from 'lucide-react';

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) { return defaultValue; }
};

const App = () => {
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState('medium');
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [chores, setChores] = useState(() => loadFromLocal('lifeos_chores', [
    { id: 1, text: 'לשטוף כלים', completed: false, icon: '🍽️' },
    { id: 2, text: 'כביסה', completed: false, icon: '🧺' }
  ]));
  const [newChore, setNewChore] = useState('');
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_chores', JSON.stringify(chores));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
    window.localStorage.setItem('lifeos_activeTab', activeTab);
  }, [tasks, chores, brainDump, activeTab]);

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

  const toggleChore = (id) => {
    setChores(chores.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between">
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
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* טיימר עליון כהה */}
            <section className="bg-[#2d3748] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-indigo-400">
                    <RefreshCw size={20} />
                 </div>
                 <h2 className="text-xl font-bold italic text-slate-200">מנוע המיקוד ממתין למשימה...</h2>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-5xl font-mono font-black">{formatTime(timeLeft)}</div>
                <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-400 transition-all">
                  {isTimerRunning ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* עמודה ימנית (ווידג'טים) */}
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Wallet className="text-emerald-500" /> תקציב מהיר</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">נשאר</span>
                      <p className="text-xl font-black text-emerald-700">₪0</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
                      <span className="text-[10px] font-black text-rose-600 uppercase">הוצאות</span>
                      <p className="text-xl font-black text-rose-700">₪0</p>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">מטלות בית <Home className="text-indigo-500" /></h3>
                  <div className="space-y-2">
                    {chores.map(c => (
                      <div key={c.id} onClick={() => toggleChore(c.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${c.completed ? 'bg-slate-50 opacity-50' : 'bg-white hover:border-indigo-100 shadow-sm'}`}>
                        <span className="text-lg">{c.icon}</span>
                        <span className={`text-sm font-bold flex-1 ${c.completed ? 'line-through' : ''}`}>{c.text}</span>
                        {c.completed ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Circle className="text-slate-200" size={18} />}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* עמודה מרכזית (משימות ותפריט) */}
              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h3 className="text-2xl font-black">מה כדאי לעשות עכשיו?</h3>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border">
                       {['נמוכה', 'בינונית', 'גבוהה'].map(lvl => (
                         <button key={lvl} onClick={() => setEnergyLevel(lvl === 'נמוכה' ? 'low' : lvl === 'בינונית' ? 'medium' : 'high')}
                           className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                             (energyLevel === 'low' && lvl === 'נמוכה') || (energyLevel === 'medium' && lvl === 'בינונית') || (energyLevel === 'high' && lvl === 'גבוהה')
                             ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400'
                           }`}
                         >
                           {lvl}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-400 italic text-sm">
                    אין משימות לרמת האנרגיה הזו... ☕
                  </div>
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">תפריט דופמין ✨</h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Smile className="text-rose-400" /></div>
                      <div><h4 className="font-bold text-slate-800">ריקוד ספונטני לשיר אחד</h4><p className="text-xs text-slate-500">תזיזו את הגוף למשך 3 דקות!</p></div>
                    </div>
                    <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Sparkles className="text-indigo-400" /></div>
                      <div><h4 className="font-bold text-slate-800">סידור מיקרו של משטח קטן</h4><p className="text-xs text-slate-500">פנו רק את השידה או חלק קטן מהשולחן.</p></div>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <h3 className="text-xl font-bold mb-4">Brain Dump 💡</h3>
                   <textarea value={brainDump} onChange={(e) => setBrainDump(e.target.value)} className="w-full h-40 bg-slate-50/50 rounded-3xl p-6 text-sm outline-none border-none focus:ring-2 focus:ring-amber-100 resize-none" placeholder="פרוקי פה הכל..." />
                </section>
              </div>
            </div>
          </div>
        )}

        {/* טאבים אחרים */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-400">
             <BrainCircuit size={48} className="mb-4 opacity-20" />
             <p className="text-xl font-black italic">הטאב של {activeTab} חוזר בקרוב... 🔨</p>
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
