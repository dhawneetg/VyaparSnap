import React from 'react';
import {
  TrendingUp,
  Award,
  PieChart,
  Calendar,
  Wallet,
  QrCode,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { MonthlyStats, DailyEntry } from '../types';
import { formatINR, exportLedgerToCSV } from '../utils/storage';

interface AnalyticsViewProps {
  stats: MonthlyStats;
  entries: Record<string, DailyEntry>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, entries }) => {
  const weekData = [
    { name: 'Week 1 (1–7 Sep)', sales: 67000, expenses: 31000, profit: 36000, days: 7 },
    { name: 'Week 2 (8–14 Sep)', sales: 65500, expenses: 31000, profit: 34500, days: 7 },
    { name: 'Week 3 (15–21 Sep)', sales: 72000, expenses: 30800, profit: 41200, days: 7 },
    { name: 'Week 4 (22–26 Sep)', sales: 54500, expenses: 25300, profit: 29200, days: 5 },
  ];

  // Prepare 26-day profit curve points for SVG Sparkline
  const sortedDates = Object.keys(entries).sort();
  const profits = sortedDates.map((d) => entries[d].sales - entries[d].expenses);
  const maxProfit = Math.max(...profits, 10000);
  const minProfit = Math.min(...profits, -2000);
  const range = maxProfit - minProfit || 1;

  const svgWidth = 800;
  const svgHeight = 200;
  const padding = 20;

  const points = profits
    .map((p, idx) => {
      const x = padding + (idx / (profits.length - 1 || 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((p - minProfit) / range) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const zeroY = svgHeight - padding - ((0 - minProfit) / range) * (svgHeight - padding * 2);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Executive Ledger Telemetry
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            September 2026 Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic profit velocity, expense allocation, and audit exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportLedgerToCSV(entries)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Interactive 30-Day SVG Profit Trend Curve */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-900">
              Daily Net Profit Trajectory (30-Day Curve)
            </h3>
            <p className="text-xs text-slate-500">Continuous profit telemetry across September</p>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Peak: +₹9,200 (Day 22)
          </span>
        </div>

        {/* SVG Sparkline */}
        <div className="w-full overflow-x-auto bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
            {/* Zero Baseline */}
            <line
              x1={padding}
              y1={zeroY}
              x2={svgWidth - padding}
              y2={zeroY}
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x={padding} y={zeroY - 6} fill="#94A3B8" fontSize="10" fontWeight="bold">
              ₹0 Break-Even Line
            </text>

            {/* Profit Curve */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Data Dots */}
            {profits.map((p, idx) => {
              const x = padding + (idx / (profits.length - 1 || 1)) * (svgWidth - padding * 2);
              const y = svgHeight - padding - ((p - minProfit) / range) * (svgHeight - padding * 2);
              const isLoss = p < 0;
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLoss ? '5' : '4'}
                    fill={isLoss ? '#E11D48' : '#059669'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
          <span>Day 1 (1 Sep)</span>
          <span>Day 13 (Mid-Month)</span>
          <span>Day 26 (Today)</span>
        </div>
      </div>

      {/* Grid: Benchmarks & KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Highest Sales Day */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Monthly Benchmark</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xs text-slate-500 block">🏆 Highest Sales Day</span>
          <div className="text-2xl font-extrabold font-display text-slate-900 tabular-nums">
            {formatINR(stats.highestSalesDay.amount)}
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            {stats.highestSalesDay.date} (Festival Rush)
          </span>
        </div>

        {/* Most Profitable Day */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Profit Peak</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xs text-slate-500 block">📈 Most Profitable Day</span>
          <div className="text-2xl font-extrabold font-display text-emerald-800 tabular-nums">
            +{formatINR(stats.mostProfitableDay.amount)}
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            {stats.mostProfitableDay.date} (High Margin)
          </span>
        </div>

        {/* Habit Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Logging Discipline</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xs text-slate-500 block">🔥 Logging Consistency</span>
          <div className="text-2xl font-extrabold font-display text-slate-900 tabular-nums">
            {stats.totalDaysLogged} / 26 Days
          </div>
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
            100% Perfect Habit Streak
          </span>
        </div>
      </div>

      {/* 2-Column: Expense Allocation & Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Expense Allocation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Expense Allocation
              </h3>
              <p className="text-xs text-slate-500">Distribution of ₹1,12,000 monthly outlays</p>
            </div>
            <PieChart className="w-5 h-5 text-rose-600" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Wholesale Goods & Stock</span>
                <span>68% (₹76,160)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Shop Rent & Electricity Bills</span>
                <span>18% (₹20,160)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Staff Wages, Misc & Supplies</span>
                <span>14% (₹15,680)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Channels (Cash vs UPI) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Payment Channel Split
              </h3>
              <p className="text-xs text-slate-500">Customer settlement methods</p>
            </div>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Wallet className="w-4 h-4 text-emerald-700" />
                <span>Cash Collection</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-950 font-display tabular-nums mt-1">
                58%
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                ₹1,24,930 in drawer
              </span>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                <QrCode className="w-4 h-4 text-blue-700" />
                <span>UPI / QR Digital</span>
              </div>
              <div className="text-xl font-extrabold text-blue-950 font-display tabular-nums mt-1">
                42%
              </div>
              <span className="text-[11px] text-blue-700 font-semibold mt-0.5 block">
                ₹90,470 via bank QR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-display font-extrabold text-base text-slate-900">
          Weekly Performance Velocity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Timeframe</th>
                <th className="py-2.5">Trading Days</th>
                <th className="py-2.5">Gross Sales</th>
                <th className="py-2.5">Expenses</th>
                <th className="py-2.5 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {weekData.map((wk) => (
                <tr key={wk.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-bold text-slate-900">{wk.name}</td>
                  <td className="py-3 text-slate-600">{wk.days} days</td>
                  <td className="py-3 font-semibold text-slate-800 tabular-nums">
                    {formatINR(wk.sales)}
                  </td>
                  <td className="py-3 text-rose-700 tabular-nums">-{formatINR(wk.expenses)}</td>
                  <td className="py-3 text-right font-extrabold text-emerald-800 tabular-nums">
                    +{formatINR(wk.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
