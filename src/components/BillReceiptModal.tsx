import React from 'react';
import { X, Share2, Printer, CheckCircle } from 'lucide-react';
import { SaleTransaction, StoreProfile } from '../types';
import { formatINR } from '../utils/storage';

interface BillReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: SaleTransaction | null;
  profile: StoreProfile;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  profile,
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(transaction.timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(transaction.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const receiptLines = transaction.cart
    .map((i) => `• ${i.qty}x ${i.name} — ₹${i.price * i.qty}`)
    .join('\n');

  const discountText = transaction.discount ? `\nDiscount / Round-off: -₹${transaction.discount}` : '';
  const billText = `🧾 *${profile.storeName.toUpperCase()}*\nBill #${transaction.billNo} • ${formattedDate} ${formattedTime}\n${profile.address ? profile.address + '\n' : ''}--------------------------------\n${receiptLines}\n--------------------------------${discountText}\n*TOTAL PAID: ₹${transaction.total}*\nPayment Mode: ${transaction.paymentMode} ✅\n\nThank you for shopping with us! 🙏`;

  const handleShareWhatsApp = () => {
    const cleanPhone = (transaction.customerPhone || '').replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(billText)}`
      : `https://wa.me/?text=${encodeURIComponent(billText)}`;
    window.open(waUrl, '_blank');
  };

  const subtotal = transaction.cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold font-display">Thermal Bill Receipt</span>
            <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
              #{transaction.billNo}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Thermal Receipt Container */}
        <div className="p-6 bg-slate-50 overflow-y-auto space-y-4 font-mono text-xs text-slate-800 border-b border-dashed border-slate-300">
          <div className="text-center space-y-1">
            <div className="font-extrabold text-base tracking-wider font-display uppercase text-slate-900">
              {profile.storeName}
            </div>
            {profile.ownerName && (
              <div className="text-[11px] text-slate-500">Prop: {profile.ownerName}</div>
            )}
            {profile.address && (
              <div className="text-[11px] text-slate-500">{profile.address}</div>
            )}
            {profile.phone && (
              <div className="text-[11px] text-slate-500">Ph: {profile.phone}</div>
            )}
            <div className="text-[11px] text-slate-600 font-bold pt-1">
              Bill #{transaction.billNo} • {formattedDate} {formattedTime}
            </div>
          </div>

          {/* Customer info if present */}
          {(transaction.customerName || transaction.customerPhone) && (
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5 text-[11px]">
              {transaction.customerName && (
                <div>
                  <span className="text-slate-400">Customer: </span>
                  <span className="font-bold text-slate-800">{transaction.customerName}</span>
                </div>
              )}
              {transaction.customerPhone && (
                <div>
                  <span className="text-slate-400">Phone: </span>
                  <span className="font-bold text-slate-800">{transaction.customerPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Itemized Table */}
          <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2">
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Amt (₹)</span>
            </div>

            {transaction.cart.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center text-xs">
                <span className="col-span-6 font-bold text-slate-900 truncate pr-1">
                  {item.name}
                </span>
                <span className="col-span-2 text-center text-slate-600 font-bold">
                  {item.qty}
                </span>
                <span className="col-span-4 text-right font-extrabold text-slate-900 tabular-nums">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          {/* Bill Totals */}
          <div className="space-y-1.5 text-xs">
            {transaction.discount ? (
              <>
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount / Round-off</span>
                  <span>-₹{transaction.discount}</span>
                </div>
              </>
            ) : null}

            <div className="flex justify-between items-center text-base font-extrabold font-display border-t border-slate-300 pt-2 text-slate-900">
              <span>NET TOTAL</span>
              <span className="text-emerald-800 text-lg tabular-nums">
                {formatINR(transaction.total)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600 pt-1">
              <span>Payment Mode</span>
              <span className="font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {transaction.paymentMode === 'CASH'
                  ? '💵 CASH'
                  : transaction.paymentMode === 'UPI'
                  ? '📱 UPI'
                  : '📒 KHATA'}
              </span>
            </div>
          </div>

          <div className="text-center space-y-1 pt-3 border-t border-dashed border-slate-300 text-[11px] text-slate-500">
            <p className="font-medium">Thank you for your visit!</p>
            <p className="text-[10px] text-slate-400">VyaparSnap Smart POS</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Bill</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-200" />
            <span>WhatsApp Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
