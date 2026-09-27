import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Package,
  Phone,
  Truck,
} from 'lucide-react';
import { Product, StoreProfile } from '../types';

interface WholesaleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  profile: StoreProfile;
}

interface ReorderItem {
  product: Product;
  orderQty: number;
  isSelected: boolean;
}

export const WholesaleOrderModal: React.FC<WholesaleOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  profile,
}) => {
  const [supplierName, setSupplierName] = useState('Distributor / Wholesale Supplier');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize reorder items with all items where stockQty < 10
  const [reorderList, setReorderList] = useState<ReorderItem[]>(() => {
    const lowStock = products.filter((p) => p.stockQty < 10);
    return lowStock.map((p) => ({
      product: p,
      // Default suggested reorder quantity based on packaging
      orderQty: p.stockQty === 0 ? 30 : 20,
      isSelected: true,
    }));
  });

  const [selectedAddProductId, setSelectedAddProductId] = useState<string>('');

  if (!isOpen) return null;

  const handleToggleItem = (productId: string) => {
    setReorderList((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setReorderList((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const next = Math.max(1, item.orderQty + delta);
          return { ...item, orderQty: next };
        }
        return item;
      })
    );
  };

  const handleRemoveFromList = (productId: string) => {
    setReorderList((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleAddManualProduct = () => {
    if (!selectedAddProductId) return;
    const prod = products.find((p) => p.id === selectedAddProductId);
    if (!prod) return;

    if (reorderList.some((item) => item.product.id === prod.id)) {
      // Already in list, ensure selected
      setReorderList((prev) =>
        prev.map((item) => (item.product.id === prod.id ? { ...item, isSelected: true } : item))
      );
    } else {
      setReorderList((prev) => [
        ...prev,
        {
          product: prod,
          orderQty: 24,
          isSelected: true,
        },
      ]);
    }
    setSelectedAddProductId('');
  };

  const selectedItems = reorderList.filter((item) => item.isSelected);

  // Format the WhatsApp Purchase Order message
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const lines = selectedItems.map((item, idx) => {
    const statusEmoji = item.product.stockQty === 0 ? '🔴 [Khatam]' : '🟡 [Low]';
    return `${idx + 1}. *${item.product.name}* — ${item.orderQty} ${item.product.unit || 'units'} (${statusEmoji} Stock: ${item.product.stockQty})`;
  });

  const messageText = `📋 *PURCHASE ORDER (सामान की पर्ची)*\n*${profile.storeName.toUpperCase()}*\nDate: ${todayStr}\nSupplier: ${supplierName}\n----------------------------------\n${lines.join('\n')}\n----------------------------------\nTotal Items: ${selectedItems.length}\n*कृपया यह माल आज शाम तक भिजवा दें।*\nAddress: ${profile.address || 'Market Shop'}\nContact: ${profile.ownerName ? profile.ownerName + ' - ' : ''}${profile.phone || ''}\n\nSent via VyaparSnap`;

  const handleSendWhatsApp = () => {
    const cleanPhone = supplierPhone.replace(/\D/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-slide-up">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold font-display leading-tight">
                Wholesale Supplier Reorder Slip
              </h3>
              <p className="text-xs text-slate-400">
                1-tap formatted purchase order for your distributor on WhatsApp
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

        {/* Supplier Info Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Supplier / Agency Name
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. Laxmi Traders / Patanjali Agency"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Supplier WhatsApp Mobile (Optional)
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Add Item Row */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAddProductId}
              onChange={(e) => setSelectedAddProductId(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">+ Add any catalog product to this order slip...</option>
              {products
                .filter((p) => !reorderList.some((item) => item.product.id === p.id && item.isSelected))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stockQty} {p.unit})
                  </option>
                ))}
            </select>
            <button
              type="button"
              disabled={!selectedAddProductId}
              onClick={handleAddManualProduct}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Item
            </button>
          </div>

          {/* Low Stock Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
              <span>Items to Order ({selectedItems.length} selected)</span>
              <span>Need Quantity</span>
            </div>

            {reorderList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                All inventory levels are healthy! You can add products manually above.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {reorderList.map((item) => (
                  <div
                    key={item.product.id}
                    className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                      item.isSelected ? 'bg-white' : 'bg-slate-50/70 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleToggleItem(item.product.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-base">{item.product.icon || '📦'}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`font-semibold ${
                              item.product.stockQty === 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          >
                            Current: {item.product.stockQty} {item.product.unit || 'units'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">MRP ₹{item.product.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    {item.isSelected && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.product.id, -5)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs"
                            title="-5"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900 font-display tabular-nums">
                            {item.orderQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.product.id, 5)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs"
                            title="+5"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.product.unit || 'pcs'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromList(item.product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                          title="Remove from slip"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slip Preview Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              WhatsApp Message Preview:
            </span>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {messageText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Slip'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={handleSendWhatsApp}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-900/10 transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>Send via WhatsApp 📲</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
