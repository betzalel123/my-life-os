import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Compass,
  Calendar,
  Wallet,
  ListTodo,
  LayoutDashboard,
} from 'lucide-react';

const items = [
  { id: 'tools', icon: Briefcase, label: 'כלים' },
  { id: 'skills', icon: GraduationCap, label: 'ספר' },
  { id: 'vision', icon: Compass, label: 'חזון' },
  { id: 'schedule', icon: Calendar, label: 'לו"ז' },
  { id: 'finance', icon: Wallet, label: 'כסף' },
  { id: 'tasks', icon: ListTodo, label: 'משימות' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[780px] px-4">
      <nav className="bg-[#182544] text-white rounded-[2.35rem] shadow-2xl px-5 py-3 flex items-center justify-between border border-white/5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-[1.8rem] transition-all min-w-[76px] ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[14px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
