import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Zap,
} from 'lucide-react';
import { StoreProfile, BusinessType, Product } from '../types';
import { BUSINESS_PRESETS } from '../data/businessCatalogs';
import { Language } from '../utils/translations';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StoreProfile;
  language?: Language;
  onSaveProfile: (profile: StoreProfile) => void;
  onApplyPresetCatalog: (products: Product[], newProfile: StoreProfile) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  language = 'en',
  onSaveProfile,
  onApplyPresetCatalog,
}) => {
  const isHi = language === 'hi';
  const [storeName, setStoreName] = useState(profile.storeName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [phone, setPhone] = useState(profile.phone);
  const [upiVpa, setUpiVpa] = useState(profile.upiVpa);
  const [selectedType, setSelectedType] = useState<BusinessType>(profile.businessType);
  const [customTypeName, setCustomTypeName] = useState(profile.customTypeName || '');

  // Synchronize state when modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setStoreName(profile.storeName);
      setOwnerName(profile.ownerName);
      setPhone(profile.phone);
      setUpiVpa(profile.upiVpa);
      setSelectedType(profile.businessType);
      setCustomTypeName(profile.customTypeName || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const currentPreset = BUSINESS_PRESETS[selectedType];

  const handleSelectBusinessType = (type: BusinessType) => {
    setSelectedType(type);
    const preset = BUSINESS_PRESETS[type];
    if (preset && type !== 'custom') {
      // Instantly populate default store identity for this retail vertical
      setStoreName(preset.defaultStoreName);
      setOwnerName(preset.defaultOwnerName);
      setUpiVpa(preset.defaultUpi);
    }
  };

  // 1-Tap Switch: Updates store identity AND loads the business-specific product catalog
  const handleSwitchStoreAndCatalog = () => {
    const preset = BUSINESS_PRESETS[selectedType];
    const updatedProfile: StoreProfile = {
      ...profile,
      storeName: storeName.trim() || (preset ? preset.defaultStoreName : 'My Store'),
      ownerName: ownerName.trim() || (preset ? preset.defaultOwnerName : 'Store Owner'),
      phone: phone.trim() || '9876543210',
      upiVpa: upiVpa.trim().toLowerCase() || (preset ? preset.defaultUpi : 'store@upi'),
      businessType: selectedType,
      customTypeName: selectedType === 'custom' ? customTypeName.trim() : undefined,
    };

    if (preset && preset.starterProducts && preset.starterProducts.length > 0) {
      onApplyPresetCatalog(preset.starterProducts, updatedProfile);
    } else {
      onSaveProfile(updatedProfile);
    }
    onClose();
  };

  // Save only the metadata (Store Name, UPI, Owner) without replacing current products
  const handleSaveProfileOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !upiVpa.trim()) {
      alert(isHi ? 'दुकान का नाम और यूपीआई आईडी अनिवार्य हैं।' : 'Store name and UPI VPA ID are required.');
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-display">
                {isHi ? 'दुकान का प्रकार व प्रोफाइल बदलें' : 'Switch Store & Retail Profile'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isHi
                  ? 'किराना, बेकरी, ई-मित्र, कैफे या पानी पूरी स्टोर तुरंत चुनें'
                  : 'Select Kirana, Bakery, e-Mitra, Cafe, Street Food or Custom profile'}
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

        {/* Content Form */}
        <form onSubmit={handleSaveProfileOnly} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Business Type Selector Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
                1. {isHi ? 'दुकान की श्रेणी चुनें (Select Retail Type)' : 'Select Retail Category / Business Type'}
              </label>
              <span className="text-[11px] text-emerald-700 font-bold">
                {isHi ? 'तुरंत लोड होगा' : 'Auto-fills defaults'}
              </span>
            </div>

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
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{preset.icon}</span>
                    <span className="font-bold text-[11px] text-slate-900 leading-tight">
                      {isHi ? preset.hindiLabel : preset.label}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5">
                      {isHi ? preset.label : preset.hindiLabel}
                    </span>
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
                  placeholder="e.g. Hardware Store, Mobile Repair, Salon, Juice Bar..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Quick Switch Action Card */}
          {currentPreset && (
            <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentPreset.icon}</span>
                  <div>
                    <span className="font-extrabold text-emerald-950 block text-xs">
                      {isHi ? `लोड करें: ${currentPreset.hindiLabel}` : `Switch to: ${currentPreset.label}`}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      {currentPreset.starterProducts.length} {isHi ? 'सामान व कीमतें तैयार हैं' : 'pre-configured items & prices ready'}
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Ready
                </span>
              </div>

              {/* 1-Tap Switch Button */}
              <button
                type="button"
                onClick={handleSwitchStoreAndCatalog}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                <span>
                  {isHi
                    ? `इस दुकान पर जाएं और ${currentPreset.starterProducts.length} सामान लोड करें`
                    : `Switch to ${currentPreset.label} & Load ${currentPreset.starterProducts.length} Items`}
                </span>
              </button>
            </div>
          )}

          {/* Store Details Form */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <label className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
              2. {isHi ? 'दुकान की जानकारी व यूपीआई (Store Identity & UPI)' : 'Store Identification & Live Counter QR'}
            </label>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {isHi ? 'दुकान का नाम' : 'Store / Shop Name'}
              </label>
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
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {isHi ? 'दुकानदार का नाम' : 'Owner Name'}
                </label>
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
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {isHi ? 'मोबाइल नंबर' : 'Store Mobile No.'}
                </label>
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
                  {isHi ? 'दुकान की UPI ID (QR पेमेंट हेतु)' : 'Store UPI ID (VPA for QR Payments)'}
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
                  placeholder="e.g. yourshop@okhdfcbank or 9876543210@paytm"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {isHi
                  ? 'ग्राहक जब काउंटर पर QR स्कैन करेगा, पैसा सीधे इस बैंक खाते में पहुंचेगा।'
                  : 'Customer payments transfer directly to this UPI bank account when scanned.'}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
            >
              {isHi ? 'केवल नाम/UPI सेव करें' : 'Save Details Only'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
