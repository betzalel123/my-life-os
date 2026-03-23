import React, { useState } from 'react';
import {
  Wallet, Calendar, Target, Sparkles, Gift, Lightbulb,
  Flame, Coffee, Plus, Circle, CheckCircle2, Trash2,
  Play, Pause, Dices, RefreshCw, Smile, Music, Zap, AlertTriangle, Loader2, ListChecks
} from 'lucide-react';

const IconMap = { Sparkles, Gift, Lightbulb, Coffee, Flame, Smile, Music, Zap };

export default function DashboardSection({
  energyLevel, setEnergyLevel, tasks, setTasks, newTask, setNewTask,
  addTask, toggleTask, deleteTask, brainDump, setBrainDump,
  timeLeft, isTimerRunning, setIsTimerRunning
}) {
  const [dopamineOptions, setDopamineOptions] = useState([
    { title: 'ריקוד ספונטני לשיר אחד', desc: 'בחרי שיר שאת אוהבת ופשוט תזיזי את הגוף למשך 3 דקות.', iconName: 'Music', accent: 'text-rose-400' },
    { title: 'סידור מיקרו של משטח קטן', desc: 'פני רק פינה קטנה אחת — שידה או חלק קטן מהשולחן.', iconName: 'Gift', accent: 'text-indigo-400' },
    { title: 'שרבוט יצירתי ל־5 דקות', desc: 'קחי דף ועט ותעשי קווים בלי לחשוב יותר מדי.', iconName: 'Lightbulb', accent: 'text-amber-400' }
  ]);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isProcessingDump, setIsProcessingDump] = useState(false);

  // פונקציית הפיכת Brain Dump למשימות
  const processBrainDump = async () => {
    if (!brainDump.trim()) return;
    setIsProcessingDump(true);

    const dumpPrompt = `
      קח את טקסט ה-"Brain Dump" הבא: "${brainDump}"
      1. נתח אותו וחלץ ממנו משימות קונקרטיות לביצוע.
      2. לכל משימה, קבע רמת אנרגיה (high, medium, low) לפי הקושי.
      3. תחזיר אך ורק אובייקט JSON במבנה הזה:
      {
        "newTasks": [
          { "text": "שם המשימה בעברית", "energy": "high/medium/low" }
        ]
      }
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dumpPrompt })
      });

      const data = await response.json();
      
      if (data.newTasks && data.newTasks.length > 0) {
        const processedTasks = data.newTasks.map(t => ({
          id: Date.now() + Math.random(),
          text: t.text,
          completed: false,
          energyRequired: t.energy
        }));
        
        setTasks([...tasks, ...processedTasks]);
        setBrainDump('');
        alert(`הצלחתי לחלץ ${processedTasks.length} משימות!`);
      }
    } catch (error) {
      console.error("Failed to process dump:", error);
    } finally {
      setIsProcessingDump(false);
    }
  };

  // הוספת משימה חכמה עם סיווג אנרגיה
  const handleSmartAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setIsAddingTask(true);
    
    const energyPrompt = `
      נתח את המשימה: "${newTask}". 
      קבע רמת אנרגיה: 
      - high: ריכוז עמוק/מאמץ כבד.
      - medium: עבודה רגילה/סידורים.
      - low: משהו קליל/אוטומטי.
      תחזיר JSON בלבד: { "energy": "level" }
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: energyPrompt })
      });
      const data = await response.json();
      const detectedEnergy = (['high', 'medium', 'low'].includes(data.energy)) ? data.energy : 'medium';

      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, energyRequired: detectedEnergy }]);
      setNewTask('');
      setEnergyLevel(detectedEnergy); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingTask(false);
    }
  };

  // רענון תפריט דופמין עם אייקונים וצבעים מותאמים
  const refreshDopamineMenu = async () => {
    setIsLoadingGemini(true);
    try {
      const dopaminePrompt = `
        תייצר 3 רעיונות קצרים ופשוטים להפסקות דופמין בעברית.
        עבור כל רעיון, בחר אייקון מתאים מהרשימה: Music, Coffee, Flame, Smile, Zap, Lightbulb, Gift, Sparkles.
        בחר צבע אקסנט מתאים: text-rose-400, text-indigo-400, text-amber-400, text-emerald-400.
        
        חובה להחזיר JSON בלבד במבנה:
        { "options": [{ "title": "כותרת", "desc": "תיאור", "iconName": "שם האייקון", "accent": "הצבע" }] }
      `;
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dopaminePrompt })
      });
      const data = await response.json();
      if (data && data.options) {
        setDopamineOptions(data.options);
      }
    } catch (error) {
      console.error("Dopamine refresh failed:", error);
    } finally {
      setIsLoadingGemini(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter((task) => !task.completed && task.energyRequired === energyLevel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* עמודה שמאלית - תקציב ודופמין */}
      <div className="lg:col-span-4 space-y-8">
        <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-400" />
          <div className="flex items-center justify-between mb-6">
            <Wallet className="text-emerald-500" size={24} />
            <h2 className="text-[26px] font-black text-slate-800">תקציב מהיר</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5 text-center">
            <div className="bg-rose-50 rounded-[1.8rem] p-5">
              <div className="text-rose-500 text-sm font-black mb-1">הוצאות</div>
              <div className="text-[36px] font-black text-rose-600 leading-none">₪0</div>
            </div>
            <div className="bg-emerald-50 rounded-[1.8rem] p-5">
              <div className="text-emerald-600 text-sm font-black mb-1">נשאר</div>
              <div className="text-[36px] font-black text-emerald-700 leading-none">₪0</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-200/60 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={refreshDopamineMenu} 
              disabled={isLoadingGemini} 
              className={`px-4 py-2 rounded-xl bg-rose-50 text-rose-500 font-black text-sm flex items-center gap-2 transition-all ${isLoadingGemini ? 'opacity-50' : 'hover:bg-rose-100 shadow-sm'}`}
            >
              {isLoadingGemini ? <RefreshCw size={16} className="animate-spin" /> : <Flame size={16} />}
              {isLoadingGemini ? 'מייצר...' : 'רענן'}
            </button>
            <h2 className="text-[26px] font-black text-slate-800">תפריט דופמין</h2>
          </div>
          <div className="space-y-4">
            {dopamineOptions.map((card, i) => {
              const IconComponent = IconMap[card.iconName] || Sparkles;
              return (
                <div key={i} className="rounded-[1.6rem] border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    <IconComponent size={22} className={card.accent || 'text-rose-400'} />
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[17px] text-slate-800">{card.title}</div>
                    <div className="text-slate-500 text-sm mt-1 leading-relaxed">{card.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* עמודה ימנית - טיימר ומשימות */}
      <div className="lg:col-span-8 space-y-8">
        <section className="bg-[#4b566d] text-white rounded-[2.5rem] px-8 py-7 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="w-16 h-16 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95">
              {isTimerRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <h2 className="text-[26px] font-black italic text-slate-200 leading-none">פוקוס</h2>
          </div>
          <div className="text-[52px] font-mono font-black opacity-85">{formatTime(timeLeft)}</div>
        </section>

        <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 min-h-[400px]">
          <div className="flex flex-col xl:flex-row justify-between gap-5 mb-8">
            <h2 className="text-[38px] font-black text-slate-800 text-right">מה עושים עכשיו?</h2>
            <div className="flex items-center bg-slate-50 rounded-[2rem] border border-slate-200 p-2 gap-1">
              {['high', 'medium', 'low'].map((lvl) => (
                <button 
                  key={lvl} 
                  onClick={() => setEnergyLevel(lvl)} 
                  className={`px-5 py-2 rounded-xl text-[14px] font-black transition-all ${energyLevel === lvl ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200/60'}`}
                >
                  {lvl === 'high' ? 'גבוהה' : lvl === 'medium' ? 'בינונית' : 'נמוכה'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSmartAddTask} className="relative mb-6">
            <input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="כתבי משימה..." 
              className="w-full h-[76px] bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-4 pr-8 pl-24 text-xl outline-none focus:border-indigo-300 transition-all text-slate-700" 
              disabled={isAddingTask} 
            />
            <button 
              type="submit" 
              disabled={isAddingTask} 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              {isAddingTask ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
            </button>
          </form>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="h-[160px] rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-slate-300 italic text-[22px] font-black gap-2">
                <Coffee size={32} className="opacity-30" />
                אין משימות לרמה הזו.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="rounded-[1.7rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4 hover:shadow-sm transition-all">
                  <button type="button" onClick={() => toggleTask(task.id)}>
                    {task.completed ? <CheckCircle2 className="text-emerald-500" size={26} /> : <Circle className="text-slate-300" size={26} />}
                  </button>
                  <div className={`flex-1 text-right font-black text-xl ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.text}</div>
                  <button type="button" onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-rose-500">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Brain Dump עם כפתור המרה חכם */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={processBrainDump} 
              disabled={isProcessingDump || !brainDump.trim()} 
              className={`px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center gap-2 transition-all ${isProcessingDump || !brainDump.trim() ? 'opacity-40 cursor-not-allowed' : 'hover:bg-indigo-100 shadow-sm'}`}
            >
              {isProcessingDump ? <Loader2 size={16} className="animate-spin" /> : <ListChecks size={18} />}
              {isProcessingDump ? 'מנתח...' : 'הפוך למשימות'}
            </button>
            <h2 className="text-[26px] font-black text-slate-800 flex items-center gap-2">
              Brain Dump
              <Lightbulb className="text-amber-500" size={24} />
            </h2>
          </div>
          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="תשפכי פה הכל... ג'מיני כבר יסדר את זה למשימות"
            className="w-full h-[180px] rounded-[2rem] bg-slate-50 border-none outline-none resize-none p-6 text-xl text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </section>
      </div>
    </div>
  );
}
