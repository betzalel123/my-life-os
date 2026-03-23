import React, { useState } from 'react';
import {
  Wallet, Calendar, Target, Sparkles, Gift, Lightbulb,
  Flame, Coffee, Plus, Circle, CheckCircle2, Trash2,
  Play, Pause, Dices, RefreshCw, Smile, Music, Zap, AlertTriangle
} from 'lucide-react';

const IconMap = { Sparkles, Gift, Lightbulb, Coffee, Flame, Smile, Music, Zap };

export default function DashboardSection({
  energyLevel, setEnergyLevel, tasks, newTask, setNewTask,
  addTask, toggleTask, deleteTask, brainDump, setBrainDump,
  timeLeft, isTimerRunning, setIsTimerRunning
}) {
  const [dopamineOptions, setDopamineOptions] = useState([
    { title: 'ריקוד ספונטני לשיר אחד', desc: 'בחרי שיר שאת אוהבת ופשוט תזיזי את הגוף למשך 3 דקות.', iconName: 'Music', accent: 'text-rose-400' },
    { title: 'סידור מיקרו של משטח קטן', desc: 'פני רק פינה קטנה אחת — שידה או חלק קטן מהשולחן.', iconName: 'Gift', accent: 'text-indigo-400' },
    { title: 'שרבוט יצירתי ל־5 דקות', desc: 'קחי דף ועט ותעשי קווים בלי לחשוב יותר מדי.', iconName: 'Lightbulb', accent: 'text-amber-400' }
  ]);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState(false);

  const refreshDopamineMenu = async () => {
    setIsLoadingGemini(true);
    setGeminiError(false);
    
    const dopaminePrompt = `
      תייצר 3 רעיונות קצרים, יצירתיים ופשוטים לפעולות שמשחררות דופמין (Dopamine Menu) לאדם שצריך הפסקה קצרה מהעבודה או הלימודים.
      חובה קריטית: כל התוכן (הכותרות והתיאורים) חייב להיות כתוב אך ורק בשפה העברית!
      תחזיר את התשובה בפורמט JSON בלבד, שייראה בדיוק במבנה הזה (אובייקט עם מערך שנקרא options):
      {
        "options": [
          { "title": "כותרת קצרה בעברית", "desc": "תיאור של שורה אחת בעברית", "iconName": "Sparkles", "accent": "text-rose-400" }
        ]
      }
      שמות האייקונים האפשריים: Sparkles, Gift, Lightbulb, Coffee, Flame, Smile, Music, Zap.
      צבעי אקסנט אפשריים: text-rose-400, text-indigo-400, text-amber-400, text-emerald-400.
    `;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dopaminePrompt })
      });
      
      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      if (data && data.options) {
        setDopamineOptions(data.options);
      }
    } catch (error) {
      console.error(error);
      setGeminiError(true);
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
      
      <div className="lg:col-span-4 space-y-8">
        
        <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-400" />
          <div className="flex items-center justify-between mb-6">
            <Wallet className="text-emerald-500" size={24} />
            <h2 className="text-[26px] font-black text-slate-800">תקציב מהיר</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-rose-50 rounded-[1.8rem] p-5 text-center">
              <div className="text-rose-500 text-sm font-black mb-1">הוצאות</div>
              <div className="text-[36px] xl:text-[42px] font-black text-rose-600 leading-none">₪0</div>
            </div>
            <div className="bg-emerald-50 rounded-[1.8rem] p-5 text-center">
              <div className="text-emerald-600 text-sm font-black mb-1">נשאר</div>
              <div className="text-[36px] xl:text-[42px] font-black text-emerald-700 leading-none">₪0</div>
            </div>
          </div>
          <button className="w-full h-[56px] rounded-[1.2rem] bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 font-black text-lg">
            לניהול מלא
          </button>
        </section>

        <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <Calendar className="text-indigo-500" size={24} />
            <h2 className="text-[26px] font-black text-slate-800">לו״ז קרוב</h2>
          </div>
          <div className="rounded-[1.8rem] bg-indigo-50 border border-indigo-100 p-5 flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
              <Target size={22} />
            </div>
            <div className="text-right flex-1 pr-4">
              <div className="text-[22px] font-black text-slate-800">אימון ערב</div>
              <div className="text-indigo-500 font-black text-sm mt-1">19:00 • עכשיו בביצוע</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-200/60 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={refreshDopamineMenu}
              disabled={isLoadingGemini}
              className={`px-4 py-2 rounded-xl bg-rose-50 text-rose-500 font-black text-sm flex items-center gap-2 transition-all ${isLoadingGemini ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-100 shadow-sm cursor-pointer'}`}
            >
              {isLoadingGemini ? <RefreshCw size={16} className="animate-spin" /> : <Flame size={16} />}
              {isLoadingGemini ? 'מייצר...' : 'רענן'}
            </button>
            <h2 className="text-[26px] font-black text-slate-800">תפריט דופמין</h2>
          </div>

          {geminiError && (
            <div className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl flex items-center gap-2 border border-rose-100">
              <AlertTriangle size={16} /> שגיאה בחיבור. ודא שהגדרת את המפתח ב-Vercel.
            </div>
          )}

          <div className="space-y-4">
            {dopamineOptions.map((card, index) => {
              const IconComponent = IconMap[card.iconName] || Sparkles; 
              
              return (
                <div key={index} className="rounded-[1.6rem] border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    <IconComponent size={22} className={card.accent || 'text-indigo-400'} />
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

      <div className="lg:col-span-8 space-y-8">
        
        <section className="bg-[#4b566d] text-white rounded-[2.5rem] px-8 py-7 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-16 h-16 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0"
            >
              {isTimerRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <h2 className="text-[26px] xl:text-[32px] font-black italic text-slate-200 leading-none">
              מנוע המיקוד ממתין למשימה...
            </h2>
          </div>
          <div className="text-[52px] xl:text-[64px] font-mono font-black tracking-tight opacity-85">
            {formatTime(timeLeft)}
          </div>
        </section>

        <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 min-h-[400px]">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5 mb-8">
            <h2 className="text-[38px] xl:text-[48px] leading-[1.05] font-black text-slate-800 text-right">
              מה כדאי לעשות עכשיו?
            </h2>

            <div className="flex items-center bg-slate-50 rounded-[2rem] border border-slate-200 p-2 gap-3 mt-2 xl:mt-0">
              <span className="text-slate-400 font-bold text-sm px-2 whitespace-nowrap">כמה אנרגיה יש לי עכשיו?</span>
              <div className="flex items-center bg-slate-100 rounded-[1.5rem] p-1 gap-1">
                {[
                  { key: 'high', label: 'גבוהה' },
                  { key: 'medium', label: 'בינונית' },
                  { key: 'low', label: 'נמוכה' },
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => setEnergyLevel(lvl.key)}
                    className={`px-5 py-2 rounded-xl text-[14px] font-black transition-all ${
                      energyLevel === lvl.key ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200/60'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plus size={24} />
            </button>
          </form>

          {filteredTasks.length === 0 ? (
            <div className="h-[160px] rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-slate-300 italic text-[22px] font-black gap-2">
              <Coffee size={32} className="opacity-30" />
              אין משימות לרמת האנרגיה הזו. אולי הזמן לנוח? ☕
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className="rounded-[1.7rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer">
                  <button type="button" onClick={() => toggleTask(task.id)}>
                    {task.completed ? <CheckCircle2 className="text-emerald-500" size={26} /> : <Circle className="text-slate-300 hover:text-indigo-300" size={26} />}
                  </button>
                  <div className="flex-1 text-right">
                    <div className={`text-xl font-black ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.text}</div>
                  </div>
                  <button type="button" onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 min-h-[330px]">
          <div className="flex items-center justify-between mb-6">
            <Lightbulb className="text-amber-500" size={26} />
            <h2 className="text-[26px] xl:text-[30px] font-black text-slate-800">Brain Dump</h2>
          </div>
          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="פרוק פה הכל... מה שיושב על הראש"
            className="w-full h-[220px] rounded-[2rem] bg-slate-50 border-none outline-none resize-none p-6 text-xl text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-amber-100/50 transition-all"
          />
        </section>

      </div>
    </div>
  );
}
