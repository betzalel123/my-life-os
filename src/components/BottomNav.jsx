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
  { id: 'tools', label: 'כלים', icon: Briefcase },
  { id: 'skills', label: 'ספר', icon: GraduationCap },
  { id: 'vision', label: 'חזון', icon: Compass },
  { id: 'schedule', label: 'לו"ז', icon: Calendar },
  { id: 'finance', label: 'כסף', icon: Wallet },
  { id: 'tasks', label: 'משימות', icon: ListTodo },
  { id: 'dashboard', label: 'ראשי', icon: LayoutDashboard },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-full max-w-[1120px] -translate-x-1/2 px-1 sm:px-3">
      <nav
        dir="rtl"
        className="flex items-center justify-between rounded-[2.8rem] border border-white/10 bg-[#172544] px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.35)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex min-w-[110px] flex-col items-center justify-center gap-2 rounded-[2rem] transition-all duration-300 ${
                isActive
                  ? 'bg-[#5b4cf6] text-white shadow-[0_10px_30px_rgba(91,76,246,0.35)] h-[118px] px-8'
                  : 'h-[118px] px-4 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon
                size={31}
                strokeWidth={1.9}
                className={isActive ? 'text-white' : 'text-slate-400'}
              />
              <span
                className={`text-[15px] font-black tracking-tight ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
