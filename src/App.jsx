import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Wallet,
  Calendar,
  Compass,
  GraduationCap,
  Briefcase,
  Zap,
  Loader2,
} from 'lucide-react';

import DashboardSection from './sections/DashboardSection';
import TasksSection from './sections/TasksSection';
import FinanceSection from './sections/FinanceSection';
import ScheduleSection from './sections/ScheduleSection';
import VisionSection from './sections/VisionSection';
import SkillsSection from './sections/SkillsSection';
import ToolsSection from './sections/ToolsSection';

const loadFromLocal = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocal = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const getFallbackDopamineMenu = (energyLevel) => {
  if (energyLevel === 'low') {
    return [
      { title: 'לשתות מים קרים', desc: 'לקום ולמזוג כוס מים עם הרבה קרח' },
      { title: 'שיר אהוב', desc: 'לשים באוזניות שיר שמרים אותך עכשיו' },
      { title: 'לפתוח חלון', desc: 'להכניס קצת אוויר ולתת לראש שנייה לנוח' },
    ];
  }

  if (energyLevel === 'high') {
    return [
      { title: '2 דקות קפיצות במקום', desc: 'להרים דופק מהר ולשבור קיפאון' },
      { title: 'מתיחת גוף קצרה', desc: 'לשחרר כתפיים, גב וצוואר' },
      { title: 'מיני ניצחון', desc: 'לסמן משימה קטנה שכבר סיימת היום' },
    ];
  }

  return [
    { title: 'קפה או תה קטן', desc: 'לעשות לעצמך הפסקה קצרה ומסודרת' },
    { title: 'סיבוב קצר בבית', desc: '2 דקות הליכה כדי לאפס את הראש' },
    { title: 'נשימה עמוקה', desc: 'שלוש נשימות איטיות ולחזור בעדינות' },
  ];
};

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  const [activeTab, setActiveTab] = useState(() =>
    loadFromLocal('lifeos_activeTab', 'dashboard')
  );
  const [energyLevel, setEnergyLevel] = useState(() =>
    loadFromLocal('lifeos_energyLevel', 'medium')
  );
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() =>
    loadFromLocal('lifeos_brainDump', '')
  );
  const [vision, setVision] = useState(() =>
    loadFromLocal(
      'lifeos_vision',
      'לבנות חיים מאוזנים שבהם היצירתיות שלי באה לידי ביטוי מדי יום.'
    )
  );
  const [transactions, setTransactions] = useState(() =>
    loadFromLocal('lifeos_transactions', [])
  );
  const [dopamineMenu, setDopamineMenu] = useState(() =>
    loadFromLocal('lifeos_dopamineMenu', null)
  );
  const [isDopamineLoading, setIsDopamineLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(() =>
    loadFromLocal('lifeos_timeLeft', 25 * 60)
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [focusTask, setFocusTask] = useState(() =>
    loadFromLocal('lifeos_focusTask', null)
  );
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(null);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  useEffect(() => {
    saveToLocal('lifeos_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveToLocal('lifeos_energyLevel', energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    saveToLocal('lifeos_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToLocal('lifeos_brainDump', brainDump);
  }, [brainDump]);

  useEffect(() => {
    saveToLocal('lifeos_vision', vision);
  }, [vision]);

  useEffect(() => {
    saveToLocal('lifeos_transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToLocal('lifeos_dopamineMenu', dopamineMenu);
  }, [dopamineMenu]);

  useEffect(() => {
    saveToLocal('lifeos_timeLeft', timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    saveToLocal('lifeos_focusTask', focusTask);
  }, [focusTask]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  const updateActiveTab = (value) => setActiveTab(value);
  const updateEnergyLevel = (value) => setEnergyLevel(value);
  const updateBrainDump = (value) => setBrainDump(value);
  const updateVision = (value) => setVision(value);

  const updateTasks = (action) => {
    setTasks((prev) => (typeof action === 'function' ? action(prev) : action));
  };

  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;

    const tempId = Date.now();
    const taskText = newTask.trim();

    updateTasks((prev) => [
      {
        id: tempId,
        text: taskText,
        completed: false,
        energyRequired: 'medium',
        emoji: '📝',
        subTasks: [],
      },
      ...prev,
    ]);

    setNewTask('');
  };

  const generateDopamineMenu = async () => {
    setIsDopamineLoading(true);

    try {
      const fallback = getFallbackDopamineMenu(energyLevel);

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate exactly 3 very quick dopamine boost ideas in Hebrew for a user with ${energyLevel} energy.
Return valid JSON only:
{"menu":[{"title":"short title","desc":"short description"}]}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data?.menu && Array.isArray(data.menu) && data.menu.length > 0) {
        setDopamineMenu(data.menu);
      } else {
        setDopamineMenu(fallback);
      }
    } catch {
      setDopamineMenu(getFallbackDopamineMenu(energyLevel));
    } finally {
      setIsDopamineLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' && !dopamineMenu && !isDopamineLoading) {
      generateDopamineMenu();
    }
  }, [activeTab]);

  const financeStats = useMemo(() => {
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      expenses,
      income,
      balance: income - expenses,
    };
  }, [transactions]);

  const breakdownTask = async (taskId, text) => {
    setIsBreakingDown(taskId);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `פרק את המשימה הבאה ל-3 עד 5 תתי-משימות קטנות וברורות בעברית.
החזר JSON בלבד בפורמט:
{"subTasks":[{"text":"..."},{"text":"..."}]}

משימה:
${text}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to break down task');
      }

      const data = await response.json();

      if (data?.subTasks && Array.isArray(data.subTasks)) {
        updateTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subTasks: data.subTasks.map((s, index) => ({
                    id: index,
                    text: s.text,
                    completed: false,
                  })),
                }
              : t
          )
        );
        return;
      }

      throw new Error('Bad response shape');
    } catch {
      updateTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subTasks: [
                  { id: 0, text: 'לפתוח את מה שצריך בשביל להתחיל', completed: false },
                  { id: 1, text: 'לעשות את הצעד הראשון הכי קטן', completed: false },
                  { id: 2, text: 'להמשיך עוד כמה דקות', completed: false },
                ],
              }
            : t
        )
      );
    } finally {
      setIsBreakingDown(null);
    }
  };

  const handleSelectTask = (task) => {
    setFocusTask(task);
    setIsFocusActive(false);
    setIsStrategyLoading(false);

    if (!task.subTasks || task.subTasks.length === 0) {
      breakdownTask(task.id, task.text);
    }
  };

  const startPrepare = (task) => {
    setFocusTask(task);
    setIsFocusActive(true);
    setActiveTab('dashboard');
  };

  const openHelper = () => {
    alert('כאן בהמשך נחבר את עוזר ההתחלה.');
  };

  if (!isAppReady) {
    return (
      <div
        className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4"
        dir="rtl"
      >
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-indigo-900 font-black tracking-widest uppercase text-sm animate-pulse">
          טוען...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 pb-32"
      dir="rtl"
    >
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-black italic tracking-tight">
            LifeOS <span className="text-indigo-600 font-bold not-italic">AI Pro</span>
          </h1>
        </div>

        <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-500 hidden sm:block">
          {currentTime.toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {activeTab === 'dashboard' && (
          <DashboardSection
            energyLevel={energyLevel}
            setEnergyLevel={updateEnergyLevel}
            tasks={tasks}
            setTasks={updateTasks}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            brainDump={brainDump}
            setBrainDump={updateBrainDump}
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            dopamineMenu={dopamineMenu}
            isDopamineLoading={isDopamineLoading}
            generateDopamineMenu={generateDopamineMenu}
            expenses={financeStats.expenses}
            balance={financeStats.balance}
            currentTime={currentTime}
            focusTask={focusTask}
            isFocusActive={isFocusActive}
            isStrategyLoading={isStrategyLoading}
            isBreakingDown={isBreakingDown}
            setIsFocusActive={setIsFocusActive}
            startPrepare={startPrepare}
            openHelper={openHelper}
            handleSelectTask={handleSelectTask}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksSection
            tasks={tasks}
            setTasks={updateTasks}
            energyLevel={energyLevel}
            setEnergyLevel={updateEnergyLevel}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            focusTask={focusTask}
            handleSelectTask={handleSelectTask}
            isFocusActive={isFocusActive}
            isStrategyLoading={isStrategyLoading}
            isBreakingDown={isBreakingDown}
            startPrepare={startPrepare}
            openHelper={openHelper}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceSection
            transactions={transactions}
            setTransactions={setTransactions}
            balance={financeStats.balance}
            expenses={financeStats.expenses}
            income={financeStats.income}
          />
        )}

        {activeTab === 'schedule' && <ScheduleSection />}
        {activeTab === 'vision' && (
          <VisionSection vision={vision} setVision={updateVision} />
        )}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'tools' && <ToolsSection />}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around gap-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
            { id: 'tasks', icon: ListTodo, label: 'משימות' },
            { id: 'finance', icon: Wallet, label: 'כסף' },
            { id: 'schedule', icon: Calendar, label: 'לו"ז' },
            { id: 'vision', icon: Compass, label: 'חזון' },
            { id: 'skills', icon: GraduationCap, label: 'ספר' },
            { id: 'tools', icon: Briefcase, label: 'כלים' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg scale-105 font-bold'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <item.icon
                size={22}
                className={activeTab === item.id ? 'animate-pulse' : ''}
              />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
