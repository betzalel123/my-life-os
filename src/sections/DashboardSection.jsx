import React, { useMemo, useState } from 'react';
import {
  Wallet,
  Calendar,
  Target,
  Sparkles,
  Gift,
  Lightbulb,
  Flame,
  Coffee,
  Plus,
  Circle,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Smile,
  Music,
  Zap,
  Loader2,
  ListChecks,
} from 'lucide-react';

const IconMap = {
  Sparkles,
  Gift,
  Lightbulb,
  Coffee,
  Flame,
  Smile,
  Music,
  Zap,
};

const defaultDopamineOptions = [
  {
    title: 'ריקוד ספונטני לשיר אחד',
    desc: 'שיר אחד, שלוש דקות, בלי לחשוב יותר מדי.',
    iconName: 'Music',
    accent: 'text-rose-400',
  },
  {
    title: 'סידור מיקרו של משטח קטן',
    desc: 'רק פינה אחת קטנה. לא כל החדר.',
    iconName: 'Gift',
    accent: 'text-indigo-400',
  },
  {
    title: 'שרבוט יצירתי ל־5 דקות',
    desc: 'דף, עט, קווים חופשיים בלי מטרה.',
    iconName: 'Lightbulb',
    accent: 'text-amber-400',
  },
];

const energyLabels = {
  high: 'גבוהה',
  medium: 'בינונית',
  low: 'נמוכה',
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function DashboardSection({
  energyLevel,
  setEnergyLevel,
  tasks,
  setTasks,
  newTask,
  setNewTask,
  toggleTask,
  deleteTask,
  brainDump,
  setBrainDump,
  timeLeft,
  isTimerRunning,
  setIsTimerRunning,
}) {
  const [dopamineOptions, setDopamineOptions] = useState(defaultDopamineOptions);
  const [isLoadingDopamine, setIsLoadingDopamine] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isProcessingDump, setIsProcessingDump] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const filteredTasks = useMemo(
    () => tasks.filter((task) => !task.completed && task.energyRequired === energyLevel),
    [tasks, energyLevel]
  );

  const addTaskLocally = (text, detectedEnergy = 'medium') => {
    const safeEnergy = ['high', 'medium', 'low'].includes(detectedEnergy)
      ? detectedEnergy
      : 'medium';

    const task = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      energyRequired: safeEnergy,
    };

    setTasks((prev) => [task, ...prev]);
    setEnergyLevel(safeEnergy);
  };

  const handleSmartAddTask = async (e) => {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setStatusMessage('');
    setIsAddingTask(true);

    const prompt = `
אתה מסווג משימות לפי רמת אנרגיה.
נתח את המשימה הבאה בעברית: "${text}"

הגדרות:
- high = דורש ריכוז עמוק, חשיבה מורכבת, מאמץ כבד, או משימה מלחיצה/כבדה.
- medium = משימה רגילה, סידור, טיפול בדברים שוטפים, ביצוע שדורש תשומת לב סבירה.
- low = משימה קלה, טכנית, קצרה, אוטומטית, או משהו שאפשר לעשות גם כשעייפים.

דוגמאות:
- "לכתוב עבודה" -> high
- "לעשות קניות" -> medium
- "לשטוף כוס" -> low
- "לענות למייל חשוב" -> medium
- "לפתור באג מורכב" -> high
- "להוציא זבל" -> low

אל תהיה מקל מדי. אם יש ספק בין low ל-medium, העדף medium.
אם יש ספק בין medium ל-high, בדוק האם יש חשיבה עמוקה או עומס רגשי.

החזר JSON בלבד בפורמט:
{ "energy": "high" }
או
{ "energy": "medium" }
או
{ "energy": "low" }
`.trim();

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const detectedEnergy = data?.energy || 'medium';

      addTaskLocally(text, detectedEnergy);
      setNewTask('');
      setStatusMessage(`המשימה נוספה תחת אנרגיה ${energyLabels[detectedEnergy] || 'בינונית'}.`);
    } catch (error) {
      addTaskLocally(text, 'medium');
      setNewTask('');
      setStatusMessage('לא הצלחתי לנתח את רמת האנרגיה, אז הוספתי כבינונית.');
      console.error(error);
    } finally {
      setIsAddingTask(false);
    }
  };

  const refreshDopamineMenu = async () => {
    setStatusMessage('');
    setIsLoadingDopamine(true);

    const prompt = `
תייצר 3 רעיונות קצרים להפסקות דופמין בעברית.

חוקים:
- כל רעיון חייב להיות שונה באופי.
- בחר iconName מתאים מתוך הרשימה בלבד:
  Music, Coffee, Flame, Smile, Zap, Lightbulb, Gift, Sparkles
- בחר accent מתאים מתוך הרשימה בלבד:
  text-rose-400, text-indigo-400, text-amber-400, text-emerald-400
- אל תחזיר את אותו iconName לכל הפריטים אלא אם אין ברירה.
- הכותרת קצרה.
- התיאור קצר, טבעי, ולא רובוטי.

החזר JSON בלבד בפורמט:
{
  "options": [
    {
      "title": "כותרת",
      "desc": "תיאור קצר",
      "iconName": "Music",
      "accent": "text-rose-400"
    }
  ]
}
`.trim();

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (Array.isArray(data?.options) && data.options.length > 0) {
        setDopamineOptions(data.options.slice(0, 3));
      } else {
        setStatusMessage('לא הצלחתי לרענן עכשיו את תפריט הדופמין.');
      }
    } catch (error) {
      setStatusMessage('לא הצלחתי לרענן עכשיו את תפריט הדופמין.');
      console.error(error);
    } finally {
      setIsLoadingDopamine(false);
    }
  };

  const processBrainDump = async () => {
    const text = brainDump.trim();
    if (!text) return;

    setStatusMessage('');
    setIsProcessingDump(true);

    const prompt = `
קח את ה-Brain Dump הבא בעברית והפוך אותו למשימות ברורות:

"${text}"

חוקים:
- חלץ רק משימות שאפשר לבצע בפועל.
- כל משימה צריכה להיות קצרה וברורה.
- לכל משימה קבע energy:
  high / medium / low
- אל תחזיר מחשבות כלליות שלא הפכו למשימה.
- אם אין משימות, החזר מערך ריק.

החזר JSON בלבד בפורמט:
{
  "newTasks": [
    { "text": "שם המשימה", "energy": "medium" }
  ]
}
`.trim();

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const newTasks = Array.isArray(data?.newTasks) ? data.newTasks : [];

      if (!newTasks.length) {
        setStatusMessage('לא מצאתי כרגע משימות ברורות בתוך ה-Brain Dump.');
        return;
      }

      const normalizedTasks = newTasks.map((task, index) => ({
        id: Date.now() + Math.random() + index,
        text: String(task.text || '').trim(),
        completed: false,
        energyRequired: ['high', 'medium', 'low'].includes(task.energy)
          ? task.energy
          : 'medium',
      })).filter((task) => task.text);

      if (!normalizedTasks.length) {
        setStatusMessage('לא מצאתי כרגע משימות ברורות בתוך ה-Brain Dump.');
        return;
      }

      setTasks((prev) => [...normalizedTasks, ...prev]);
      setBrainDump('');
      setStatusMessage(`נוצרו ${normalizedTasks.length} משימות חדשות.`);
    } catch (error) {
      setStatusMessage('לא הצלחתי להפוך את ה-Brain Dump למשימות.');
      console.error(error);
    } finally {
      setIsProcessingDump(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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

          <button className="w-full h-[56px] rounded-[1.2rem] bg-slate-100 text-slate-500 font-black text-lg">
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
              disabled={isLoadingDopamine}
              className={`px-4 py-2 rounded-xl bg-rose-50 text-rose-500 font-black text-sm flex items-center gap-2 transition-all ${
                isLoadingDopamine ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-100 shadow-sm'
              }`}
            >
              {isLoadingDopamine ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Flame size={16} />
              )}
              {isLoadingDopamine ? 'מייצר...' : 'רענן'}
            </button>

            <h2 className="text-[26px] font-black text-slate-800">תפריט דופמין</h2>
          </div>

          <div className="space-y-4">
            {dopamineOptions.map((card, i) => {
              const IconComponent = IconMap[card.iconName] || Sparkles;
              return (
                <div
                  key={i}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50/60 p-4 flex items-start gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                >
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

      <div className="lg:col-span-8 space-y-8">
        <section className="bg-[#4b566d] text-white rounded-[2.5rem] px-8 py-7 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-16 h-16 bg-indigo-500 hover:bg-indigo-400 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              {isTimerRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <h2 className="text-[26px] font-black italic text-slate-200 leading-none">
              מנוע המיקוד ממתין למשימה...
            </h2>
          </div>

          <div className="text-[52px] font-mono font-black opacity-85">
            {formatTime(timeLeft)}
          </div>
        </section>

        <section className="bg-white rounded-[2.8rem] p-8 shadow-sm border border-slate-200/60 min-h-[400px]">
          <div className="flex flex-col xl:flex-row justify-between gap-5 mb-8">
            <h2 className="text-[38px] font-black text-slate-800 text-right">
              מה כדאי לעשות עכשיו?
            </h2>

            <div className="flex items-center bg-slate-50 rounded-[2rem] border border-slate-200 p-2 gap-1">
              {['high', 'medium', 'low'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`px-5 py-2 rounded-xl text-[14px] font-black transition-all ${
                    energyLevel === lvl
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-200/60'
                  }`}
                >
                  {energyLabels[lvl]}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              {isAddingTask ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
            </button>
          </form>

          {statusMessage && (
            <div className="mb-5 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">
              {statusMessage}
            </div>
          )}

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="h-[160px] rounded-[2.2rem] border-2 border-dashed border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-slate-300 italic text-[22px] font-black gap-2">
                <Coffee size={32} className="opacity-30" />
                אין משימות לרמה הזו.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[1.7rem] border border-slate-200 bg-slate-50 px-6 py-5 flex items-center gap-4 hover:shadow-sm transition-all"
                >
                  <button type="button" onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 className="text-emerald-500" size={26} />
                    ) : (
                      <Circle className="text-slate-300" size={26} />
                    )}
                  </button>

                  <div
                    className={`flex-1 text-right font-black text-xl ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {task.text}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={processBrainDump}
              disabled={isProcessingDump || !brainDump.trim()}
              className={`px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center gap-2 transition-all ${
                isProcessingDump || !brainDump.trim()
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-indigo-100 shadow-sm'
              }`}
            >
              {isProcessingDump ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ListChecks size={18} />
              )}
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
            placeholder="תשפוך פה הכל... ואני אנסה להפוך את זה למשימות ברורות"
            className="w-full h-[180px] rounded-[2rem] bg-slate-50 border-none outline-none resize-none p-6 text-xl text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </section>
      </div>
    </div>
  );
}
