import React from 'react';

export default function FinanceSection({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-[34px] font-black text-slate-800">ניהול פיננסי</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-lg">
          <p className="text-sm font-black opacity-80 mb-1">יתרה נוכחית</p>
          <p className="text-[42px] font-black leading-tight">₪{income - expenses}</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <p className="text-sm font-black text-slate-400 mb-1">הוצאות החודש</p>
          <p className="text-[42px] font-black text-rose-500 leading-tight">₪{expenses}</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <p className="text-sm font-black text-slate-400 mb-1">הכנסות החודש</p>
          <p className="text-[42px] font-black text-emerald-500 leading-tight">₪{income}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200/60 shadow-sm min-h-[300px]">
        <h3 className="text-2xl font-black mb-6">תנועות אחרונות</h3>
        <p className="text-center text-slate-400 py-16 text-xl italic font-black">
          עוד לא הוספת תנועות החודש.
        </p>
      </div>
    </div>
  );
}
