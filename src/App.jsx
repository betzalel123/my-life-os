import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  CheckCircle2, Circle, Plus, Trash2, Calendar, Zap, BookOpen, 
  LayoutDashboard, Clock, Timer, Play, Pause, RotateCcw, Star, 
  BatteryLow, BatteryMedium, BatteryFull, Lightbulb, HelpCircle, 
  ChevronRight, ListTodo, Target, Wind, Coffee, Headphones, 
  Droplets, Smartphone, Check, ChevronLeft, Sparkles, Loader2, 
  Wand2, MessageCircle, Activity, BrainCircuit, Info, Gift, 
  AlignLeft, Moon, Sun, Dumbbell, GlassWater, Layers, ChevronUp, 
  ArrowRight, Compass, GraduationCap, Trophy, Flame, X, Send, 
  Laptop, CheckCircle, BarChart3, Music, Heart, Smile, Mail, 
  Copy, LifeBuoy, Dices, Shield, Gamepad2, UserCheck, Hourglass, 
  Unlock, MapPin, Briefcase, Download, Upload, Save, Wallet, Home, Trash
} from 'lucide-react';

// --- הגדרות חיבור למסד הנתונים בענן ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // --- ניהול מצב (State) ---
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState(() => loadFromLocal('lifeos_energyLevel', 'medium')); 
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [vision, setVision] = useState(() => loadFromLocal('lifeos_vision', "לבנות חיים מאוזנים."));
  
  // פיננסים
  const [transactions, setTransactions] = useState(() => loadFromLocal('lifeos_transactions', []));
  
  // מטלות בית
  const [chores, setChores] = useState(() => loadFromLocal('lifeos_chores', [
    { id: 1, text: 'לשטוף כלים', completed: false, icon: '🍽️' },
    { id: 2, text: 'כביסה', completed: false, icon: '🧺' },
    { id: 3, text: 'לשאוב אבק', completed: false, icon: '🧹' }
  ]));
  const [newChore, setNewChore] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());

  // --- סנכרון ואימות ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else { await signInAnonymously(auth); }
      } catch (err) { setIsDataLoaded(true); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'lifeos_state', 'main');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.tasks) setTasks(data.tasks);
        if (data.transactions) setTransactions(data.transactions);
        if (data.chores) setChores(data.chores);
        if (data.vision) setVision(data.vision);
        if (data.brainDump !== undefined) setBrainDump(data.brainDump);
      }
      setIsDataLoaded(true);
    }, () => setIsDataLoaded(true));
    return () => unsubscribe();
  }, [user]);

  const saveToCloud = (data) => {
    if (!user || !isDataLoaded) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'lifeos_state', 'main'), data, { merge: true });
  };

  // --- לוגיקה של מטלות בית ---
  const addChore = (e) => {
    if (e) e.preventDefault();
    if (!newChore.trim()) return;
    const chore = { id: Date.now(), text: newChore, completed: false, icon: '🏠' };
    const next = [chore, ...chores];
    setChores(next);
    window.localStorage.setItem('lifeos_chores', JSON.stringify(next));
    saveToCloud({ chores: next });
    setNewChore('');
  };

  const toggleChore = (id) => {
    const next = chores.map(c => c.id === id ? { ...c, completed: !c.completed } : c);
    setChores(next);
    window.localStorage.setItem('lifeos_chores', JSON.stringify(next));
    saveToCloud({ chores: next });
  };

  // --- לוגיקה פיננסית ---
  const financeStats = () => {
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    return { expenses: exp, balance: inc - exp };
  };
  const { expenses, balance } = financeStats();

  // --- טיימרים וכלים ---
  const [timerMode, setTimerMode] = useState('work'); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const timerRef = useRef(null);

  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    else if (timeLeft === 0) { clearInterval(timerRef.current); setTimerMode('work'); setTimeLeft(25*60); setIsTimerRunning(false); }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const updateActiveTab = (tab) => setActiveTab(tab);

  if (!isDataLoaded) return <div className="min-h-screen flex items-center justify-center font-bold">טוען...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Zap className="text-white" size={22} /></div>
          <h1 className="text-xl font-black italic">LifeOS AI Pro</h1>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        
        {/* --- Dashboard --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* מנוע המיקוד */}
              <section className={`p-8 rounded-[3rem] shadow-2xl transition-all duration-700 ${timerMode === 'work' ? 'bg-slate-900 text-white' : 'bg-indigo-400 text-white'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black italic">{focusTask ? focusTask.text : 'מנוע המיקוד'}</h2>
                  <div className="text-4xl font-mono font-black">{formatTime(timeLeft)}</div>
                </div>
                <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black shadow-lg">
                  {isTimerRunning ? 'השהה' : 'התחל'}
                </button>
              </section>

              {/* משימות מהירות */}
              <section className="bg-white p-8 rounded-[3rem] shadow-sm border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><ListTodo size={24} className="text-indigo-600" /> משימות מהירות</h3>
                <div className="space-y-3">
                  {tasks.filter(t => !t.completed).slice(0, 3).map(task => (
                    <div key={task.id} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 hover:border-indigo-500 border border-transparent cursor-pointer" onClick={() => setFocusTask(task)}>
                      <Circle size={20} className="text-slate-300" />
                      <span className="font-bold">{task.emoji} {task.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* --- פיננסים מהיר --- */}
              <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4"><Wallet size={20} className="text-emerald-500" /> תקציב מהיר</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">יתרה</span>
                      <p className="text-xl font-black text-emerald-700">₪{balance}</p>
                   </div>
                   <div className="bg-rose-50 p-3 rounded-2xl text-center">
                      <span className="text-[10px] font-black text-rose-600 uppercase">הוצאות</span>
                      <p className="text-xl font-black text-rose-700">₪{expenses}</p>
                   </div>
                </div>
              </section>

              {/* --- ווידג'ט מטלות בית --- */}
              <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4"><Home size={20} className="text-indigo-500" /> מטלות בית</h3>
                
                <form onSubmit={addChore} className="mb-4 flex gap-2">
                  <input type="text" value={newChore} onChange={(e) => setNewChore(e.target.value)} placeholder="להוסיף מטלה..." className="flex-1 bg-slate-50 p-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-300" />
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl"><Plus size={16}/></button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {chores.filter(c => !c.completed).map(chore => (
                    <div key={chore.id} onClick={() => toggleChore(chore.id)} className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors group">
                      <span className="text-lg">{chore.icon}</span>
                      <span className="text-xs font-bold text-slate-700 flex-1">{chore.text}</span>
                      <Circle size={16} className="text-slate-300 group-hover:text-indigo-500" />
                    </div>
                  ))}
                  {chores.filter(c => !c.completed).length === 0 && <p className="text-center text-[10px] text-slate-400 italic py-4">הבית מתוקשר ורגוע ✨</p>}
                </div>
              </section>

              {/* Brain Dump */}
              <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800"><Lightbulb size={20} className="text-amber-500" /> Brain Dump</h3>
                <textarea value={brainDump} onChange={(e) => setBrainDump(e.target.value)} placeholder="פרוקי פה הכל..." className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm outline-none resize-none" />
              </section>
            </div>
          </div>
        )}

        {/* --- שאר הטאבים --- */}
        {activeTab === 'finance' && <div className="p-8 bg-white rounded-3xl border"> <h2 className="text-3xl font-black italic">ניהול פיננסי מלא</h2> </div>}
        {activeTab === 'tasks' && <div className="p-8 bg-white rounded-3xl border"> <h2 className="text-3xl font-black italic">משימות מורחב</h2> </div>}
        {activeTab === 'vision' && <div className="p-8 bg-white rounded-3xl border"> <h2 className="text-3xl font-black italic">חזון</h2> </div>}

      </main>

      {/* Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around gap-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
            { id: 'tasks', icon: ListTodo, label: 'משימות' },
            { id: 'finance', icon: Wallet, label: 'כסף' },
            { id: 'schedule', icon: Calendar, label: 'לו"ז' },
            { id: 'vision', icon: Compass, label: 'חזון' },
            { id: 'skills', icon: GraduationCap, label: 'מיומנויות' },
            { id: 'tools', icon: Briefcase, label: 'כלים' },
          ].map((item) => (
            <button key={item.id} onClick={() => updateActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg scale-105 font-bold' : 'text-slate-500 hover:text-slate-200'}`}>
              <item.icon size={22} />
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

    </div>
  );
};

export default App;
