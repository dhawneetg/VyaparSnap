import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Share2,
  FileDown,
  Edit3,
  Trash2,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { DailyEntry, MonthlyStats } from '../types';
import { formatINR, formatCompactINR } from '../utils/storage';

interface CalendarViewProps {
  entries: Record<string, DailyEntry>;
  stats: MonthlyStats;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onEditEntry: (date: string) => void;
  onDeleteEntry: (date: string) => void;
  onShareWhatsApp: (entry: DailyEntry) => void;
  onDownloadPDF: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  stats,
  selectedDate,
  onSelectDate,
  onEditEntry,
  onDeleteEntry,
  onShareWhatsApp,
  onDownloadPDF,
}) => {
  // Calendar days for September 2026 (starts on Tuesday = Day index 2, 30 days)
  const daysInMonth = 30;
  const startDayOfWeek = 2; // Tuesday: 0=Sun, 1=Mon, 2=Tue
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const selectedEntry = entries[selectedDate];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Top Banner: Streak & Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <span>September 2026</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active Period
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <strong className="text-slate-800">{stats.totalDaysLogged} / {daysInMonth} Days Logged</strong> • 100% Habit Streak
          </p>
        </div>

        {/* Quick Month Metrics Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Profitable</span>
            <span className="text-base font-extrabold text-emerald-800 tabular-nums">
              {stats.profitableDaysCount} Days ({stats.totalDaysLogged ? Math.round((stats.profitableDaysCount / stats.totalDaysLogged) * 100) : 0}%)
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-rose-700 block">Loss Days</span>
            <span className="text-base font-extrabold text-rose-800 tabular-nums">
              {stats.lossDaysCount} Days
            </span>
          </div>
        </div>
      </div>

      {/* Main 7-Column Calendar Grid */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-slate-800">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <span>Monthly P&L Ledger Matrix</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Profit
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Loss
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Unlogged
            </span>
          </div>
        </div>

        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-[11px] font-extrabold text-slate-400 py-1 font-display tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before start of month (Sept 2026 starts on Tue = 2 empty cells) */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[64px] sm:min-h-[76px] rounded-xl bg-slate-50/40 border border-transparent opacity-30" />
          ))}

          {/* Days 1 to 30 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
            const entry = entries[dateStr];
            const isSelected = selectedDate === dateStr;

            let cellClass = 'bg-slate-50/70 border-slate-200 text-slate-400';
            let badgeText = '';
            let isProfit = false;

            if (entry) {
              const diff = entry.sales - entry.expenses;
              isProfit = diff >= 0;
              badgeText = formatCompactINR(diff);
              cellClass = isProfit
                ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/70 text-rose-900';
            }

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${cellClass} ${
                  isSelected ? 'ring-2 ring-emerald-600 ring-offset-2 border-emerald-500 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold font-display ${isSelected ? 'text-emerald-900 font-extrabold' : ''}`}>
                    {dayNum}
                  </span>
                  {entry && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isProfit ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                  )}
                </div>

                <div className="mt-1">
                  {entry ? (
                    <span
                      className={`text-[10px] sm:text-xs font-extrabold font-display tabular-nums tracking-tight block truncate ${
                        isProfit ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {badgeText}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-medium">Upcoming</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedEntry ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  {selectedDate}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    selectedEntry.sales >= selectedEntry.expenses
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedEntry.sales >= selectedEntry.expenses ? 'Profitable Day 🟢' : 'Loss Day 🔴'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedEntry.notes || 'No specific daily notes recorded'}
              </p>
            </div>

            {/* Net Day Pill */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Delta</span>
              <span
                className={`text-xl font-extrabold font-display tabular-nums ${
                  selectedEntry.sales >= selectedEntry.expenses ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {selectedEntry.sales >= selectedEntry.expenses ? '+' : ''}
                {formatINR(selectedEntry.sales - selectedEntry.expenses)}
              </span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Total Sales</span>
              <strong className="text-sm font-bold text-slate-800 tabular-nums">
                {formatINR(selectedEntry.sales)}
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Total Expenses</span>
              <strong className="text-sm font-bold text-rose-700 tabular-nums">
                -{formatINR(selectedEntry.expenses)}
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">Cash Drawer</span>
              <strong className="text-sm font-bold text-slate-700 tabular-nums">
                {formatINR(selectedEntry.cashSales || Math.round(selectedEntry.sales * 0.6))}
              </strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-medium block">UPI / QR Collection</span>
              <strong className="text-sm font-bold text-blue-700 tabular-nums">
                {formatINR(selectedEntry.upiSales || Math.round(selectedEntry.sales * 0.4))}
              </strong>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onEditEntry(selectedDate)}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Entry</span>
            </button>

            <button
              onClick={() => onShareWhatsApp(selectedEntry)}
              className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Share WhatsApp Slip</span>
            </button>

            <button
              onClick={() => onDeleteEntry(selectedDate)}
              className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors border border-transparent hover:border-rose-200"
              title="Delete this record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
          No entry recorded yet for {selectedDate}. Select a date above to view or tap "Today's Entry" to log it.
        </div>
      )}

      {/* September Month-to-Date Executive Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-900">
              September Executive Summary
            </h3>
            <p className="text-xs text-slate-500">Month-to-date cumulative store performance</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
            26 Days Logged
          </span>
        </div>

        {/* Big Profit Hero */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-700 block">
              Cumulative Net Profit (शुद्ध मुनाफा)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-900 tabular-nums">
              +{formatINR(stats.netProfit)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-emerald-700 block">Avg Profit Margin</span>
            <span className="text-base font-extrabold text-emerald-800 font-display">
              {stats.profitMarginPercent}%
            </span>
          </div>
        </div>

        {/* Totals Row */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Total Store Sales</span>
            <div className="text-base font-extrabold text-slate-900 font-display tabular-nums mt-0.5">
              {formatINR(stats.totalSales)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Avg {formatINR(stats.avgDailySales)} / day
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium block">Total Operating Expenses</span>
            <div className="text-base font-extrabold text-rose-700 font-display tabular-nums mt-0.5">
              {formatINR(stats.totalExpenses)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Avg {formatINR(stats.avgDailyExpenses)} / day
            </span>
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={onDownloadPDF}
          className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <FileDown className="w-4 h-4 text-emerald-200" />
          <span>Download Monthly PDF Summary (मासिक रिपोर्ट)</span>
        </button>
      </div>
    </div>
  );
};
