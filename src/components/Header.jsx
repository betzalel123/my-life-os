import React from 'react';
import { Zap, Heart } from 'lucide-react';

export default function Header({ currentTime }) {
  const formatClock = (date) =>
    date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  return (
    <header className="sticky top-0 z-40 h-[88px] px-8 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
          <Zap size={26} />
        </div>
        <h1 className="text-[26px] md:text-[32px] font-black italic text-slate-900">
          LifeOS <span className="text-indigo-500 not-italic">AI Pro</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black text-base flex items-center gap-2.5 shadow-sm hover:bg-rose-100 transition-all">
          <Heart size={16} fill="currentColor" />
          הצלה
        </button>

        <div className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-500 font-black text-xl tracking-wide">
          {formatClock(currentTime)}
        </div>
      </div>
    </header>
  );
}
