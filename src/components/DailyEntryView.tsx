import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Save,
  CheckCircle2,
  AlertCircle,
  Banknote,
  QrCode,
  Tag,
  PenTool,
  Clock,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Mic,
  MicOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyEntry } from '../types';
import { formatINR } from '../utils/storage';
import { startVoiceRecognition } from '../utils/voiceInput';

interface DailyEntryViewProps {
  currentEntry: DailyEntry;
  onSave: (entry: DailyEntry) => void;
  onGoToCalendar: () => void;
}

export const DailyEntryView: React.FC<DailyEntryViewProps> = ({
  currentEntry,
  onSave,
  onGoToCalendar,
}) => {
  const [date, setDate] = useState(currentEntry.date || '2026-09-26');
  const [sales, setSales] = useState<number>(currentEntry.sales || 0);
  const [expenses, setExpenses] = useState<number>(currentEntry.expenses || 0);
  const [cashSales, setCashSales] = useState<number>(currentEntry.cashSales || 0);
  const [upiSales, setUpiSales] = useState<number>(currentEntry.upiSales || 0);
  const [notes, setNotes] = useState<string>(currentEntry.notes || '');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    startVoiceRecognition(
      (text) => {
        setIsListening(false);
        // Extract numbers from text
        const matches = text.match(/\d+/g);
        if (matches && matches.length > 0) {
          const num = Number(matches[0]);
          if (text.toLowerCase().includes('exp') || text.toLowerCase().includes('kharcha')) {
            setExpenses(num);
          } else {
            setSales(num);
            setCashSales(Math.round(num * 0.6));
            setUpiSales(Math.round(num * 0.4));
          }
        }
        setNotes((prev) => (prev ? `${prev} (Voice: ${text})` : `Voice: ${text}`));
      },
      (err) => {
        console.warn('Voice error', err);
        setIsListening(false);
      },
      () => setIsListening(false)
    );
  };

  // Sync state if prop changes (e.g. from calendar selection)
  useEffect(() => {
    setDate(currentEntry.date || '2026-09-26');
    setSales(currentEntry.sales || 0);
    setExpenses(currentEntry.expenses || 0);
    setCashSales(currentEntry.cashSales || 0);
    setUpiSales(currentEntry.upiSales || 0);
    setNotes(currentEntry.notes || '');
  }, [currentEntry]);

  // Derived profit metrics
  const netProfit = sales - expenses;
  const isProfit = netProfit >= 0;
  const profitMargin = sales > 0 ? ((netProfit / sales) * 100).toFixed(1) : '0.0';

  // Quick increment handlers for sales
  const handleAddSales = (amt: number) => {
    const newSales = sales + amt;
    setSales(newSales);
    // Split 60% cash, 40% UPI by default if user hasn't explicitly fine-tuned
    setCashSales(Math.round(newSales * 0.6));
    setUpiSales(Math.round(newSales * 0.4));
  };

  const handleClearSales = () => {
    setSales(0);
    setCashSales(0);
    setUpiSales(0);
  };

  // Quick expense tags
  const handleQuickExpense = (categoryName: string, amt: number) => {
    const newExp = expenses + amt;
    setExpenses(newExp);
    if (!notes.includes(categoryName)) {
      setNotes((prev) => (prev ? `${prev}, ${categoryName}` : categoryName));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entryToSave: DailyEntry = {
      date,
      sales: Number(sales) || 0,
      expenses: Number(expenses) || 0,
      cashSales: Number(cashSales) || 0,
      upiSales: Number(upiSales) || 0,
      notes: notes.trim(),
    };

    onSave(entryToSave);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
      });
    } catch (err) {
      // safe fallback
    }

    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-5 animate-slide-up">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Friday, 26 Sep 2026
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              TODAY
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daily Register #1 • Kirana Section
          </p>
        </div>

        {/* Live Ribbon Pills & Voice Mic */}
        <div className="flex items-center gap-2 text-right">
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse'
                : 'bg-slate-50 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'
            }`}
            title="Speech-to-text Voice Logging (बोलकर एंट्री करें)"
          >
            {isListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4" />}
          </button>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">Today P&L</div>
            <div
              className={`text-sm font-extrabold tabular-nums font-display ${
                isProfit ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isProfit ? '+' : ''}
              {formatINR(netProfit)}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card 1: Today's Sales */}
        <div className="card-tactile card-sales p-5 bg-white space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Today's Sales (आज की कुल बिक्री)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cash in drawer, customer UPI & counter sales
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
              INCOME
            </span>
          </div>

          {/* Main Sales Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-extrabold text-2xl font-display">
              ₹
            </div>
            <input
              type="number"
              value={sales || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSales(val);
                setCashSales(Math.round(val * 0.6));
                setUpiSales(Math.round(val * 0.4));
              }}
              placeholder="0"
              className="w-full pl-9 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-3xl font-extrabold text-slate-900 font-display tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Quick-add chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Add:</span>
            <button
              type="button"
              onClick={() => handleAddSales(500)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg transition-all"
            >
              +₹500
            </button>
            <button
              type="button"
              onClick={() => handleAddSales(1000)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg transition-all"
            >
              +₹1,000
            </button>
            <button
              type="button"
              onClick={() => handleAddSales(2000)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg transition-all"
            >
              +₹2,000
            </button>
            <button
              type="button"
              onClick={handleClearSales}
              className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 ml-auto"
            >
              Clear
            </button>
          </div>

          {/* Cash vs UPI Breakdown Drawer */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Cash Drawer
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-2 top-1.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={cashSales || ''}
                  onChange={(e) => setCashSales(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded-lg font-bold font-display text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" /> UPI / QR Collection
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-2 top-1.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={upiSales || ''}
                  onChange={(e) => setUpiSales(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded-lg font-bold font-display text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Expenses */}
        <div className="card-tactile card-expense p-5 bg-white space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                <Tag className="w-4 h-4 text-rose-600" />
                <span>Today's Expenses (दुकान का खर्च)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Stock purchase, labour, rent, electricity, tea/misc
              </p>
            </div>
            <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2 py-1 rounded-lg">
              OUTFLOW
            </span>
          </div>

          {/* Main Expense Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-extrabold text-2xl font-display">
              ₹
            </div>
            <input
              type="number"
              value={expenses || ''}
              onChange={(e) => setExpenses(Number(e.target.value))}
              placeholder="0"
              className="w-full pl-9 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-3xl font-extrabold text-slate-900 font-display tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
          </div>

          {/* Common expense quick add buttons */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-400">
              Common Store Expenses (Tap to add):
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickExpense('Stock / Wholesale', 6500)}
                className="px-2.5 py-1 text-xs font-medium bg-rose-50/60 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-all"
              >
                Stock / Wholesale ₹6,500
              </button>
              <button
                type="button"
                onClick={() => handleQuickExpense('Electricity / Rent', 1500)}
                className="px-2.5 py-1 text-xs font-medium bg-rose-50/60 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-all"
              >
                Electricity / Rent ₹1,500
              </button>
              <button
                type="button"
                onClick={() => handleQuickExpense('Staff Wages', 800)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all"
              >
                Staff ₹800
              </button>
              <button
                type="button"
                onClick={() => handleQuickExpense('Tea / Snacks', 200)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-all"
              >
                Tea / Misc ₹200
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Optional Daily Note */}
        <div className="card-tactile p-4 bg-white space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            <PenTool className="w-3.5 h-3.5 text-slate-500" />
            <span>Optional Daily Note (दैनिक विवरण)</span>
          </div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Stock purchase from APMC market, van delivery paid"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Card 4: Instant Live Profit Display Card */}
        <div
          className={`p-5 rounded-2xl border-2 transition-all ${
            isProfit
              ? 'bg-emerald-50/90 border-emerald-300 shadow-sm shadow-emerald-600/10'
              : 'bg-rose-50/90 border-rose-300 shadow-sm shadow-rose-600/10'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700">
              <Sparkles
                className={`w-4 h-4 ${isProfit ? 'text-emerald-700' : 'text-rose-700'}`}
              />
              <span>Instant Bottom Line</span>
            </div>
            <div
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                isProfit ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}
            >
              {isProfit ? 'Profitable Day 🟢' : 'Loss Day 🔴'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 text-xs border-b border-slate-200/60">
            <div>
              <span className="text-slate-500 font-medium">Total Sales</span>
              <div className="text-sm font-bold text-slate-800 tabular-nums">
                {formatINR(sales)}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Total Expenses</span>
              <div className="text-sm font-bold text-rose-700 tabular-nums">
                -{formatINR(expenses)}
              </div>
            </div>
          </div>

          {/* Big Profit Number */}
          <div className="pt-3 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isProfit ? "Today's Net Profit (शुद्ध लाभ)" : "Today's Net Loss (नुकसान)"}
              </span>
              <div
                className={`text-3xl sm:text-4xl font-extrabold font-display tabular-nums tracking-tight ${
                  isProfit ? 'text-emerald-800' : 'text-rose-700'
                }`}
              >
                {isProfit ? '+' : ''}
                {formatINR(netProfit)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-500 block">Profit Margin</span>
              <span
                className={`text-sm font-extrabold font-display ${
                  isProfit ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {profitMargin}%
              </span>
            </div>
          </div>
        </div>

        {/* Primary Save Button */}
        <button
          type="submit"
          className="w-full min-h-[56px] py-4 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-base tracking-wide flex flex-col items-center justify-center shadow-lg shadow-emerald-900/20 transition-all transform active:scale-[0.99] group"
        >
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span>Save Today's Entry (सुरक्षित करें)</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-100 opacity-90 mt-0.5">
            Saved locally to device • 1s instant offline record
          </span>
        </button>

        {/* Success Feedback banner */}
        {isSavedFeedback && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold animate-slide-up">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Record saved to local ledger for 26 Sep 2026!</span>
            </div>
            <button
              type="button"
              onClick={onGoToCalendar}
              className="text-emerald-800 underline font-bold flex items-center gap-0.5"
            >
              View Calendar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* On-device Security Promise */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% On-Device Financial Integrity • Private & Offline-First</span>
        </div>
      </form>
    </div>
  );
};
