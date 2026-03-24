import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardSection from './sections/DashboardSection';
import TasksSection from './sections/TasksSection';
import FinanceSection from './sections/FinanceSection';
import ScheduleSection from './sections/ScheduleSection';
import VisionSection from './sections/VisionSection';
import SkillsSection from './sections/SkillsSection';
import ToolsSection from './sections/ToolsSection';
import { loadFromLocal, saveToLocal } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState(() =>
    loadFromLocal('lifeos_activeTab', 'dashboard')
  );

  const [energyLevel, setEnergyLevel] = useState(() =>
    loadFromLocal('lifeos_energyLevel', 'medium')
  );

  const [tasks, setTasks] = useState(() =>
    loadFromLocal('lifeos_tasks', [])
  );

  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() =>
    loadFromLocal('lifeos_brainDump', '')
  );

  const [timeLeft, setTimeLeft] = useState(() =>
    loadFromLocal('lifeos_timeLeft', 25 * 60)
  );

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [transactions, setTransactions] = useState(() =>
    loadFromLocal('lifeos_transactions', [])
  );

  const [vision, setVision] = useState(() =>
    loadFromLocal(
      'lifeos_vision',
      'לבנות חיים מאוזנים שבהם היצירתיות שלי באה לידי ביטוי מדי יום.'
    )
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const updateActiveTab = (value) => {
    setActiveTab(value);
    saveToLocal('lifeos_activeTab', value);
  };

  const updateEnergyLevel = (value) => {
    setEnergyLevel(value);
    saveToLocal('lifeos_energyLevel', value);
  };

  const updateTasks = (value) => {
    const nextValue = typeof value === 'function' ? value(tasks) : value;
    setTasks(nextValue);
    saveToLocal('lifeos_tasks', nextValue);
  };

  const updateBrainDump = (value) => {
    const nextValue = typeof value === 'function' ? value(brainDump) : value;
    setBrainDump(nextValue);
    saveToLocal('lifeos_brainDump', nextValue);
  };

  const updateTransactions = (value) => {
    const nextValue =
      typeof value === 'function' ? value(transactions) : value;
    setTransactions(nextValue);
    saveToLocal('lifeos_transactions', nextValue);
  };

  const updateVision = (value) => {
    const nextValue = typeof value === 'function' ? value(vision) : value;
    setVision(nextValue);
    saveToLocal('lifeos_vision', nextValue);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      energyRequired: energyLevel,
    };

    updateTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    updateTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    updateTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 pb-32"
      dir="rtl"
    >
      <Header currentTime={currentTime} />

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
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            brainDump={brainDump}
            setBrainDump={updateBrainDump}
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksSection
            tasks={tasks}
            energyLevel={energyLevel}
            setEnergyLevel={updateEnergyLevel}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceSection
            transactions={transactions}
            setTransactions={updateTransactions}
          />
        )}

        {activeTab === 'schedule' && <ScheduleSection />}

        {activeTab === 'vision' && (
          <VisionSection vision={vision} setVision={updateVision} />
        )}

        {activeTab === 'skills' && <SkillsSection />}

        {activeTab === 'tools' && <ToolsSection />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={updateActiveTab} />
    </div>
  );
}
