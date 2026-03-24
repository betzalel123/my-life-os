import React, { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Banknote,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Filter,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Tags,
  Calendar,
  Loader2,
} from 'lucide-react';

const DEFAULT_CATEGORIES = {
  expense: ['אוכל', 'בית', 'תחבורה', 'בריאות', 'בילויים', 'קניות', 'לימודים', 'אחר'],
  income: ['משכורת', 'פרילנס', 'מתנה', 'החזר', 'אחר'],
};

const formatCurrency = (value) => {
  const num = Number(value || 0);
  return `₪${num.toLocaleString('he-IL')}`;
};

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return '';
  }
};

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 'unknown';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const buildLocalInsights = (transactions) => {
  const list = safeArray(transactions);
  const expenses = list.filter((t) => t.type === 'expense');
  const incomes = list.filter((t) => t.type === 'income');

  const totalExpenses = expenses.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalIncome = incomes.reduce((s, t) => s + Number(t.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = expenses.reduce((acc, t) => {
    const key = t.category || 'אחר';
    acc[key] = (acc[key] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const topCategoryEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const largestExpense = expenses.slice().sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];

  const insights = [];

  if (list.length === 0) {
    insights.push('אין עדיין נתונים, אז הצעד הכי טוב הוא להתחיל לעקוב אחרי כל הוצאה קטנה לכמה ימים.');
    return insights;
  }

  if (balance < 0) {
    insights.push('כרגע יצאת ליתרה שלילית בתקופה הנוכחית, אז כדאי לבדוק קודם מה אפשר לצמצם לפני שמוסיפים הוצאות חדשות.');
  } else {
    insights.push('כרגע המאזן שלך חיובי, וזה בסיס טוב להתחיל ממנו תכנון יותר מסודר.');
  }

  if (topCategoryEntry) {
    insights.push(`הקטגוריה שהכי "אוכלת" כסף כרגע היא ${topCategoryEntry[0]} עם ${formatCurrency(topCategoryEntry[1])}.`);
  }

  if (largestExpense) {
    insights.push(`ההוצאה הבודדת הכי גדולה הייתה "${largestExpense.description}" על סך ${formatCurrency(largestExpense.amount)}.`);
  }

  if (totalIncome > 0 && totalExpenses / totalIncome > 0.8) {
    insights.push('רוב ההכנסה כבר נבלעת בהוצאות, אז שווה במיוחד להגדיר גבול לאחת הקטגוריות הגדולות.');
  }

  if (expenses.length >= 5) {
    insights.push('יש כבר מספיק נתונים כדי לזהות דפוס, אז מעכשיו הכי משתלם לעקוב בעיקר אחרי הקטגוריה המובילה ולא אחרי הכול בבת אחת.');
  }

  return insights.slice(0, 4);
};

async function tryGenerateAIInsights(summary) {
  try {
    if (typeof window === 'undefined' || !window.ai) return null;

    const prompt = `
אתה עוזר פיננסי אישי.
ענה בעברית פשוטה, קצרה וברורה.
תן:
1. 3 תובנות קצרות
2. 2 המלצות פעולה קטנות ומעשיות
ענה ב-JSON בלבד בצורה:
{
  "insights": ["...", "...", "..."],
  "actions": ["...", "..."]
}

נתונים:
${JSON.stringify(summary)}
    `.trim();

    if (window.ai?.complete) {
      const raw = await window.ai.complete(prompt);
      const parsed = JSON.parse(raw);
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export default function FinanceSection({
  transactions = [],
  setTransactions,
  balance = 0,
  expenses = 0,
  income = 0,
}) {
  const safeTransactions = safeArray(transactions);

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'אחר',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);

  const currentCategories =
    newTransaction.type === 'income'
      ? DEFAULT_CATEGORIES.income
      : DEFAULT_CATEGORIES.expense;

  useEffect(() => {
    if (!newTransaction.category || !currentCategories.includes(newTransaction.category)) {
      setNewTransaction((prev) => ({
        ...prev,
        category: currentCategories[0] || 'אחר',
      }));
    }
  }, [newTransaction.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const allCategories = useMemo(() => {
    const fromData = safeTransactions
      .map((t) => t.category)
      .filter(Boolean);
    return ['all', ...Array.from(new Set([...DEFAULT_CATEGORIES.expense, ...DEFAULT_CATEGORIES.income, ...fromData]))];
  }, [safeTransactions]);

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter((t) => {
      const matchesSearch =
        !searchTerm.trim() ||
        String(t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(t.category || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [safeTransactions, searchTerm, typeFilter, categoryFilter]);

  const stats = useMemo(() => {
    const totalIncome = safeTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpenses = safeTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const monthlyGroups = safeTransactions.reduce((acc, t) => {
      const key = monthKey(t.date || new Date().toISOString());
      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }
      acc[key][t.type] += Number(t.amount || 0);
      return acc;
    }, {});

    const latestMonth = Object.keys(monthlyGroups).sort().pop();
    const latestMonthData = latestMonth
      ? monthlyGroups[latestMonth]
      : { income: 0, expense: 0 };

    const expensesByCategory = safeTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const key = t.category || 'אחר';
        acc[key] = (acc[key] || 0) + Number(t.amount || 0);
        return acc;
      }, {});

    const topExpenseCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0] || null;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      latestMonth,
      latestMonthData,
      topExpenseCategory,
    };
  }, [safeTransactions]);

  const localInsights = useMemo(() => buildLocalInsights(safeTransactions), [safeTransactions]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (safeTransactions.length < 3) {
        setAIInsights(null);
        return;
      }

      setIsAIAnalyzing(true);

      const summary = {
        transactionsCount: safeTransactions.length,
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        balance: stats.balance,
        topExpenseCategory: stats.topExpenseCategory,
        latestMonth: stats.latestMonth,
        latestMonthData: stats.latestMonthData,
        sample: safeTransactions.slice(0, 12),
      };

      const result = await tryGenerateAIInsights(summary);

      if (!cancelled) {
        setAIInsights(result);
        setIsAIAnalyzing(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [safeTransactions, stats]);

  const addTransaction = () => {
    const description = newTransaction.description.trim();
    const amount = Number(newTransaction.amount);

    if (!description || !amount || amount <= 0) return;
    if (typeof setTransactions !== 'function') return;

    const nextItem = {
      id: Date.now(),
      description,
      amount,
      type: newTransaction.type,
      category: newTransaction.category || 'אחר',
      date: new Date().toISOString(),
    };

    setTransactions((prev) => [nextItem, ...safeArray(prev)]);

    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'אחר',
    });
  };

  const deleteTransaction = (id) => {
    if (typeof setTransactions !== 'function') return;
    setTransactions((prev) => safeArray(prev).filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black italic">ניהול פיננסי</h2>
          <p className="text-slate-500 font-bold">יותר ברור, יותר חכם, פחות כאב ראש</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="bg-white p-4 px-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">יתרה</p>
              <p className="text-lg font-black text-emerald-900">{formatCurrency(balance)}</p>
            </div>
          </div>

          <div className="bg-white p-4 px-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <ArrowDownCircle size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">הוצאות</p>
              <p className="text-lg font-black text-rose-900">{formatCurrency(expenses)}</p>
            </div>
          </div>

          <div className="bg-white p-4 px-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ArrowUpCircle size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">הכנסות</p>
              <p className="text-lg font-black text-indigo-900">{formatCurrency(income)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-6">
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
                    setNewTransaction((prev) => ({
                      ...prev,
                      type: 'expense',
                      category: DEFAULT_CATEGORIES.expense[0],
                    }))
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
                    setNewTransaction((prev) => ({
                      ...prev,
                      type: 'income',
                      category: DEFAULT_CATEGORIES.income[0],
                    }))
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
                placeholder="מה זה היה?"
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
                placeholder="כמה?"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm"
              />

              <div className="relative">
                <Tags size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 p-4 pr-11 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-sm appearance-none"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={addTransaction}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all"
              >
                שמור תנועה
              </button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              תובנות חכמות
            </h3>

            <div className="space-y-3">
              {localInsights.map((item, idx) => (
                <div
                  key={`local-${idx}`}
                  className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm font-bold text-amber-900"
                >
                  {item}
                </div>
              ))}

              {isAIAnalyzing && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-500 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  מנתח דפוסים אוטומטית...
                </div>
              )}

              {aiInsights?.insights?.map((item, idx) => (
                <div
                  key={`ai-${idx}`}
                  className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-900"
                >
                  {item}
                </div>
              ))}

              {aiInsights?.actions?.length > 0 && (
                <div className="mt-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">
                    צעדים מומלצים
                  </div>
                  <div className="space-y-2">
                    {aiInsights.actions.map((item, idx) => (
                      <div key={`act-${idx}`} className="text-sm font-bold text-emerald-900">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <AlertCircle size={20} className="text-rose-500" />
              תמונת מצב
            </h3>

            <div className="space-y-3 text-sm font-bold">
              <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500">סה״כ תנועות</span>
                <span className="text-slate-900">{safeTransactions.length}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500">חודש אחרון</span>
                <span className="text-slate-900">
                  {stats.latestMonthData
                    ? `${formatCurrency(stats.latestMonthData.income - stats.latestMonthData.expense)}`
                    : '—'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500">קטגוריה מובילה</span>
                <span className="text-slate-900">
                  {stats.topExpenseCategory ? stats.topExpenseCategory[0] : '—'}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="xl:col-span-2">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/50 h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Banknote size={24} className="text-indigo-600" />
                היסטוריית תנועות
              </h3>

              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="חיפוש..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-50 pr-10 pl-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold w-full md:w-52"
                  />
                </div>

                <div className="relative">
                  <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-slate-50 pr-10 pl-8 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold appearance-none"
                  >
                    <option value="all">כל הסוגים</option>
                    <option value="expense">הוצאות</option>
                    <option value="income">הכנסות</option>
                  </select>
                </div>

                <div className="relative">
                  <Tags size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 pr-10 pl-8 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold appearance-none"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'כל הקטגוריות' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTransactions.length === 0 && (
                <div className="text-center py-20 opacity-40 italic font-bold text-slate-500">
                  אין תנועות להצגה...
                </div>
              )}

              {filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                        t.type === 'income'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900">{t.description}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] font-black px-2 py-1 rounded-full bg-white text-slate-500 border border-slate-200">
                          {t.category || 'אחר'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(t.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <p
                      className={`font-black text-lg ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(t.id)}
                      className="text-slate-300 hover:text-rose-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
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
