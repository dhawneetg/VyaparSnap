import React from 'react';
import { Zap, Boxes, FileText, Calendar, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount = 0,
}) => {
  return (
    <nav className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-16 shadow-[0_-4px_16px_-4px_rgba(15,23,42,0.06)] px-1">
      <div className="max-w-md mx-auto h-full flex items-center justify-around">
        {/* Tab 1: 3-Tap Counter */}
        <button
          onClick={() => setActiveTab('counter')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'counter' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Zap className={`w-5 h-5 ${activeTab === 'counter' ? 'stroke-[2.5] fill-emerald-100' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-1 font-display">Counter</span>
        </button>

        {/* Tab 2: Stock Ledger */}
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'stock' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Boxes className={`w-5 h-5 ${activeTab === 'stock' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-1 font-display">Stock</span>
          {lowStockCount > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        {/* Tab 3: Daily Closing / Entry */}
        <button
          onClick={() => setActiveTab('entry')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'entry' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'entry' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-1 font-display">Closing</span>
        </button>

        {/* Tab 4: Monthly Calendar */}
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'calendar' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-1 font-display">Calendar</span>
        </button>

        {/* Tab 5: Customer Khata */}
        <button
          onClick={() => setActiveTab('khata')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'khata' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'khata' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold mt-1 font-display">Khata</span>
        </button>
      </div>
    </nav>
  );
};
