import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function SkillsSection() {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed text-slate-300">
      <BrainCircuit size={48} className="mb-4 opacity-20" />
      <p className="text-xl font-black italic uppercase">הטאב הזה חוזר בקרוב... 🔨</p>
    </div>
  );
}
