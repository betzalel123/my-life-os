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
import { loadFromLocal } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => loadFromLocal('lifeos_activeTab', 'dashboard'));
  const [energyLevel, setEnergyLevel] = useState(() => loadFromLocal('lifeos_energyLevel', 'medium'));
  const [tasks, setTasks] = useState(() => loadFromLocal('lifeos_tasks', []));
  const [transactions, setTransactions] = useState(() => loadFromLocal('lifeos_transactions', []));
  const [newTask, setNewTask] = useState('');
  const [brainDump, setBrainDump] = useState(() => loadFromLocal('lifeos_brainDump', ''));
  const [timeLeft, setTimeLeft] = useState(() => loadFromLocal('lifeos_timeLeft', 25 * 60));
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    window.localStorage.setItem('lifeos_activeTab', JSON.stringify(activeTab));
    window.localStorage.setItem('lifeos_energyLevel', JSON.stringify(energyLevel));
    window.localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    window.localStorage.setItem('lifeos_transactions', JSON.stringify(transactions));
    window.localStorage.setItem('lifeos_brainDump', JSON.stringify(brainDump));
    window.localStorage.setItem('lifeos_timeLeft', JSON.stringify(timeLeft));
  }, [activeTab, energyLevel, tasks, transactions, brainDump, timeLeft]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks((prev) => [
      { id: Date.now(), text: newTask.trim(), completed: false, energyRequired: energyLevel },
      ...prev,
    ]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans pb-32" dir="rtl">
      <Header currentTime={currentTime} />

      <main className="max-w-[1680px] mx-auto px-6 lg:px-10 py-8">
        {activeTab === 'dashboard' && (
          <DashboardSection
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            energyLevel={energyLevel}
            setEnergyLevel={setEnergyLevel}
            tasks={tasks} 
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            brainDump={brainDump}
            setBrainDump={setBrainDump}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksSection
            tasks={tasks}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            energyLevel={energyLevel}
            setEnergyLevel={setEnergyLevel}
          />
        )}

        {activeTab === 'finance' && <FinanceSection transactions={transactions} />}
        {activeTab === 'schedule' && <ScheduleSection />}
        {activeTab === 'vision' && <VisionSection />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'tools' && <ToolsSection />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
