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
  { id: 'dashboard', label: 'ראשי', icon: LayoutDashboard },
  { id: 'tasks', label: 'משימות', icon: ListTodo },
  { id: 'finance', label: 'כסף', icon: Wallet },
  { id: 'schedule', label: 'לו"ז', icon: Calendar },
  { id: 'vision', label: 'חזון', icon: Compass },
  { id: 'skills', label: 'ספר', icon: GraduationCap },
  { id: 'tools', label: 'כלים', icon: Briefcase },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-[1120px] -translate-x-1/2 px-4">
      <nav
        dir="rtl"
        className="flex items-center justify-between rounded-[2.7rem] border border-white/10 bg-[#16284b] px-6 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.28)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex min-w-[118px] flex-col items-center justify-center rounded-[2rem] transition-all duration-300 ${
                isActive
                  ? 'h-[168px] bg-gradient-to-br from-[#4f46e5] to-[#6d5dfc] px-7 text-white shadow-[0_16px_30px_rgba(79,70,229,0.28)]'
                  : 'h-[100px] px-4 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon
                size={isActive ? 36 : 34}
                strokeWidth={1.8}
                className={isActive ? 'mb-3' : 'mb-3 opacity-90'}
              />
              <span
                className={`font-black tracking-tight ${
                  isActive ? 'text-[22px]' : 'text-[18px]'
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
