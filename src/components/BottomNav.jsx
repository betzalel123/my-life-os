import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Wallet,
  Calendar,
  Compass,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'ראשי' },
  { id: 'tasks', icon: ListTodo, label: 'משימות' },
  { id: 'finance', icon: Wallet, label: 'כסף' },
  { id: 'schedule', icon: Calendar, label: 'לו"ז' },
  { id: 'vision', icon: Compass, label: 'חזון' },
  { id: 'skills', icon: GraduationCap, label: 'ספר' },
  { id: 'tools', icon: Briefcase, label: 'כלים' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
      <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-2.5 flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[2rem] transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg scale-105 font-bold'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
