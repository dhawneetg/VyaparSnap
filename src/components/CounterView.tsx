import React, { useState } from 'react';
import {
  Zap,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Share2,
  Banknote,
  QrCode,
  CheckCircle,
  Search,
  BookOpen,
  Volume2,
  Sparkles,
  Calculator,
  Delete,
  Edit2,
  PackagePlus,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { Product, CartItem, StoreProfile } from '../types';
import { formatINR } from '../utils/storage';
import { playCashRegisterChime, speakSoundboxAnnouncement } from '../utils/audio';
import { ProductFormModal } from './ProductFormModal';

interface CounterViewProps {
  products: Product[];
  profile: StoreProfile;
  onCompleteSale: (
    total: number,
    mode: 'CASH' | 'UPI' | 'KHATA',
    cart: CartItem[],
    customerName?: string,
    customerPhone?: string
  ) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const CounterView: React.FC<CounterViewProps> = ({
  products,
  profile,
  onCompleteSale,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customAmount, setCustomAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'KHATA'>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);
  const [soundboxEnabled, setSoundboxEnabled] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleKeypadPress = (val: string) => {
    if (val === 'CLEAR') {
      setCustomAmount('');
    } else if (val === 'BACK') {
      const current = String(customAmount || '');
      const next = current.slice(0, -1);
      setCustomAmount(next ? Number(next) : '');
    } else {
      const current = String(customAmount || '');
      const next = current + val;
      if (Number(next) <= 99999) {
        setCustomAmount(Number(next));
      }
    }
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))).filter(Boolean)];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddItem = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          icon: product.icon,
        },
      ];
    });
  };

  const handleAddCustomAmount = (amt: number) => {
    if (amt <= 0) return;
    setCart((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: `Ad-hoc Item (₹${amt})`,
        price: amt,
        qty: 1,
        icon: '🏷️',
      },
    ]);
    setCustomAmount('');
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const next = i.qty + delta;
            return next > 0 ? { ...i, qty: next } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => setCart([]);

  const executeSale = (dispatchWhatsApp: boolean = false) => {
    if (totalAmount <= 0) return;

    // Trigger audio & soundbox
    if (soundboxEnabled) {
      playCashRegisterChime();
      speakSoundboxAnnouncement(totalAmount, 'hi');
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#10B981', '#34D399'],
      });
    } catch (e) {
      // safe fallback
    }

    // Format WhatsApp bill if requested
    if (dispatchWhatsApp) {
      const receiptLines = cart.map((i) => `• ${i.qty}x ${i.name} — ₹${i.price * i.qty}`).join('\n');
      const billText = `🧾 *${profile.storeName.toUpperCase()}*\nDate: 26 Sep 2026\n--------------------------\n${receiptLines}\n--------------------------\n*TOTAL BILL: ₹${totalAmount}*\nPayment Mode: ${paymentMode} ✅\n\nThank you for shopping with us! 🙏`;
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const waUrl = cleanPhone
        ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(billText)}`
        : `https://wa.me/?text=${encodeURIComponent(billText)}`;
      window.open(waUrl, '_blank');
    }

    onCompleteSale(totalAmount, paymentMode, cart, customerName, customerPhone);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setShowUpiQrModal(false);
  };

  // Standard NPCI UPI payload with dynamic store UPI ID
  const cleanStoreName = profile.storeName.replace(/[^a-zA-Z0-9]/g, '');
  const upiPayload = `upi://pay?pa=${profile.upiVpa}&pn=${cleanStoreName || 'VyaparMerchant'}&am=${totalAmount}&cu=INR&tn=Bill-${Date.now().toString().slice(-4)}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 animate-slide-up space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span>3-Tap Express Counter</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              LIVE POS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap items to build basket • 1-tap WhatsApp bill • Auto-stock deduction
          </p>
        </div>

        {/* Soundbox Toggle */}
        <button
          onClick={() => setSoundboxEnabled(!soundboxEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            soundboxEnabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
          title="Virtual Hindi/English Soundbox Voice"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Soundbox: {soundboxEnabled ? 'ON 🔊' : 'OFF 🔇'}</span>
        </button>
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Product Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search milk, atta, oil, biscuits, soap..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Pills & Add Item Button */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Direct Add Product Trigger on Counter */}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold whitespace-nowrap shadow-xs text-xs transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Item (सामान जोड़ें)</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Quick Add Product Dashed Tile */}
            <div
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="p-3 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[110px] group active:scale-95 shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center text-emerald-800 mb-1 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xs text-emerald-950">+ Add Item</span>
              <span className="text-[10px] text-emerald-700 font-semibold">नया सामान जोड़ें</span>
            </div>

            {filteredProducts.map((p) => {
              const isOutOfStock = p.stockQty === 0;
              const isLowStock = p.stockQty > 0 && p.stockQty < 10;

              return (
                <div
                  key={p.id}
                  className={`group relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all select-none ${
                    isOutOfStock
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-2xl cursor-pointer active:scale-110 transition-transform"
                        onClick={() => !isOutOfStock && handleAddItem(p)}
                      >
                        {p.icon}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isOutOfStock
                              ? 'bg-rose-100 text-rose-800'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stockQty} {p.unit}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Edit price/name or delete item (सामान बदलें/हटाएं)"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div
                      onClick={() => !isOutOfStock && handleAddItem(p)}
                      className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight cursor-pointer hover:text-emerald-800"
                    >
                      {p.name}
                    </div>
                  </div>

                  <div
                    onClick={() => !isOutOfStock && handleAddItem(p)}
                    className="mt-3 flex items-center justify-between cursor-pointer pt-1"
                  >
                    <span className="text-base font-extrabold text-emerald-800 font-display tabular-nums">
                      ₹{p.price}
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                      +
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Amount Keypad */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Quick Custom ₹ Amount (अन्य सामान)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowKeypad(!showKeypad)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
              >
                {showKeypad ? 'Hide Touch Pad ✕' : 'Open Touch Pad ⌨️'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  placeholder="Enter custom ₹..."
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  onKeyDown={(e) => e.key === 'Enter' && customAmount && handleAddCustomAmount(Number(customAmount))}
                />
              </div>

              <button
                type="button"
                onClick={() => customAmount && handleAddCustomAmount(Number(customAmount))}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                Add to Cart
              </button>
            </div>

            {/* Rapid 48px Touch Keypad for Single-Handed Operation */}
            {showKeypad && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 animate-slide-up">
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="min-h-[48px] bg-white hover:bg-slate-100 active:bg-emerald-100 rounded-xl border border-slate-200 text-base font-bold text-slate-800 shadow-sm transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('CLEAR')}
                    className="min-h-[48px] bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold transition-all"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="min-h-[48px] bg-white hover:bg-slate-100 active:bg-emerald-100 rounded-xl border border-slate-200 text-base font-bold text-slate-800 shadow-sm transition-all"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('BACK')}
                    className="min-h-[48px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl border border-slate-200 flex items-center justify-center transition-all"
                    title="Backspace"
                  >
                    <Delete className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Shortcut Chips */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => handleAddCustomAmount(10)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-200"
              >
                +₹10
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomAmount(20)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-200"
              >
                +₹20
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomAmount(50)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-200"
              >
                +₹50
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomAmount(100)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-200"
              >
                +₹100
              </button>
              <button
                type="button"
                onClick={() => handleAddCustomAmount(200)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-200"
              >
                +₹200
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Active Ticket & Checkout (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20">
            {/* Ticket Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Current Basket ({cart.length})
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Cart Line Items */}
            <div className="min-h-[160px] max-h-[260px] overflow-y-auto divide-y divide-slate-100">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                  <span className="text-2xl block">🛒</span>
                  <p>Counter ticket is empty.</p>
                  <p className="text-[11px] text-slate-400">Tap items on the left to add.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon || '📦'}</span>
                      <div>
                        <div className="font-bold text-slate-800 leading-tight">{item.name}</div>
                        <div className="text-[11px] text-slate-400">
                          ₹{item.price} each
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900 font-display">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center shadow-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 font-display tabular-nums w-14 text-right">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Display */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-800 block">
                  Total Payable Amount
                </span>
                <span className="text-3xl font-extrabold font-display text-emerald-950 tabular-nums">
                  {formatINR(totalAmount)}
                </span>
              </div>
              <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                {cart.reduce((s, i) => s + i.qty, 0)} Items
              </span>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMode('CASH')}
                  className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMode === 'CASH'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>💵 Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMode('UPI');
                    if (totalAmount > 0) setShowUpiQrModal(true);
                  }}
                  className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMode === 'UPI'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>📱 UPI QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('KHATA')}
                  className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    paymentMode === 'KHATA'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📒 Khata / Credit</span>
                </button>
              </div>
            </div>

            {/* Customer Details for Receipt or Khata */}
            <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={paymentMode === 'KHATA' ? 'Customer Name (Required)' : 'Customer Name (Optional)'}
                  className={`px-3 py-2 bg-slate-50 border rounded-xl font-medium ${
                    paymentMode === 'KHATA' && !customerName ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200'
                  }`}
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="WhatsApp Mobile (Optional)"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={totalAmount <= 0}
                onClick={() => executeSale(false)}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                Complete Sale (Done)
              </button>

              <button
                type="button"
                disabled={totalAmount <= 0}
                onClick={() => executeSale(true)}
                className="py-3 px-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>WhatsApp Bill & Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic UPI QR Code Modal */}
      {showUpiQrModal && totalAmount > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 animate-slide-up">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Scan & Pay via any UPI App
              </span>
              <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                Ramesh Kirana Store
              </h3>
              <div className="text-3xl font-extrabold text-emerald-800 font-display tabular-nums mt-1">
                {formatINR(totalAmount)}
              </div>
            </div>

            {/* Actual Scannable UPI QR Code */}
            <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner inline-block">
              <QRCodeSVG
                value={upiPayload}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Customer can scan with GPay, PhonePe, Paytm, or BHIM.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowUpiQrModal(false)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => executeSale(false)}
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Payment Received ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        existingCategories={categories.filter((c) => c !== 'All')}
        onSave={(savedProd) => {
          if (editingProduct) {
            onUpdateProduct(savedProd);
          } else {
            onAddProduct(savedProd);
          }
        }}
        onDelete={onDeleteProduct}
      />
    </div>
  );
};
