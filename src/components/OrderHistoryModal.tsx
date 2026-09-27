import React, { useState } from 'react';
import {
  X,
  Search,
  Share2,
  Printer,
  Trash2,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Receipt,
} from 'lucide-react';
import { SaleTransaction, StoreProfile } from '../types';
import { formatINR } from '../utils/storage';
import { BillReceiptModal } from './BillReceiptModal';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: SaleTransaction[];
  profile: StoreProfile;
  onVoidTransaction: (transactionId: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
  profile,
  onVoidTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'CASH' | 'UPI' | 'KHATA'>('ALL');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<SaleTransaction | null>(null);

  if (!isOpen) return null;

  const filteredTransactions = transactions.filter((tx) => {
    if (filterMode !== 'ALL' && tx.paymentMode !== filterMode) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesBillNo = String(tx.billNo).includes(q);
    const matchesCustomer = (tx.customerName || '').toLowerCase().includes(q) ||
      (tx.customerPhone || '').includes(q);
    const matchesItems = tx.cart.some((item) => item.name.toLowerCase().includes(q));

    return matchesBillNo || matchesCustomer || matchesItems;
  });

  const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);

  const handleShareWhatsApp = (tx: SaleTransaction) => {
    const receiptLines = tx.cart
      .map((i) => `• ${i.qty}x ${i.name} — ₹${i.price * i.qty}`)
      .join('\n');
    const discountText = tx.discount ? `\nDiscount / Round-off: -₹${tx.discount}` : '';
    const billText = `🧾 *${profile.storeName.toUpperCase()}*\nBill #${tx.billNo} • ${new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}\n--------------------------------\n${receiptLines}\n--------------------------------${discountText}\n*TOTAL: ₹${tx.total}*\nPayment Mode: ${tx.paymentMode} ✅\n\nThank you for shopping with us! 🙏`;

    const cleanPhone = (tx.customerPhone || '').replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(billText)}`
      : `https://wa.me/?text=${encodeURIComponent(billText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-slide-up">
        <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold font-display leading-tight">
                  Today's Order History & Bills
                </h3>
                <p className="text-xs text-slate-400">
                  Reprint bills, resend WhatsApp receipts & void sales
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* KPI Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Total Bills</span>
                <span className="font-extrabold text-sm text-slate-900 font-display">
                  {filteredTransactions.length} Orders
                </span>
              </div>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <span className="text-slate-500 block text-[11px]">Total Value</span>
                <span className="font-extrabold text-sm text-emerald-700 font-display">
                  {formatINR(totalRevenue)}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Auto-restores stock on void
            </span>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Bill #, Customer Name, Mobile, or Item..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {(['ALL', 'CASH', 'UPI', 'KHATA'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    filterMode === mode
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mode === 'ALL' && 'All Modes'}
                  {mode === 'CASH' && '💵 Cash'}
                  {mode === 'UPI' && '📱 UPI'}
                  {mode === 'KHATA' && '📒 Khata Credit'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {filteredTransactions.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Receipt className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-bold text-slate-600">No orders found</p>
                <p className="text-xs text-slate-400">
                  {searchQuery ? 'Try changing your search terms.' : 'Sales made at the Express Counter will appear here.'}
                </p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const formattedTime = new Date(tx.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs space-y-3 transition-all"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 font-display">
                          Bill #{tx.billNo}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • {formattedTime}
                        </span>
                        {/* Payment mode badge */}
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            tx.paymentMode === 'CASH'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.paymentMode === 'UPI'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tx.paymentMode === 'CASH' ? '💵 Cash' : tx.paymentMode === 'UPI' ? '📱 UPI' : '📒 Khata'}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-base text-slate-900 font-display tabular-nums">
                          {formatINR(tx.total)}
                        </div>
                        {tx.discount ? (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            (Saved ₹{tx.discount})
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Customer info if provided */}
                    {(tx.customerName || tx.customerPhone) && (
                      <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-flex items-center gap-2">
                        <span className="text-slate-400">Customer:</span>
                        <span className="font-bold text-slate-800">{tx.customerName || 'Walk-in'}</span>
                        {tx.customerPhone && (
                          <span className="text-slate-500 font-mono text-[11px]">
                            ({tx.customerPhone})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Items chips */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                      {tx.cart.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          {item.qty}x {item.name}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Resend */}
                        <button
                          type="button"
                          onClick={() => handleShareWhatsApp(tx)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                          title="Resend WhatsApp Bill"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Resend</span>
                        </button>

                        {/* Thermal Print Preview */}
                        <button
                          type="button"
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
                          title="Reprint or view thermal receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>Print Bill</span>
                        </button>
                      </div>

                      {/* Void Sale */}
                      <button
                        type="button"
                        onClick={() => onVoidTransaction(tx.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors ml-auto"
                        title="Void this sale and restore stock"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Void Sale (रद्द करें)</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Bill Receipt Modal */}
      {selectedTxForReceipt && (
        <BillReceiptModal
          isOpen={Boolean(selectedTxForReceipt)}
          onClose={() => setSelectedTxForReceipt(null)}
          transaction={selectedTxForReceipt}
          profile={profile}
        />
      )}
    </>
  );
};
