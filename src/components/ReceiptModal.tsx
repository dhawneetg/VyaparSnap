import React from 'react';
import { X, Share2, Printer, CheckCircle } from 'lucide-react';
import { DailyEntry, StoreProfile } from '../types';
import { formatINR } from '../utils/storage';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DailyEntry | null;
  profile?: StoreProfile;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, entry, profile }) => {
  if (!isOpen || !entry) return null;

  const netProfit = entry.sales - entry.expenses;
  const isProfit = netProfit >= 0;
  const currentStoreName = profile?.storeName || 'Ramesh Kirana Store';

  const handleShareWhatsApp = () => {
    const text = `📊 *VYAPARSNAP DAILY STATEMENT*\nStore: ${currentStoreName}\nDate: ${entry.date}\n--------------------------\n💰 Gross Sales: ${formatINR(entry.sales)}\n  • Cash: ${formatINR(entry.cashSales || Math.round(entry.sales * 0.6))}\n  • UPI: ${formatINR(entry.upiSales || Math.round(entry.sales * 0.4))}\n📤 Expenses: ${formatINR(entry.expenses)}\n--------------------------\n${isProfit ? '✅ NET PROFIT' : '⚠️ NET LOSS'}: ${formatINR(netProfit)}\nNote: ${entry.notes || 'Routine trading'}\n--------------------------\nGenerated via VyaparSnap Ledger`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold font-display">Daily Financial Slip</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="p-6 bg-slate-50 space-y-4 font-mono text-xs text-slate-800 border-b border-dashed border-slate-300">
          <div className="text-center space-y-1">
            <div className="font-extrabold text-sm tracking-wider font-display uppercase">
              {currentStoreName}
            </div>
            <div className="text-[11px] text-slate-500">
              {profile?.ownerName ? `Owner: ${profile.ownerName}` : 'APMC Market Road, Sector 4'}
            </div>
            <div className="text-[11px] text-slate-500">Date: {entry.date}</div>
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>GROSS SALES</span>
              <span>{formatINR(entry.sales)}</span>
            </div>
            <div className="flex justify-between text-slate-500 pl-2">
              <span>• Cash Drawer</span>
              <span>{formatINR(entry.cashSales || Math.round(entry.sales * 0.6))}</span>
            </div>
            <div className="flex justify-between text-slate-500 pl-2">
              <span>• UPI QR</span>
              <span>{formatINR(entry.upiSales || Math.round(entry.sales * 0.4))}</span>
            </div>
            <div className="flex justify-between font-bold text-rose-700 pt-1">
              <span>TOTAL EXPENSES</span>
              <span>-{formatINR(entry.expenses)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-extrabold font-display">
            <span>NET PROFIT/LOSS</span>
            <span className={isProfit ? 'text-emerald-700' : 'text-rose-700'}>
              {isProfit ? '+' : ''}
              {formatINR(netProfit)}
            </span>
          </div>

          {entry.notes && (
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Note: {entry.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-4 h-4 text-emerald-200" />
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
