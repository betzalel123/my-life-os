import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Zap, ListTodo, Wallet, Calendar, 
  Compass, GraduationCap, Briefcase, Home, Plus, 
  Circle, Lightbulb, Play, Pause
} from 'lucide-react';

// פונקציית עזר לשמירה מקומית על המכשיר
const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) { return defaultValue; }
};

const App = () => {
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [chores, setChores] = useState(() => loadFromLocal('lifeos_chores', [
    { id: 1, text: 'לשטוף כלים', completed: false, icon: '🍽️' },
    { id: 2, text: 'כביסה', completed: false, icon: '🧺' }
  ]));
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [isDataLoaded, setIsDataLoaded] = useState(true); // מבטיח שהמסך לא ישאר לבן

  // שמירה אוטומטית בכל שינוי
  useEffect(() => {
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_chores', JSON.stringify(chores));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
  }, [tasks, chores, brainDump]);

  const addChore = (text) => {
    if (!text.trim()) return;
    setChores([{ id: Date.now(), text, completed: false, icon: '🏠' }, ...chores]);
  };

  if (!isDataLoaded) return <div className="flex items-center justify-center min-h-screen">טוען...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-32" dir="rtl">
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Zap className="text-white" size={22} /></div>
          <h1 className="text-xl font-black italic">LifeOS AI Pro</h1>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ווידג'ט מטלות בית */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4"><Home size={20} className="text-indigo-500" /> מטלות בית</h3>
                <div className="space-y-2">
                  {chores.map(chore => (
                    <div key={chore.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <span>{chore.icon}</span>
                      <span className="text-sm font-bold flex-1">{chore.text}</span>
                      <Circle size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
            </section>

            {/* Brain Dump */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800"><Lightbulb size={20} className="text-amber-500" /> Brain Dump</h3>
                <textarea 
                  value={brainDump} 
                  onChange={(e) => setBrainDump(e.target.value)}
                  placeholder="פרוק פה הכל..." 
                  className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm outline-none resize-none border-none focus:ring-1 focus:ring-amber-200" 
                />
            </section>
          </div>
        )}
        
        {activeTab !== 'dashboard' && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed text-slate-400">
            הטאב הזה בבנייה... תכף חוזרים!
          </div>
        )}
      </main>

      {/* Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
            { id: 'tasks', icon: ListTodo, label: 'משימות' },
            { id: 'finance', icon: Wallet, label: 'כסף' },
            { id: 'vision', icon: Compass, label: 'חזון' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-200'}`}>
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
