import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Trash2,
  Save,
  Plus,
  Sparkles,
  Check,
  Tag,
  DollarSign,
  Layers,
  Archive,
} from 'lucide-react';
import { Product } from '../types';
import { getSmartIcon, POPULAR_CATEGORY_ICONS } from '../utils/smartIcons';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null = Add Mode, non-null = Edit Mode
  existingCategories: string[];
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showToast?: (msg: string) => void;
}

const COMMON_UNITS = ['pack', 'pcs', 'kg', 'plate', 'cup', 'ltr', 'box', 'item'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  existingCategories,
  onSave,
  onDelete,
  showToast,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stockQty, setStockQty] = useState<number | ''>(20);
  const [category, setCategory] = useState('General Items');
  const [customCategory, setCustomCategory] = useState('');
  const [unit, setUnit] = useState('pack');
  const [icon, setIcon] = useState('📦');
  const [isFrequent, setIsFrequent] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const categories = Array.from(
    new Set(['General Items', ...existingCategories.filter(Boolean)])
  );

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStockQty(product.stockQty);
      setCategory(product.category || 'General Items');
      setUnit(product.unit || 'pack');
      setIcon(product.icon || '📦');
      setIsFrequent(Boolean(product.isFrequent));
    } else {
      setName('');
      setPrice('');
      setStockQty(20);
      setCategory(existingCategories[0] || 'General Items');
      setCustomCategory('');
      setUnit('pack');
      setIcon('📦');
      setIsFrequent(false);
    }
    setShowEmojiPicker(false);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || icon === '📦') {
      const detected = getSmartIcon(val, category);
      setIcon(detected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (price === '' || Number(price) < 0) {
      alert('Please enter a valid price (₹)');
      return;
    }

    const finalCategory =
      category === '__NEW__' ? customCategory.trim() || 'General Items' : category;

    const savedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      stockQty: stockQty === '' ? 0 : Number(stockQty),
      category: finalCategory,
      unit: unit.trim() || 'pack',
      icon: icon || '📦',
      isFrequent,
    };

    onSave(savedProduct);
    if (showToast) {
      showToast(isEditing ? `Updated ${name}!` : `Added ${name} to store!`);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!product || !onDelete) return;
    if (
      window.confirm(
        `Are you sure you want to delete "${product.name}" from your catalog?\n\n(क्या आप इस सामान को दुकान से हटाना चाहते हैं?)`
      )
    ) {
      onDelete(product.id);
      if (showToast) {
        showToast(`Deleted ${product.name}`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-inner text-xl">
              {icon}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-display">
                {isEditing ? 'Edit Item (सामान बदलें)' : 'Add New Item (नया सामान)'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isEditing
                  ? 'Update price, stock, or remove from catalog'
                  : 'Add product or service to your counter & stock'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Item Name & Icon Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Item / Service Name (नाम) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Icon: {icon}</span>
                <span className="text-[10px] text-slate-400">Change</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Masala Chai, Maggi, Kurkure, Aadhaar PVC..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Smart Emoji Picker Drawer */}
            {showEmojiPicker && (
              <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 animate-slide-up space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  Select Icon / Emoji:
                </span>
                <div className="grid grid-cols-8 gap-1.5 max-h-36 overflow-y-auto p-1">
                  {Object.values(POPULAR_CATEGORY_ICONS)
                    .flat()
                    .map((emoji, idx) => (
                      <button
                        key={`${emoji}-${idx}`}
                        type="button"
                        onClick={() => {
                          setIcon(emoji);
                          setShowEmojiPicker(false);
                        }}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center text-lg hover:bg-emerald-100 transition-colors ${
                          icon === emoji ? 'bg-emerald-200 ring-2 ring-emerald-500' : 'bg-white'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Price */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Retail Price (कीमत ₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-extrabold text-emerald-700">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="25"
                  className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>

            {/* Initial / Current Stock */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Current Stock (स्टॉक)
              </label>
              <input
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="20"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* Unit Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Unit of Measurement (इकाई)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    unit === u
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Category (श्रेणी)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__NEW__">+ Type Custom Category...</option>
            </select>

            {category === '__NEW__' && (
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name..."
                className="w-full mt-2 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>

          {/* Frequent / Staple Checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={isFrequent}
              onChange={(e) => setIsFrequent(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 rounded border-slate-300"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                ⭐ Pin as Quick Staple on Counter
              </span>
              <span className="text-[10px] text-slate-500">
                Shows this item prominently on the front 3-Tap counter screen
              </span>
            </div>
          </label>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes (अपडेट करें)' : 'Add to Catalog (दुकान में जोड़ें)'}</span>
            </button>

            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Item from Shop (सामान हटाएं)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
