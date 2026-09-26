import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  PackagePlus,
  X,
} from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/storage';

interface StockLedgerViewProps {
  products: Product[];
  onUpdateStock: (productId: string, delta: number) => void;
  onAddProduct: (product: Product) => void;
}

export const StockLedgerView: React.FC<StockLedgerViewProps> = ({
  products,
  onUpdateStock,
  onAddProduct,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | 'RED' | 'YELLOW' | 'GREEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newStock, setNewStock] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<Product['category']>('Staples & Grains');
  const [newUnit, setNewUnit] = useState('pack');
  const [newIcon, setNewIcon] = useState('📦');

  const outOfStockCount = products.filter((p) => p.stockQty === 0).length;
  const lowStockCount = products.filter((p) => p.stockQty > 0 && p.stockQty < 10).length;
  const healthyCount = products.filter((p) => p.stockQty >= 10).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterState === 'RED') return p.stockQty === 0;
    if (filterState === 'YELLOW') return p.stockQty > 0 && p.stockQty < 10;
    if (filterState === 'GREEN') return p.stockQty >= 10;
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newTitle.trim(),
      price: Number(newPrice),
      stockQty: Number(newStock) || 0,
      category: newCategory,
      unit: newUnit,
      icon: newIcon || '📦',
      isFrequent: false,
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewStock('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Boxes className="w-5 h-5 text-emerald-600" />
              <span>Traffic-Light Stock Ledger</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              LIVE INVENTORY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded shelf monitor • 1-tap preset restock • Auto-decrement on counter sale
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-900/10 transition-all active:scale-95"
        >
          <PackagePlus className="w-4 h-4 text-emerald-200" />
          <span>+ Add New Product (नया सामान)</span>
        </button>
      </div>

      {/* Traffic Light Status KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilterState(filterState === 'RED' ? 'ALL' : 'RED')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterState === 'RED'
              ? 'bg-rose-100/80 border-rose-400 ring-2 ring-rose-500'
              : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> 🔴 Out of Stock
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 font-display tabular-nums mt-1">
            {outOfStockCount}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Critical items (0 units)</span>
        </button>

        <button
          onClick={() => setFilterState(filterState === 'YELLOW' ? 'ALL' : 'YELLOW')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterState === 'YELLOW'
              ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-500'
              : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 🟡 Low Stock
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-display tabular-nums mt-1">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Under 10 units left</span>
        </button>

        <button
          onClick={() => setFilterState(filterState === 'GREEN' ? 'ALL' : 'GREEN')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterState === 'GREEN'
              ? 'bg-emerald-100/80 border-emerald-400 ring-2 ring-emerald-500'
              : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> 🟢 Safe Stock
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-display tabular-nums mt-1">
            {healthyCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Adequate quantity</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-slate-400 mr-1 text-[11px]">Filter:</span>
          {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterState(status)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterState === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Items' : status === 'RED' ? 'Out of Stock' : status === 'YELLOW' ? 'Low Stock' : 'In Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Cards List */}
      <div className="space-y-3">
        {filteredProducts.map((p) => {
          const isOutOfStock = p.stockQty === 0;
          const isLowStock = p.stockQty > 0 && p.stockQty < 10;

          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let ringColor = 'border-slate-200';

          if (isOutOfStock) {
            badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
            ringColor = 'border-rose-300 bg-rose-50/20';
          } else if (isLowStock) {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
            ringColor = 'border-amber-300 bg-amber-50/20';
          }

          return (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${ringColor}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100">
                  {p.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      {p.name}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Retail: <strong className="text-emerald-700 font-display">₹{p.price}</strong> per {p.unit}</span>
                    <span>•</span>
                    <span>Category: <strong>{p.category}</strong></span>
                  </div>
                </div>
              </div>

              {/* Stock Quantity Counter & 1-Tap Restock Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Stock</span>
                  <div className="text-lg font-extrabold font-display tabular-nums text-slate-900">
                    {p.stockQty} <span className="text-xs font-semibold text-slate-500">{p.unit}</span>
                  </div>
                </div>

                {/* Preset Restock Pills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 hidden md:inline">Restock:</span>
                  <button
                    onClick={() => onUpdateStock(p.id, 5)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all active:scale-95"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onUpdateStock(p.id, 10)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all active:scale-95"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => onUpdateStock(p.id, 25)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all active:scale-95"
                  >
                    +25
                  </button>
                  <button
                    disabled={p.stockQty <= 0}
                    onClick={() => onUpdateStock(p.id, -1)}
                    className="px-2 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg text-xs font-bold disabled:opacity-30"
                    title="Manual Damaged / Spoiled Item"
                  >
                    -1
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Add Inventory Product (नया सामान जोड़ें)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Parle Hide & Seek, Dalda Ghee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="₹ 50"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Dairy & Bakery">Dairy & Bakery</option>
                    <option value="Staples & Grains">Staples & Grains</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Personal & Home">Personal & Home</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="pack, kg, ltr, pcs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Icon Emoji</label>
                <div className="flex items-center gap-2">
                  {['🥛', '🍞', '🌾', '🍚', '🧈', '☕', '🍪', '🛢️', '🧼', '📦'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`text-xl p-1.5 rounded-lg border ${
                        newIcon === emoji ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
