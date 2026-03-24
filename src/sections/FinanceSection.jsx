import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Wallet, TrendingUp, Banknote } from 'lucide-react';

export default function FinanceSection({
  transactions = [],
  setTransactions,
  balance = 0,
  expenses = 0,
  income = 0,
}) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'general',
  });

  const normalizedTransactions = useMemo(() => {
    return safeTransactions.map((t) => ({
      ...t,
      amount: Number(t?.amount || 0),
    }));
  }, [safeTransactions]);

  const addTransaction = () => {
    if (!newTransaction.description.trim() || !newTransaction.amount) return;
    if (typeof setTransactions !== 'function') return;

    const nextItem = {
      id: Date.now(),
      description: newTransaction.description.trim(),
      amount: Number(newTransaction.amount || 0),
      type: newTransaction.type || 'expense',
      category: newTransaction.category || 'general',
      date: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [nextItem, ...safePrev];
    });

    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'general',
    });
  };

  const deleteTransaction = (id) => {
    if (typeof setTransactions !== 'function') return;

    setTransactions((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((t) => t.id !== id);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-black italic">ניהול פיננסי</h2>
          <p className="text-slate-500 font-bold">כי כסף זה רק כלי ליצירת שקט</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-4 px-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                יתרה זמינה
              </p>
              <p className="text-xl font-black text-emerald-900">₪{Number(balance || 0)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" />
              הזנה מהירה
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() =>
                    setNewTransaction((prev) => ({ ...prev, type: 'expense' }))
                  }
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    newTransaction.type === 'expense'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400'
                  }`}
                >
                  הוצאה
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setNewTransaction((prev) => ({ ...prev, type: 'income' }))
                  }
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    newTransaction.type === 'income'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400'
                  }`}
                >
                  הכנסה
                </button>
              </div>

              <input
                type="text"
                placeholder="מה קנינו?"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm"
              />

              <input
                type="number"
                placeholder="כמה זה עלה?"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm"
              />

              <button
                type="button"
                onClick={addTransaction}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg"
              >
                שמור תנועה
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/50">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
              <Wallet size={20} className="text-emerald-500" />
              סיכום מהיר
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                <span className="text-[9px] font-black text-emerald-600 uppercase block">
                  הכנסות
                </span>
                <p className="text-lg font-black text-emerald-700">₪{Number(income || 0)}</p>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl text-center">
                <span className="text-[9px] font-black text-rose-600 uppercase block">
                  הוצאות
                </span>
                <p className="text-lg font-black text-rose-700">₪{Number(expenses || 0)}</p>
              </div>

              <div className="bg-indigo-50 p-3 rounded-2xl text-center">
                <span className="text-[9px] font-black text-indigo-600 uppercase block">
                  יתרה
                </span>
                <p className="text-lg font-black text-indigo-700">₪{Number(balance || 0)}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 h-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
              <Banknote size={24} className="text-indigo-600" />
              היסטוריית תנועות
            </h3>

            <div className="space-y-3">
              {normalizedTransactions.length === 0 && (
                <div className="text-center py-20 opacity-30 italic font-bold">
                  אין תנועות עדיין...
                </div>
              )}

              {normalizedTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <div>
                    <div className="font-bold">{t.description || 'ללא תיאור'}</div>
                    {t.date && (
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(t.date).toLocaleDateString('he-IL')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-black ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₪{Number(t.amount || 0)}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(t.id)}
                      className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
