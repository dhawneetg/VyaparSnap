import React, { useState } from 'react';
import {
  X,
  Store,
  QrCode,
  User,
  Phone,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { StoreProfile, BusinessType, Product } from '../types';
import { BUSINESS_PRESETS } from '../data/businessCatalogs';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StoreProfile;
  onSaveProfile: (profile: StoreProfile) => void;
  onApplyPresetCatalog: (products: Product[], newProfile: StoreProfile) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onApplyPresetCatalog,
}) => {
  const [storeName, setStoreName] = useState(profile.storeName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [phone, setPhone] = useState(profile.phone);
  const [upiVpa, setUpiVpa] = useState(profile.upiVpa);
  const [selectedType, setSelectedType] = useState<BusinessType>(profile.businessType);
  const [customTypeName, setCustomTypeName] = useState(profile.customTypeName || '');

  if (!isOpen) return null;

  const handleSelectBusinessType = (type: BusinessType) => {
    setSelectedType(type);
    const preset = BUSINESS_PRESETS[type];
    if (preset && type !== 'custom') {
      // Suggest preset store name if current name was default
      if (storeName === profile.storeName && profile.businessType !== type) {
        setStoreName(preset.defaultStoreName);
        setOwnerName(preset.defaultOwnerName);
        setUpiVpa(preset.defaultUpi);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !upiVpa.trim()) {
      alert('Store name and UPI VPA ID are required.');
      return;
    }

    const updated: StoreProfile = {
      ...profile,
      storeName: storeName.trim(),
      ownerName: ownerName.trim() || 'Store Owner',
      phone: phone.trim() || '9876543210',
      upiVpa: upiVpa.trim().toLowerCase(),
      businessType: selectedType,
      customTypeName: selectedType === 'custom' ? customTypeName.trim() : undefined,
    };

    onSaveProfile(updated);
    onClose();
  };

  const handleLoadStarterProducts = () => {
    const preset = BUSINESS_PRESETS[selectedType];
    if (!preset) return;

    if (
      window.confirm(
        `Load standard catalog for "${preset.label}" (${preset.starterProducts.length} items)? This will replace current inventory with starter items for this business.`
      )
    ) {
      const updatedProfile: StoreProfile = {
        ...profile,
        storeName: storeName.trim() || preset.defaultStoreName,
        ownerName: ownerName.trim() || preset.defaultOwnerName,
        phone: phone.trim() || '9876543210',
        upiVpa: upiVpa.trim().toLowerCase() || preset.defaultUpi,
        businessType: selectedType,
        customTypeName: selectedType === 'custom' ? customTypeName.trim() : undefined,
      };

      onApplyPresetCatalog(preset.starterProducts, updatedProfile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-display">Store Profile & Retail Type</h3>
              <p className="text-[11px] text-slate-300">Configure business identity, UPI payments & catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Business Type Selector Grid */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
              1. Select Retail Category / Business Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(BUSINESS_PRESETS) as BusinessType[]).map((typeKey) => {
                const preset = BUSINESS_PRESETS[typeKey];
                const isSelected = selectedType === typeKey;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => handleSelectBusinessType(typeKey)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{preset.icon}</span>
                    <span className="font-bold text-[11px] text-slate-900 leading-tight">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{preset.hindiLabel}</span>
                  </button>
                );
              })}
            </div>

            {selectedType === 'custom' && (
              <div className="pt-2 animate-slide-up">
                <input
                  type="text"
                  value={customTypeName}
                  onChange={(e) => setCustomTypeName(e.target.value)}
                  placeholder="e.g. Pani Puri Counter, Saloon, Hardware Store..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Catalog Starter Preset Action */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 block text-xs">
                  Starter Catalog Available
                </span>
                <span className="text-[11px] text-emerald-700">
                  Pre-configured products & prices for {BUSINESS_PRESETS[selectedType]?.label}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLoadStarterProducts}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-[11px] shadow-sm whitespace-nowrap active:scale-95 transition-all"
            >
              Load Items
            </button>
          </div>

          {/* Store Details */}
          <div className="space-y-3 pt-1">
            <label className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
              2. Store Identification
            </label>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Store / Shop Name</label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Ramesh Kirana Store, Sharma e-Mitra Hub..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Owner Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner Full Name"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Store Mobile No.</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom UPI VPA ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">
                  Store UPI ID (VPA for QR Payments)
                </label>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  Live Counter QR
                </span>
              </div>
              <div className="relative">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  placeholder="e.g. yourshopname@okhdfcbank or 9876543210@paytm"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Customer payments will transfer directly to this UPI bank account when scanned.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
