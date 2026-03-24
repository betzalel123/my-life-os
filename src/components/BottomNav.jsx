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
    <div className="fixed bottom-5 left-1/2 z-50 w-full max-w-[1080px] -translate-x-1/2 px-2">
      <nav
        dir="rtl"
        className="flex items-center justify-between rounded-[2.6rem] border border-white/10 bg-[#172544] px-6 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.28)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-2 rounded-[2rem] transition-all duration-300 ${
                isActive
                  ? 'h-[126px] min-w-[150px] bg-[#5b4cf6] px-8 text-white shadow-[0_10px_30px_rgba(91,76,246,0.32)]'
                  : 'h-[126px] min-w-[108px] px-4 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon
                size={30}
                strokeWidth={1.9}
                className={isActive ? 'text-white' : 'text-slate-400'}
              />
              <span
                className={`text-[15px] font-black ${
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
