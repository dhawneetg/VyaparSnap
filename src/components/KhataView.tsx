import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Share2,
  CheckCircle,
  Clock,
  User,
  Phone,
  Banknote,
  Search,
  X,
  Send,
} from 'lucide-react';
import { KhataRecord } from '../types';
import { formatINR } from '../utils/storage';

interface KhataViewProps {
  khataRecords: KhataRecord[];
  onAddKhata: (record: Omit<KhataRecord, 'id'>) => void;
  onSettleKhata: (id: string) => void;
}

export const KhataView: React.FC<KhataViewProps> = ({
  khataRecords,
  onAddKhata,
  onSettleKhata,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const pendingRecords = khataRecords.filter((r) => !r.isSettled);
  const settledRecords = khataRecords.filter((r) => r.isSettled);

  const totalOutstanding = pendingRecords.reduce((sum, r) => sum + r.amount, 0);

  const filteredPending = pendingRecords.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery)
  );

  const handleSendWhatsAppReminder = (record: KhataRecord) => {
    const upiLink = `upi://pay?pa=rameshkirana@okhdfcbank&pn=RameshKirana&am=${record.amount}&cu=INR`;
    const message = `Namaste ${record.customerName} ji 🙏\nThis is a friendly reminder from *Ramesh Kirana Store*.\n\nYour pending store credit balance is *${formatINR(record.amount)}* for purchases on ${record.date} (${record.notes}).\n\nYou can pay directly via UPI: ${upiLink}\nOr scan the QR at our counter.\n\nThank you!`;
    const cleanPhone = record.customerPhone.replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCreateKhata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;

    onAddKhata({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || 'Store credit purchase',
      isSettled: false,
    });

    setIsAddModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setAmount('');
    setNotes('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>Customer Khata (उधार बही खाता)</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              CREDIT LEDGER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer pending credits • 1-tap WhatsApp payment reminders with UPI link
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-amber-900/10 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>+ Add Customer Udhar (उधार जोड़ें)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/30">
          <span className="text-xs font-bold uppercase text-amber-800 block">Total Pending Credit</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-display tabular-nums mt-1">
            {formatINR(totalOutstanding)}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">To be collected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Pending Customers</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums mt-1">
            {pendingRecords.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Active credit accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Settled This Month</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-display tabular-nums mt-1">
            {settledRecords.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Cleared bills</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name or phone..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
          Showing {filteredPending.length} pending records
        </span>
      </div>

      {/* Outstanding Khata Cards List */}
      <div className="space-y-3">
        <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-wider">
          Pending Customer Accounts
        </h3>

        {filteredPending.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No pending credits found!
          </div>
        ) : (
          filteredPending.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900">
                    {record.customerName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {record.customerPhone || 'No Phone'}
                    </span>
                    <span>•</span>
                    <span>Since {record.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    "{record.notes}"
                  </p>
                </div>
              </div>

              {/* Amount and Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending Amount</span>
                  <div className="text-xl font-extrabold font-display text-amber-950 tabular-nums">
                    {formatINR(record.amount)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendWhatsAppReminder(record)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Send WhatsApp payment reminder with UPI link"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp Reminder</span>
                  </button>

                  <button
                    onClick={() => onSettleKhata(record.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Mark paid in cash/UPI"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Settled</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add New Khata */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Add Customer Udhar (नया उधार खाता)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKhata} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Name (ग्राहक का नाम)</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma, Verma Tailor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Mobile (WhatsApp Reminder)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pending Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="₹ 500"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-base"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Notes (सामान का विवरण)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 2x Atta, 1x Oil, Milk"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Record Credit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
