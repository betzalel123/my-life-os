import React from 'react';
import { Plus, TrendingUp, Banknote, Trash2 } from 'lucide-react';

export default function FinanceSection({
  balance,
  transactions,
  newTransaction,
  setNewTransaction,
  addTransaction,
  deleteTransaction,
}) {
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
              <p className="text-xl font-black text-emerald-900">₪{balance}</p>
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
                    setNewTransaction({ ...newTransaction, type: 'expense' })
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
                    setNewTransaction({ ...newTransaction, type: 'income' })
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
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm"
              />

              <input
                type="number"
                placeholder="כמה זה עלה?"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
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
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 h-full">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
              <Banknote size={24} className="text-indigo-600" />
              היסטוריית תנועות
            </h3>

            <div className="space-y-3">
              {transactions.length === 0 && (
                <div className="text-center py-20 opacity-30 italic font-bold">
                  אין תנועות עדיין...
                </div>
              )}

              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <div className="font-bold">{t.description}</div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-black ${
                        t.type === 'income'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₪{t.amount}
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
