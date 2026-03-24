import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignLeft,
  ArrowRight,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronUp,
  Circle,
  Coffee,
  Compass,
  Dices,
  Download,
  Dumbbell,
  Flame,
  Gamepad2,
  GlassWater,
  GraduationCap,
  Headphones,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Lightbulb,
  ListTodo,
  Loader2,
  MapPin,
  MessageCircle,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Send,
  Shield,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  Upload,
  Wallet,
  Wind,
  X,
  Zap,
} from 'lucide-react';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loadFromLocal = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveLocal = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
  { id: 'tasks', icon: ListTodo, label: 'משימות' },
  { id: 'finance', icon: Wallet, label: 'כסף' },
  { id: 'schedule', icon: Calendar, label: 'לו"ז' },
  { id: 'vision', icon: Compass, label: 'חזון' },
  { id: 'skills', icon: GraduationCap, label: 'ספר' },
  { id: 'tools', icon: Briefcase, label: 'כלים' },
];

const defaultChores = [
  { id: 1, text: 'לשטוף כלים', completed: false },
  { id: 2, text: 'לקפל כביסה', completed: false },
  { id: 3, text: 'לסדר שולחן', completed: true },
];

const scheduleItems = [
  { id: 1, time: '08:00', activity: 'שגרת בוקר', icon: Sun, duration: '60 min' },
  { id: 2, time: '09:00', activity: 'עבודה ממוקדת', icon: Zap, duration: '180 min' },
  { id: 3, time: '12:00', activity: 'ארוחת צהריים', icon: Coffee, duration: '60 min' },
  { id: 4, time: '14:00', activity: 'פגישת צוות', icon: MessageCircle, duration: '90 min' },
  { id: 5, time: '16:00', activity: 'זמן יצירה', icon: Star, duration: '120 min' },
  { id: 6, time: '19:00', activity: 'אימון ערב', icon: Dumbbell, duration: '45 min' },
  { id: 7, time: '22:00', activity: 'הכנה לשינה', icon: Moon, duration: '45 min' },
];

const habitStacks = [
  {
    id: 'morning',
    name: 'שגרת בוקר',
    icon: Sun,
    steps: [
      { text: 'שתיית כוס מים', icon: 'GlassWater' },
      { text: "מתיחות קלות (2 דק')", icon: 'Dumbbell' },
      { text: 'בדיקת לו"ז יומי', icon: 'Calendar' },
      { text: 'נשימה עמוקה וכניסה ליום', icon: 'Wind' },
    ],
  },
  {
    id: 'sleep',
    name: 'הכנה לשינה',
    icon: Moon,
    steps: [
      { text: 'ארגון השולחן למחר', icon: 'LayoutDashboard' },
      { text: 'כיבוי מסכים כחולים', icon: 'Sparkles' },
      { text: 'הכנת בגדים למחר', icon: 'CheckCircle2' },
      { text: 'קריאה של 5 דקות', icon: 'BookOpen' },
    ],
  },
];

const goals = [
  { id: 1, text: 'לסיים קורס פיתוח אפליקציות', progress: 65, category: 'קריירה' },
  { id: 2, text: 'להתמיד ביוגה 3 פעמים בשבוע', progress: 40, category: 'בריאות' },
];

const skills = [
  { id: 1, name: 'בישול בריא', level: 3, xp: 45, icon: Coffee },
  { id: 2, name: 'תכנות React', level: 5, xp: 80, icon: Sparkles },
  { id: 3, name: 'ויסות רגשי', level: 2, xp: 20, icon: Wind },
];

export default function App() {
  const apiKey = '';
  const timerRef = useRef(null);
  const helperOfferRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState(() => loadFromLocal('lifeos_energyLevel', 'medium'));
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [vision, setVision] = useState(() => loadFromLocal('lifeos_vision', 'לבנות חיים מאוזנים שבהם היצירתיות שלי באה לידי ביטוי מדי יום.'));
  const [transactions, setTransactions] = useState(() => loadFromLocal('lifeos_transactions', []));
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: 'general' });
  const [houseChores, setHouseChores] = useState(() => loadFromLocal('lifeos_houseChores', defaultChores));
  const [newChore, setNewChore] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [dopamineMenu, setDopamineMenu] = useState(() => loadFromLocal('lifeos_dopamineMenu', null));
  const [isDopamineLoading, setIsDopamineLoading] = useState(false);

  const [timerMode, setTimerMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [activeHabitStack, setActiveHabitStack] = useState(null);
  const [prepSteps, setPrepSteps] = useState([]);
  const [currentPrepStep, setCurrentPrepStep] = useState(0);
  const [transitionSteps, setTransitionSteps] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(null);
  const [isStrategyLoading, setIsStrategyLoading] = useState(null);
  const [taskStrategy, setTaskStrategy] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [hyperfocusInput, setHyperfocusInput] = useState('');

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [sosChecks, setSosChecks] = useState([]);
  const [isSosLoading, setIsSosLoading] = useState(false);

  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [helperChat, setHelperChat] = useState([]);
  const [helperInput, setHelperInput] = useState('');
  const [isHelperAILoading, setIsHelperAILoading] = useState(false);
  const [hasHelperBeenOffered, setHasHelperBeenOffered] = useState(false);

  const [commToolMode, setCommToolMode] = useState('draft');
  const [commInput, setCommInput] = useState('');
  const [commResult, setCommResult] = useState('');
  const [isCommLoading, setIsCommLoading] = useState(false);

  const [isIslandLoading, setIsIslandLoading] = useState(false);
  const [islandState, setIslandState] = useState({ active: false, area: '', timeLeft: 5 * 60, isRunning: false, completed: false });

  const callGemini = async (prompt, systemInstruction, responseMimeType = 'text/plain') => {
    if (!apiKey) {
      throw new Error('Missing API key');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Auth error', error);
        setIsDataLoaded(true);
      }
    };

    initAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, 'lifeos_state', 'main');

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.tasks) {
            setTasks(data.tasks);
            saveLocal('lifeos_tasks', data.tasks);
          }
          if (data.transactions) {
            setTransactions(data.transactions);
            saveLocal('lifeos_transactions', data.transactions);
          }
          if (data.houseChores) {
            setHouseChores(data.houseChores);
            saveLocal('lifeos_houseChores', data.houseChores);
          }
          if (data.brainDump !== undefined) {
            setBrainDump(data.brainDump);
            saveLocal('lifeos_brainDump', data.brainDump);
          }
          if (data.vision) {
            setVision(data.vision);
            saveLocal('lifeos_vision', data.vision);
          }
          if (data.energyLevel) {
            setEnergyLevel(data.energyLevel);
            saveLocal('lifeos_energyLevel', data.energyLevel);
          }
          if (data.activeTab) {
            setActiveTab(data.activeTab);
            saveLocal('lifeos_activeTab', data.activeTab);
          }
        }
        setIsDataLoaded(true);
      },
      () => setIsDataLoaded(true)
    );

    return () => unsub();
  }, [user]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard' && !dopamineMenu && !isDopamineLoading) {
      generateDopamineMenu();
    }
  }, [activeTab, energyLevel]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
      handleTimerEnd();
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft, timerMode]);

  useEffect(() => {
    if (focusTask && !isFocusActive && !hasHelperBeenOffered && timerMode !== 'hyperfocus') {
      helperOfferRef.current = setTimeout(() => {
        if (!isFocusActive && !hasHelperBeenOffered) openHelper();
      }, 20000);
    } else if (helperOfferRef.current) {
      clearTimeout(helperOfferRef.current);
    }

    return () => {
      if (helperOfferRef.current) clearTimeout(helperOfferRef.current);
    };
  }, [focusTask, isFocusActive, hasHelperBeenOffered, timerMode]);

  useEffect(() => {
    let interval = null;
    if (islandState.isRunning && islandState.timeLeft > 0) {
      interval = setInterval(() => {
        setIslandState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (islandState.isRunning && islandState.timeLeft === 0) {
      setIslandState((prev) => ({ ...prev, isRunning: false, completed: true }));
    }
    return () => clearInterval(interval);
  }, [islandState.isRunning, islandState.timeLeft]);

  const saveToCloud = (payload) => {
    if (!user || !isDataLoaded) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'lifeos_state', 'main'), payload, { merge: true }).catch(console.error);
  };

  const updateTasks = (updater) => {
    setTasks((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveLocal('lifeos_tasks', next);
      saveToCloud({ tasks: next });
      return next;
    });
  };

  const updateHouseChores = (updater) => {
    setHouseChores((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveLocal('lifeos_houseChores', next);
      saveToCloud({ houseChores: next });
      return next;
    });
  };

  const updateActiveTab = (next) => {
    setActiveTab(next);
    saveLocal('lifeos_activeTab', next);
    saveToCloud({ activeTab: next });
  };

  const updateEnergyLevel = (next) => {
    setEnergyLevel(next);
    saveLocal('lifeos_energyLevel', next);
    saveToCloud({ energyLevel: next });
    setDopamineMenu(null);
  };

  const updateBrainDump = (next) => {
    setBrainDump(next);
    saveLocal('lifeos_brainDump', next);
    saveToCloud({ brainDump: next });
  };

  const updateVision = (next) => {
    setVision(next);
    saveLocal('lifeos_vision', next);
    saveToCloud({ vision: next });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeScheduleItem = useMemo(() => {
    const nowStr = currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false });
    return scheduleItems.filter((item) => item.time <= nowStr).pop() || null;
  }, [currentTime]);

  const getPrepIcon = (item) => {
    const icons = {
      Headphones,
      Droplets,
      Smartphone,
      Wind,
      Coffee,
      Lightbulb,
      Sparkles,
      GlassWater,
      Dumbbell,
      Moon,
      Sun,
      Calendar,
      LayoutDashboard,
      BookOpen,
      CheckCircle2,
      Zap,
    };
    const IconComp = icons[item?.icon] || Sparkles;
    return <IconComp size={18} />;
  };

  const generateDopamineMenu = async () => {
    setIsDopamineLoading(true);
    try {
      const res = await callGemini(
        `Energy level: ${energyLevel}`,
        `You are an AuDHD life coach. Generate exactly 3 very quick, easy, low-friction dopamine-boosting activities tailored for someone who currently has '${energyLevel}' energy. Respond ONLY in Hebrew and ONLY in valid JSON format: {"menu":[{"title":"short title","desc":"short description"}]}.`,
        'application/json'
      );
      const data = JSON.parse(res || '{}');
      const menu = data?.menu?.length
        ? data.menu
        : [
            { title: 'לשתות מים קרים', desc: 'לקום ולמזוג כוס מים' },
            { title: 'שיר אהוב', desc: 'לשים שיר אחד שמרים אותך' },
            { title: 'אוויר קטן', desc: 'לפתוח חלון ולקחת נשימה' },
          ];
      setDopamineMenu(menu);
      saveLocal('lifeos_dopamineMenu', menu);
    } catch {
      const fallback = [
        { title: 'לשתות מים קרים', desc: 'לקום ולמזוג כוס מים' },
        { title: 'שיר אהוב', desc: 'לשים שיר אחד שמרים אותך' },
        { title: 'אוויר קטן', desc: 'לפתוח חלון ולקחת נשימה' },
      ];
      setDopamineMenu(fallback);
      saveLocal('lifeos_dopamineMenu', fallback);
    } finally {
      setIsDopamineLoading(false);
    }
  };

  const breakdownTask = async (taskId, text) => {
    setIsBreakingDown(taskId);
    try {
      const res = await callGemini(
        `Break: ${text}`,
        'You are a task management expert for ADHD. Break the task into 3-5 clear, small steps. Respond ONLY in Hebrew and ONLY in JSON format: {"subTasks":[{"text":"string"}]}',
        'application/json'
      );
      const data = JSON.parse(res || '{}');
      if (data.subTasks?.length) {
        updateTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: data.subTasks.map((subTask, index) => ({ id: index, text: subTask.text, completed: false })),
                }
              : task
          )
        );
        return;
      }
      throw new Error('No subtasks');
    } catch {
      updateTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subTasks: [
                  { id: 0, text: 'לפתוח את מה שצריך', completed: false },
                  { id: 1, text: 'לעשות צעד ראשון קטן', completed: false },
                  { id: 2, text: 'להמשיך רק עוד 5 דקות', completed: false },
                ],
              }
            : task
        )
      );
    } finally {
      setIsBreakingDown(null);
    }
  };

  const getTaskStrategy = async (task) => {
    setIsStrategyLoading(task.id);
    try {
      const res = await callGemini(`Strategy: ${task.text}`, 'Focus strategy. Hebrew. 1 sentence.');
      setTaskStrategy({ taskId: task.id, message: res || 'נתחיל בצעד הכי קטן שיש.' });
    } catch {
      setTaskStrategy({ taskId: task.id, message: 'נתחיל בצעד הכי קטן שיש.' });
    } finally {
      setIsStrategyLoading(null);
    }
  };

  const generateAIChecklist = async (text) => {
    setIsAILoading(true);
    try {
      const res = await callGemini(
        `Steps for: ${text}`,
        'You are a productivity expert for people with AuDHD. Generate 4 practical preparation steps. Respond ONLY in Hebrew and ONLY in JSON format: {"steps":[{"text":"string","icon":"string"}]}.',
        'application/json'
      );
      const data = JSON.parse(res || '{}');
      if (data.steps?.length) {
        setPrepSteps(data.steps.map((step, index) => ({ ...step, id: index, done: false })));
      } else {
        throw new Error('No steps');
      }
    } catch {
      setPrepSteps([
        { id: 0, text: 'לפתוח את מה שצריך', icon: 'Sparkles', done: false },
        { id: 1, text: 'לסדר את האזור מולך', icon: 'LayoutDashboard', done: false },
        { id: 2, text: 'לשתות קצת מים', icon: 'Droplets', done: false },
        { id: 3, text: 'להתחיל רק ל-5 דקות', icon: 'Zap', done: false },
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  const openHelper = async () => {
    setIsHelperOpen(true);
    setHasHelperBeenOffered(true);
    if (helperChat.length > 0) return;
    setIsHelperAILoading(true);
    try {
      const res = await callGemini('Start', `You are an AuDHD Productivity Coach. The user selected the task "${focusTask?.text || ''}" but hasn't started yet. Ask what's hard in Hebrew. Short.`);
      setHelperChat([{ role: 'ai', text: res || 'מה הכי תקוע כרגע?' }]);
    } catch {
      setHelperChat([{ role: 'ai', text: 'היי, מה עוצר אותך כרגע במשימה הזו?' }]);
    } finally {
      setIsHelperAILoading(false);
    }
  };

  const sendHelperMessage = async () => {
    if (!helperInput.trim() || isHelperAILoading) return;
    const userMsg = helperInput;
    setHelperInput('');
    setHelperChat((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsHelperAILoading(true);
    try {
      const res = await callGemini(`User: ${userMsg}`, `AuDHD Coach. Help start "${focusTask?.text || ''}". Suggest a tiny sensory-friendly first step. Hebrew only.`);
      setHelperChat((prev) => [...prev, { role: 'ai', text: res || 'רק לפתוח את מה שצריך ולהתחיל בדקה אחת.' }]);
    } catch {
      setHelperChat((prev) => [...prev, { role: 'ai', text: 'רק לפתוח את מה שצריך ולהתחיל בדקה אחת.' }]);
    } finally {
      setIsHelperAILoading(false);
    }
  };

  const handleTimerEnd = () => {
    setIsTimerMinimized(false);
    updateActiveTab('dashboard');

    if (timerMode === 'work' || timerMode === 'hyperfocus') {
      setTimerMode('transition');
      setTimeLeft(5 * 60);
      setTransitionSteps(['קחי נשימה עמוקה והרפי כתפיים', 'שמרי איפה עצרת כדי לחזור בקלות']);
      setIsTimerRunning(true);
    } else if (timerMode === 'transition') {
      setTimerMode('break');
      setTimeLeft(5 * 60);
      setIsTimerRunning(true);
    } else {
      setTimerMode('work');
      setTimeLeft(25 * 60);
      setIsTimerRunning(false);
    }
  };

  const handleSelectTask = (task, skipStrategy = false) => {
    setFocusTask(task);
    setIsFocusActive(false);
    setIsTimerMinimized(false);
    setHasHelperBeenOffered(false);
    setActiveHabitStack(null);
    setTimerMode('work');
    setPrepSteps([]);
    setIsTimerRunning(false);
    setCurrentPrepStep(0);
    setHelperChat([]);
    if (!skipStrategy) getTaskStrategy(task);
    if (!task.subTasks || task.subTasks.length === 0) breakdownTask(task.id, task.text);
  };

  const startPrepare = (task) => {
    if (!task) return;
    updateActiveTab('dashboard');
    setTimerMode('prepare');
    setTimeLeft(5 * 60);
    setIsTimerRunning(true);
    setIsFocusActive(true);
    generateAIChecklist(task.text);
  };

  const startHabitStack = (stack) => {
    setFocusTask(null);
    setActiveHabitStack(stack);
    setIsFocusActive(true);
    setTimerMode('prepare');
    setTimeLeft(10 * 60);
    setCurrentPrepStep(0);
    setPrepSteps(stack.steps.map((step, index) => ({ ...step, id: index, done: false })));
    setIsTimerRunning(true);
    updateActiveTab('dashboard');
  };

  const startWorkMode = () => {
    setTimerMode('work');
    setTimeLeft(25 * 60);
    setIsTimerRunning(true);
    setIsTimerMinimized(true);
  };

  const startHyperfocus = () => {
    if (!hyperfocusInput.trim()) return;
    setFocusTask({ text: hyperfocusInput, emoji: '⚡' });
    setActiveHabitStack(null);
    setIsFocusActive(true);
    setTimerMode('hyperfocus');
    setTimeLeft(45 * 60);
    setIsTimerRunning(true);
    setHyperfocusInput('');
    updateActiveTab('dashboard');
  };

  const completeStep = (index) => {
    setPrepSteps((prev) => prev.map((step, i) => (i === index ? { ...step, done: true } : step)));
    if (index < prepSteps.length - 1) setCurrentPrepStep(index + 1);
  };

  const allPrepDone = prepSteps.length > 0 && prepSteps.every((step) => step.done);

  const addTask = async (e) => {
    e?.preventDefault();
    if (!newTask.trim()) return;

    const tempId = Date.now();
    const taskContent = newTask.trim();
    const optimisticTask = {
      id: tempId,
      text: taskContent,
      completed: false,
      energyRequired: 'medium',
      subTasks: [],
      emoji: '📝',
    };

    updateTasks((prev) => [optimisticTask, ...prev]);
    setNewTask('');
  };

  const handleTaskRewrite = async (taskId, text) => {
    setIsAILoading(true);
    try {
      const res = await callGemini(`Tiny: ${text}`, 'Rewrite tiny. Hebrew. 1 sentence.');
      updateTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, text: res || text } : task)));
    } catch {
      updateTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, text: `צעד קטן: ${text}` } : task)));
    } finally {
      setIsAILoading(false);
    }
  };

  const toggleSubTask = (taskId, subTaskId) => {
    updateTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask
              ),
            }
          : task
      )
    );
  };

  const processBrainDump = () => {
    if (!brainDump.trim()) return;
    const lines = brainDump
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((line, index) => ({
        id: Date.now() + index,
        text: line,
        completed: false,
        energyRequired: 'medium',
        subTasks: [],
        emoji: '📝',
      }));

    updateTasks((prev) => [...lines, ...prev]);
    updateBrainDump('');
  };

  const handleSmartRoulette = () => {
    setIsSorting(true);
    const available = tasks.filter((task) => !task.completed && task.energyRequired === energyLevel);
    if (!available.length) {
      setIsSorting(false);
      alert('אין משימות ברמת האנרגיה הזו כדי להגריל.');
      return;
    }
    const chosen = available[Math.floor(Math.random() * available.length)];
    handleSelectTask(chosen, true);
    setTaskStrategy({ taskId: chosen.id, message: '🎲 נבחרה לך משימה להתחלה פשוטה.' });
    setTimeout(() => setIsSorting(false), 300);
  };

  const handleSmartReorder = () => {
    setIsSorting(true);
    const order = { low: 0, medium: 1, high: 2, analyzing: 3 };
    updateTasks((prev) => [...prev].sort((a, b) => (order[a.energyRequired] ?? 9) - (order[b.energyRequired] ?? 9)));
    setTimeout(() => setIsSorting(false), 300);
  };

  const addChore = (e) => {
    e?.preventDefault();
    if (!newChore.trim()) return;
    updateHouseChores((prev) => [{ id: Date.now(), text: newChore.trim(), completed: false }, ...prev]);
    setNewChore('');
  };

  const toggleChore = (id) => {
    updateHouseChores((prev) => prev.map((chore) => (chore.id === id ? { ...chore, completed: !chore.completed } : chore)));
  };

  const deleteChore = (id) => {
    updateHouseChores((prev) => prev.filter((chore) => chore.id !== id));
  };

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    const entry = { ...newTransaction, id: Date.now(), amount: parseFloat(newTransaction.amount), date: new Date().toISOString() };
    const next = [entry, ...transactions];
    setTransactions(next);
    saveLocal('lifeos_transactions', next);
    saveToCloud({ transactions: next });
    setNewTransaction({ description: '', amount: '', type: 'expense', category: 'general' });
  };

  const deleteTransaction = (id) => {
    const next = transactions.filter((item) => item.id !== id);
    setTransactions(next);
    saveLocal('lifeos_transactions', next);
    saveToCloud({ transactions: next });
  };

  const exportData = () => {
    const data = {
      tasks,
      transactions,
      houseChores,
      brainDump,
      vision,
      energyLevel,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LifeOS_Backup_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.tasks) updateTasks(data.tasks);
        if (data.transactions) {
          setTransactions(data.transactions);
          saveLocal('lifeos_transactions', data.transactions);
          saveToCloud({ transactions: data.transactions });
        }
        if (data.houseChores) updateHouseChores(data.houseChores);
        if (data.brainDump !== undefined) updateBrainDump(data.brainDump);
        if (data.vision) updateVision(data.vision);
        if (data.energyLevel) updateEnergyLevel(data.energyLevel);
        event.target.value = '';
      } catch (error) {
        console.error('Import failed', error);
      }
    };
    reader.readAsText(file);
  };

  const openSOS = async () => {
    setIsSosOpen(true);
    if (sosChecks.length) return;
    setIsSosLoading(true);
    try {
      const res = await callGemini(
        'I feel bad/overwhelmed.',
        'Generate 4 basic physical/interoception checks. Respond in Hebrew JSON: {"checks":[{"text":"","icon":""}]}.',
        'application/json'
      );
      const data = JSON.parse(res || '{}');
      setSosChecks(
        data.checks?.length
          ? data.checks
          : [
              { text: 'מתי שתית מים לאחרונה?', icon: 'Droplets' },
              { text: 'קר או חם לך מדי עכשיו?', icon: 'Wind' },
              { text: 'יש רעש שמציק לך ברקע?', icon: 'Headphones' },
            ]
      );
    } catch {
      setSosChecks([
        { text: 'מתי שתית מים לאחרונה?', icon: 'Droplets' },
        { text: 'קר או חם לך מדי עכשיו?', icon: 'Wind' },
        { text: 'יש רעש שמציק לך ברקע?', icon: 'Headphones' },
      ]);
    } finally {
      setIsSosLoading(false);
    }
  };

  const startIslandOfOrder = async () => {
    setIsIslandLoading(true);
    try {
      const res = await callGemini('Suggest a tiny island of order.', 'Suggest 1 tiny specific physical area in Hebrew.');
      setIslandState({ active: true, area: res || 'רק השולחן בדיוק מולך', timeLeft: 5 * 60, isRunning: true, completed: false });
    } catch {
      setIslandState({ active: true, area: 'רק השולחן בדיוק מולך', timeLeft: 5 * 60, isRunning: true, completed: false });
    } finally {
      setIsIslandLoading(false);
    }
  };

  const handleCommTool = async () => {
    if (!commInput.trim()) return;
    setIsCommLoading(true);
    try {
      if (commToolMode === 'draft') {
        const res = await callGemini(`Raw thought: ${commInput}`, 'Rewrite as a polite short Hebrew message.');
        setCommResult(res || commInput);
      } else {
        setCommResult(`עובדות: ${commInput}`);
      }
    } catch {
      setCommResult('לא הצלחתי כרגע לעבד את זה, נסי שוב.');
    } finally {
      setIsCommLoading(false);
    }
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4" dir="rtl">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-indigo-900 font-black tracking-widest uppercase text-sm animate-pulse">פותח את הכספת הקבועה שלך...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 pb-32" dir="rtl">
      {isSosOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-rose-50 w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden border border-rose-200">
            <header className="bg-rose-500 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20 -translate-y-4 translate-x-4"><LifeBuoy size={100} /></div>
              <h3 className="relative z-10 text-2xl font-black italic tracking-wide">למה רע לי?</h3>
              <button onClick={() => setIsSosOpen(false)} className="relative z-10 p-2 hover:bg-white/20 rounded-xl transition-colors"><X size={24} /></button>
            </header>
            <div className="p-8 space-y-6">
              {isSosLoading ? (
                <div className="flex flex-col items-center py-8 opacity-60">
                  <Loader2 className="animate-spin text-rose-400 mb-4" size={32} />
                  <span className="font-bold text-rose-500">סורק צרכים פיזיים...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-rose-800/60 mb-4 text-center">הגוף שלך כנראה מנסה לאותת משהו. בואי נבדוק:</p>
                  {sosChecks.map((check, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4 text-rose-900 font-bold text-sm">
                      <div className="p-2 bg-rose-100 rounded-xl text-rose-500">{getPrepIcon(check)}</div>
                      {check.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isHelperOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <header className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><MessageCircle size={22} /></div>
                <div>
                  <h3 className="font-black italic">עוזר AI להתנעה</h3>
                  <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">AuDHD Task Initiation</p>
                </div>
              </div>
              <button onClick={() => setIsHelperOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {helperChat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm ${msg.role === 'ai' ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' : 'bg-indigo-600 text-white rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isHelperAILoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white p-4 rounded-3xl rounded-tr-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-indigo-400" size={14} />
                    <span className="text-xs text-slate-400 font-bold italic">ה-AI חושב...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
              <input
                value={helperInput}
                onChange={(e) => setHelperInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendHelperMessage()}
                placeholder="מה הקושי שלך כרגע?"
                className="flex-1 bg-slate-50 px-6 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
              />
              <button onClick={sendHelperMessage} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Zap className="text-white" size={22} /></div>
          <h1 className="text-xl font-black italic tracking-tight">LifeOS <span className="text-indigo-600 font-bold not-italic">AI Pro</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openSOS} className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-all shadow-sm active:scale-90 flex items-center gap-2">
            <LifeBuoy size={18} />
            <span className="text-[10px] font-black uppercase hidden md:inline">הצלה</span>
          </button>
          <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-500 hidden sm:block">
            {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className={`text-white shadow-2xl relative overflow-hidden transition-all duration-700 ease-in-out ${timerMode === 'hyperfocus' ? 'bg-fuchsia-900' : timerMode === 'transition' ? 'bg-indigo-400' : 'bg-slate-900'} ${((isFocusActive || activeHabitStack) && !isTimerMinimized) ? 'p-6 rounded-[3rem] opacity-100 min-h-[350px]' : 'p-4 rounded-2xl opacity-80 h-20'}`}>
                <div className={`absolute inset-0 bg-white/5 pointer-events-none transition-opacity duration-1000 ${isTimerRunning && !isTimerMinimized ? 'opacity-20' : 'opacity-0'}`} />

                {(!(isFocusActive || activeHabitStack) || isTimerMinimized) ? (
                  <div className="relative z-10 flex items-center justify-between h-full px-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg animate-pulse ${timerMode === 'hyperfocus' ? 'bg-fuchsia-600' : 'bg-indigo-600'}`}>
                        {timerMode === 'hyperfocus' ? <Gamepad2 className="text-white" size={16} /> : <Target className="text-white" size={16} />}
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-widest opacity-60 italic">
                        {isTimerMinimized ? (timerMode === 'hyperfocus' ? 'בצלילה עמוקה' : `בעבודה: ${focusTask?.text || activeHabitStack?.name || 'משימה'}`) : focusTask ? `נבחרה משימה: ${focusTask.text}` : 'מנוע המיקוד ממתין למשימה...'}
                      </h2>
                    </div>

                    {focusTask && !isStrategyLoading && isBreakingDown !== focusTask.id && !isFocusActive && !activeHabitStack && timerMode !== 'hyperfocus' && (
                      <button onClick={() => startPrepare(focusTask)} className="bg-indigo-600 hover:bg-indigo-50 text-white hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-colors">
                        <Zap size={14} fill="currentColor" /> התחל סשן מיקוד
                      </button>
                    )}

                    {isTimerMinimized && (
                      <button onClick={() => setIsTimerMinimized(false)} className="text-white/60 hover:text-white text-[10px] uppercase font-black tracking-widest bg-white/10 px-4 py-2 rounded-xl transition-colors">
                        הרחב חזרה למעלה
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        {timerMode === 'prepare' && !activeHabitStack && <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse"><Sparkles size={12} /> הכנת AI</span>}
                        {activeHabitStack && <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse"><BookOpen size={12} /> שגרה פעילה</span>}
                        {timerMode === 'work' && <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2"><Zap size={12} /> עבודה עמוקה</span>}
                        {timerMode === 'hyperfocus' && <span className="bg-fuchsia-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2"><Gamepad2 size={12} /> היפר-פוקוס פעיל</span>}
                        {timerMode === 'transition' && <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 animate-pulse"><Wind size={12} /> נחיתה רכה</span>}
                        {timerMode === 'break' && <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2"><Coffee size={12} /> הפסקה</span>}
                        <button onClick={() => { setFocusTask(null); setIsFocusActive(false); setActiveHabitStack(null); setIsTimerRunning(false); setTimerMode('work'); setIsTimerMinimized(false); }} className="text-[10px] text-white/40 hover:text-white transition-colors underline mr-2">
                          ביטול טיימר
                        </button>
                      </div>
                      <div className="text-xl font-mono font-black text-white/80 tabular-nums bg-white/10 px-4 py-1 rounded-xl">{formatTime(timeLeft)}</div>
                    </div>

                    {(timerMode === 'prepare' || activeHabitStack) ? (
                      <div className="space-y-4 flex-1">
                        <div>
                          <h2 className="text-xl font-black italic">{activeHabitStack ? activeHabitStack.name : 'מכינים את המרחב...'}</h2>
                          <p className="text-white/60 text-[10px] truncate">{activeHabitStack ? 'מבצעים את שלבי השגרה' : `הכנה למיקוד ב: ${focusTask?.text || ''}`}</p>
                        </div>
                        {isAILoading ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white/5 rounded-3xl border border-white/10">
                            <Loader2 className="animate-spin text-white/50" size={32} />
                            <p className="text-xs font-bold text-white/70 animate-pulse uppercase tracking-widest">בונה תוכנית הכנה...</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {prepSteps.map((step, index) => {
                              const isCurrent = index === currentPrepStep;
                              const isPast = index < currentPrepStep;
                              return (
                                <button key={index} disabled={!isCurrent && !isPast} onClick={() => isCurrent && completeStep(index)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border-2 text-right ${isCurrent ? 'bg-white/20 border-white/40 shadow-xl scale-[1.02]' : isPast ? 'bg-emerald-500/20 border-emerald-500/30 opacity-50' : 'bg-white/5 border-transparent opacity-30'}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-emerald-500' : isCurrent ? 'bg-white/20 text-white' : 'bg-white/10'}`}>
                                    {isPast ? <Check size={16} strokeWidth={3} /> : getPrepIcon(step)}
                                  </div>
                                  <p className={`font-bold text-xs flex-1 ${isCurrent ? 'text-white' : 'text-white/60'}`}>{index + 1}. {step.text}</p>
                                  {isCurrent && <ChevronLeft className="text-white/80 animate-pulse" size={16} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {allPrepDone && (
                          <button onClick={startWorkMode} className="w-full bg-white text-indigo-900 py-3 rounded-2xl font-black text-lg shadow-xl animate-bounce mt-4">
                            {activeHabitStack ? 'סיימתי את השגרה, מתחילים!' : 'אני מוכנה, בואו נתחיל!'}
                          </button>
                        )}
                      </div>
                    ) : timerMode === 'transition' ? (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <Wind size={48} className="text-white/40 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-black italic mb-2">זמן לסיים ברוגע</h2>
                        <p className="text-sm font-medium text-white/80 mb-8 text-center max-w-sm">הפוקוס נגמר. בואי לא נקטע את זה בחדות, הנה מה שעושים עכשיו:</p>
                        <div className="space-y-3 w-full max-w-md">
                          {transitionSteps.map((step, i) => (
                            <div key={i} className="p-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3">
                              <Circle size={16} className="text-white/50" />
                              <span className="font-bold text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                        <h2 className="text-[60px] font-mono font-black tracking-tighter mt-6 opacity-80">{formatTime(timeLeft)}</h2>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="text-center mb-2">
                          <h2 className="text-2xl font-black text-white leading-tight truncate px-4">
                            <span className="ml-2 inline-block align-middle">{focusTask?.emoji}</span>
                            {focusTask?.text || activeHabitStack?.name}
                          </h2>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                          <h2 className="text-[100px] font-mono font-black tracking-tighter tabular-nums leading-none drop-shadow-2xl">{formatTime(timeLeft)}</h2>
                        </div>
                        {timerMode === 'work' && isTimerRunning && (
                          <div className="mb-8 flex justify-center">
                            <button onClick={openHelper} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg active:scale-95 group">
                              <MessageCircle size={18} className="text-indigo-300 group-hover:scale-110 transition-transform" />
                              נתקעתי, אפשר עזרה?
                            </button>
                          </div>
                        )}
                        <div className="flex justify-center gap-4 mt-auto pb-2">
                          <button onClick={() => setIsTimerRunning((prev) => !prev)} className={`px-8 py-3 rounded-[2rem] font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all ${isTimerRunning ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500 text-emerald-950'}`}>
                            {isTimerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />} {isTimerRunning ? 'השהה' : 'המשך'}
                          </button>
                          <button onClick={() => setIsTimerMinimized(true)} className="px-6 py-3 rounded-[2rem] bg-white/10 hover:bg-white/20 font-black text-sm transition-colors border border-white/20 flex items-center gap-2">
                            <ChevronUp size={18} /> מזער
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800"><ListTodo size={24} className="text-indigo-600" /> מה כדאי לעשות עכשיו?</h3>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-3xl">
                    <div className="flex flex-col gap-1 pr-1 pl-2"><span className="text-[11px] font-bold text-slate-500 leading-none">כמה אנרגיה יש לי עכשיו?</span></div>
                    <div className="flex gap-1 bg-slate-200/40 p-1 rounded-2xl">
                      {['low', 'medium', 'high'].map((lvl) => (
                        <button key={lvl} onClick={() => updateEnergyLevel(lvl)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${energyLevel === lvl ? `${lvl === 'low' ? 'bg-rose-500' : lvl === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} text-white shadow-md font-bold scale-105` : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>
                          {lvl === 'low' ? <BatteryLow size={12} /> : lvl === 'medium' ? <BatteryMedium size={12} /> : <BatteryFull size={12} />}
                          <span className="text-[10px] font-black">{lvl === 'low' ? 'נמוכה' : lvl === 'medium' ? 'בינונית' : 'גבוהה'}</span>
                        </button>
                      ))}
                    </div>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <button onClick={handleSmartRoulette} disabled={isSorting} className="p-2 text-indigo-600 hover:bg-white rounded-2xl transition-all disabled:opacity-50" title="רולטת החלטות">
                      {isSorting ? <Loader2 size={16} className="animate-spin" /> : <Dices size={16} />}
                    </button>
                    <button onClick={handleSmartReorder} disabled={isSorting} className="p-2 text-amber-500 hover:bg-white rounded-2xl transition-all" title="סידור חכם"><Sparkles size={16} /></button>
                  </div>
                </div>

                <form onSubmit={addTask} className="mb-6 flex gap-3 p-1.5 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all duration-300">
                  <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="משהו חדש לעשות? כתבי כאן..." className="flex-1 bg-transparent px-4 py-1.5 outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm" />
                  <button type="submit" className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"><Plus size={18} /></button>
                </form>

                <div className="space-y-3">
                  {tasks.filter((task) => !task.completed && task.energyRequired === energyLevel).length === 0 && (
                    <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold italic text-sm">אין משימות לרמת האנרגיה הזו. אולי זה זמן לנוח? ☕</p>
                    </div>
                  )}

                  {tasks.filter((task) => !task.completed && task.energyRequired === energyLevel).map((task) => (
                    <div key={task.id} className={`rounded-[2rem] border-2 transition-all group ${focusTask?.id === task.id ? 'bg-indigo-50 border-indigo-500 shadow-sm p-4' : 'border-transparent hover:bg-slate-50 p-3'}`}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateTasks((prev) => prev.map((item) => item.id === task.id ? { ...item, completed: true } : item))} className="transition-transform active:scale-75">
                          <Circle className={`${task.energyRequired === 'low' ? 'text-rose-500' : task.energyRequired === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} size={22} />
                        </button>
                        <div className="flex-1 cursor-pointer overflow-hidden" onClick={() => handleSelectTask(task)}>
                          <span className={`font-bold text-base block truncate ${focusTask?.id === task.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                            <span className="ml-2 inline-block align-middle">{task.emoji || '📝'}</span>{task.text}
                          </span>
                          {taskStrategy?.taskId === task.id && focusTask?.id === task.id && <p className="text-[11px] text-indigo-600 font-medium mt-1 italic line-clamp-1">{taskStrategy.message}</p>}
                          {focusTask?.id === task.id && !isFocusActive && !isStrategyLoading && isBreakingDown !== task.id && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                              <button onClick={(e) => { e.stopPropagation(); startPrepare(task); }} className="whitespace-nowrap text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-all">
                                <ArrowRight size={10} /> כניסה לריכוז
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); openHelper(); }} className="whitespace-nowrap text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                                <MessageCircle size={10} /> קשה לי להתחיל
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {focusTask?.id === task.id && (
                            <button onClick={(e) => { e.stopPropagation(); setFocusTask(null); setIsFocusActive(false); }} className="p-1.5 text-indigo-400 hover:bg-white rounded-lg transition-all border border-indigo-100"><ChevronUp size={16} /></button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleTaskRewrite(task.id, task.text); }} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors" title="פשט משימה"><AlignLeft size={18} /></button>
                          <button onClick={(e) => { e.stopPropagation(); updateTasks((prev) => prev.filter((item) => item.id !== task.id)); }} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors" title="מחק"><Trash2 size={18} /></button>
                        </div>
                      </div>

                      {focusTask?.id === task.id && (
                        <div className="mt-3">
                          {isBreakingDown === task.id ? (
                            <div className="mr-8 p-3 bg-white/40 rounded-xl border border-dashed border-indigo-200 flex items-center gap-3 animate-pulse">
                              <Loader2 className="animate-spin text-indigo-400" size={16} />
                              <span className="text-[11px] font-bold text-indigo-500 italic">מפרק את המשימה לשלבים קטנים...</span>
                            </div>
                          ) : (
                            task.subTasks?.length > 0 && (
                              <div className="mr-8 space-y-1.5 border-r-2 border-indigo-100/50 pr-4">
                                {task.subTasks.map((subTask) => (
                                  <div key={subTask.id} onClick={() => toggleSubTask(task.id, subTask.id)} className="flex items-center gap-3 cursor-pointer">
                                    {subTask.completed ? <CheckCircle2 className="text-emerald-500" size={15} /> : <Circle className="text-slate-400" size={15} />}
                                    <span className={`text-[13px] font-medium transition-all ${subTask.completed ? 'line-through text-slate-300' : 'text-slate-600'}`}>{subTask.text}</span>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Lightbulb size={22} className="text-amber-500" /> Brain Dump</h3>
                  <button onClick={processBrainDump} disabled={isAILoading || !brainDump.trim()} className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-md hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isAILoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} הפוך למשימות
                  </button>
                </div>
                <textarea value={brainDump} onChange={(e) => updateBrainDump(e.target.value)} placeholder="פרוקי פה הכל..." className="w-full h-44 bg-slate-50 border-none rounded-[2rem] p-5 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-amber-200 transition-all" />
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white border border-slate-200/50 rounded-[2.5rem] shadow-sm relative overflow-hidden flex flex-col">
                <div className="p-6">
                  <h3 className="text-lg font-black italic flex items-center gap-2 text-slate-800 mb-4"><Calendar size={20} className="text-indigo-500" /> לו"ז קרוב</h3>
                  <div className="space-y-4">
                    {activeScheduleItem ? (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
                        <div className="bg-indigo-600 text-white p-2.5 rounded-xl"><activeScheduleItem.icon size={16} /></div>
                        <div className="flex-1">
                          <span className="text-sm font-black text-indigo-900 block">{activeScheduleItem.activity}</span>
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100 px-2 py-0.5 rounded-full inline-block mt-1">{activeScheduleItem.time} • עכשיו בביצוע</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-slate-400 p-2">אין פעילות מוגדרת.</div>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 group overflow-hidden relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Flame size={20} className="text-rose-500" /> תפריט דופמין</h3>
                  <button onClick={generateDopamineMenu} disabled={isDopamineLoading} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50">
                    {isDopamineLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} רענן
                  </button>
                </div>
                {isDopamineLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-rose-400" size={24} /></div>}
                {dopamineMenu && !isDopamineLoading && (
                  <div className="space-y-2">
                    {dopamineMenu.map((item, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start gap-3">
                        <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Smile size={14} /></div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Home size={20} className="text-teal-500" /> מטלות בית</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{houseChores.length ? Math.round((houseChores.filter((c) => c.completed).length / houseChores.length) * 100) : 0}% הושלם</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${houseChores.length ? Math.round((houseChores.filter((c) => c.completed).length / houseChores.length) * 100) : 0}%` }} />
                </div>
                <form onSubmit={addChore} className="mb-4 flex gap-2">
                  <input type="text" value={newChore} onChange={(e) => setNewChore(e.target.value)} placeholder="להוסיף מטלת בית..." className="flex-1 bg-slate-50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-teal-100 font-bold text-sm" />
                  <button type="submit" className="w-11 h-11 bg-teal-500 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"><Plus size={18} /></button>
                </form>
                <div className="space-y-2">
                  {houseChores.slice(0, 5).map((chore) => (
                    <div key={chore.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                      <button type="button" onClick={() => toggleChore(chore.id)}>
                        {chore.completed ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-teal-500" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${chore.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>{chore.text}</p>
                      </div>
                      <button type="button" onClick={() => deleteChore(chore.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <FinanceTab
            balance={balance}
            transactions={transactions}
            newTransaction={newTransaction}
            setNewTransaction={setNewTransaction}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
          />
        )}

        {activeTab === 'tasks' && (
          <section className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-200/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-slate-50 p-3 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 pl-2">אנרגיה:</span>
                {['low', 'medium', 'high'].map((lvl) => (
                  <button key={lvl} onClick={() => updateEnergyLevel(lvl)} className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${energyLevel === lvl ? 'bg-indigo-600 text-white shadow-md font-black' : 'text-slate-400 hover:bg-white'}`}>
                    <span className="text-[11px] uppercase">{lvl === 'low' ? 'נמוכה' : lvl === 'medium' ? 'בינונית' : 'גבוהה'}</span>
                  </button>
                ))}
              </div>
            </div>
            <form onSubmit={addTask} className="mb-8 flex gap-3 p-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl focus-within:border-indigo-400 focus-within:bg-white transition-all w-full">
              <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="משהו חדש לעשות?..." className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-lg" />
              <button type="submit" className="px-6 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all"><Plus size={20} /> הוסף</button>
            </form>
            <div className="space-y-4">
              {tasks.filter((t) => !t.completed).map((task) => (
                <div key={task.id} className={`rounded-[2rem] border-2 transition-all group ${energyLevel === task.energyRequired ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-slate-50'}`}>
                  <div className="flex items-start gap-4 p-5">
                    <button onClick={() => updateTasks((prev) => prev.map((item) => item.id === task.id ? { ...item, completed: true } : item))} className="transition-transform active:scale-75 mt-1">
                      <Circle className={`${task.energyRequired === 'low' ? 'text-rose-500' : task.energyRequired === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} size={24} />
                    </button>
                    <div className="flex-1"><p className={`font-bold text-lg ${task.energyRequired !== energyLevel ? 'opacity-40' : ''}`}>{task.emoji} {task.text}</p></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startPrepare(task)} className="p-2 text-indigo-400"><Play size={20} /></button>
                      <button onClick={() => handleTaskRewrite(task.id, task.text)} className="p-2 text-slate-400"><AlignLeft size={20} /></button>
                      <button onClick={() => updateTasks((prev) => prev.filter((item) => item.id !== task.id))} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8">
            <header className="mb-8"><h2 className="text-4xl font-black italic">ציר הזמן שלי</h2><p className="text-slate-500 font-bold">היום שלך במבט חטוף</p></header>
            <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
              <div className="absolute top-10 bottom-10 right-14 w-1 bg-slate-100" />
              <div className="space-y-6 relative">
                {scheduleItems.map((item) => {
                  const isActive = activeScheduleItem?.id === item.id;
                  return (
                    <div key={item.id} className={`flex items-start gap-8 transition-all duration-700 ${isActive ? 'scale-[1.03] my-6' : 'opacity-80'}`}>
                      <div className="w-16 flex flex-col items-center flex-shrink-0">
                        <span className={`font-mono text-sm font-black ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{item.time}</span>
                        <div className={`mt-3 w-4 h-4 rounded-full border-4 ${isActive ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-xl' : 'bg-slate-200'} z-10`} />
                      </div>
                      <div className={`flex-1 p-6 rounded-[2.5rem] border flex items-center gap-4 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-2xl border-transparent' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                        <div className={`p-4 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-slate-50 text-indigo-600'}`}><item.icon size={24} /></div>
                        <div><h4 className="font-black text-xl">{item.activity}</h4><p className={`text-xs uppercase tracking-widest font-bold mt-1 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{item.duration}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="space-y-8">
            <section className="bg-indigo-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4"><Compass size={300} /></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black italic mb-4 flex items-center gap-3"><Compass className="text-indigo-400" size={32} /> חזון החיים שלי</h2>
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                  <textarea value={vision} onChange={(e) => updateVision(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold text-indigo-50 resize-none h-24" placeholder="איך יראו החיים האידיאליים שלך?" />
                </div>
              </div>
            </section>
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Target size={28} className="text-indigo-600" /> מטרות על</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-8 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">{goal.category}</span>
                        <span className="text-lg font-black text-indigo-600">{goal.progress}%</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-6">{goal.text}</h4>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${goal.progress}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-8">
            <header className="flex justify-between items-end mb-4">
              <div><h2 className="text-3xl font-black italic">ספר המיומנויות</h2><p className="text-slate-500 font-bold">כל יום הוא הזדמנות לעלות שלב</p></div>
              <div className="flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-2xl font-black"><Flame size={20} fill="currentColor" /><span>3 ימי רצף</span></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50 flex flex-col gap-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><skill.icon size={28} /></div>
                    <div className="flex-1"><h4 className="font-bold text-lg">{skill.name}</h4><span className="text-xs font-black text-slate-400 uppercase tracking-widest">רמה {skill.level}</span></div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${skill.xp}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <header className="mb-8 flex items-center justify-between">
              <div><h2 className="text-4xl font-black italic">ארגז הכלים שלי</h2><p className="text-slate-500 font-bold mt-1">סדר, גיבוי ותקשורת</p></div>
              <Briefcase size={48} className="text-indigo-200" />
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-gradient-to-br from-teal-500 to-emerald-500 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group transition-all duration-700">
                <div className="relative z-10 text-white">
                  <h3 className="text-3xl font-black italic flex items-center gap-3 mb-4"><MapPin size={32} /> אי של סדר</h3>
                  <button onClick={startIslandOfOrder} className="bg-white text-teal-700 hover:text-teal-600 px-8 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 flex items-center gap-3 text-lg w-full justify-center">
                    {isIslandLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />} תמצא לי אי בטוח
                  </button>
                  {islandState.active && (
                    <div className="mt-4 bg-white/15 rounded-2xl p-4 text-sm font-bold">
                      <div>{islandState.area}</div>
                      <div className="mt-1 opacity-80">{formatTime(islandState.timeLeft)}</div>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 flex flex-col justify-between group">
                <div>
                  <h3 className="text-2xl font-black italic flex items-center gap-3 mb-4 text-indigo-600"><Save size={24} /> גיבוי ומידע</h3>
                  <p className="text-slate-500 font-medium mb-6 leading-relaxed">שמרי את כל המידע שלך לקובץ בטוח.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={exportData} className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-4 rounded-2xl font-black hover:bg-indigo-100 transition-all active:scale-95 shadow-sm"><Download size={20} /> הורדה</button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg"><Upload size={20} /> העלאה</button>
                  <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />
                </div>
              </section>

              <section className="bg-indigo-600 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col md:col-span-2">
                <Shield size={100} className="absolute top-0 right-0 opacity-10 -translate-y-4 translate-x-4" />
                <h3 className="text-2xl font-black italic flex items-center gap-3 mb-4"><Sparkles size={24} className="text-amber-300" /> כלי תקשורת</h3>
                <div className="flex gap-1 bg-white/20 p-1 rounded-xl mb-4 self-start">
                  <button onClick={() => setCommToolMode('draft')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${commToolMode === 'draft' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'}`}>ניסוח מחדש</button>
                  <button onClick={() => setCommToolMode('rsd')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${commToolMode === 'rsd' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-100 hover:text-white'}`}>סינון</button>
                </div>
                <textarea value={commInput} onChange={(e) => setCommInput(e.target.value)} placeholder="כתבי פה..." className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-sm placeholder:text-indigo-300/50 resize-none mb-4" />
                <button onClick={handleCommTool} disabled={isCommLoading} className="w-full py-4 bg-white text-indigo-700 font-black text-sm rounded-2xl hover:bg-indigo-50 transition-all shadow-lg">
                  {isCommLoading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'בצע פעולה'}
                </button>
                {commResult && <div className="mt-4 p-4 bg-white text-slate-800 rounded-2xl text-sm shadow-inner">{commResult}</div>}
              </section>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => updateActiveTab(item.id)} className={`flex-1 min-w-[76px] flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg scale-105 font-bold' : 'text-slate-500 hover:text-slate-200'}`}>
              <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function FinanceTab({ balance, transactions, newTransaction, setNewTransaction, addTransaction, deleteTransaction }) {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-black italic">ניהול פיננסי</h2>
          <p className="text-slate-500 font-bold">כי כסף זה רק כלי ליצירת שקט</p>
        </div>
        <div className="bg-white p-4 px-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Wallet size={24} /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">יתרה זמינה</p><p className="text-xl font-black text-emerald-900">₪{balance}</p></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-indigo-600" /> הזנה מהירה</h3>
            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                <button onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${newTransaction.type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'}`}>הוצאה</button>
                <button onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${newTransaction.type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'}`}>הכנסה</button>
              </div>
              <input type="text" placeholder="מה קנינו?" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" />
              <input type="number" placeholder="כמה זה עלה?" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm" />
              <button onClick={addTransaction} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">שמור תנועה</button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 h-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-8"><Wallet size={24} className="text-indigo-600" /> היסטוריית תנועות</h3>
            <div className="space-y-3">
              {transactions.length === 0 && <div className="text-center py-20 opacity-30 italic font-bold">אין תנועות עדיין...</div>}
              {transactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                  <div className="font-bold">{t.description}</div>
                  <div className="flex items-center gap-4">
                    <p className={`font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'income' ? '+' : '-'}₪{t.amount}</p>
                    <button onClick={() => deleteTransaction(t.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
