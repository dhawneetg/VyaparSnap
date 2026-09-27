import React, { useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Store,
  Smartphone,
  Monitor,
  Printer,
  RotateCcw,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  Boxes,
  BookOpen,
  FileText,
  BarChart3,
  Download,
  Upload,
  Cloud,
  Settings,
  Languages,
  Workflow,
} from 'lucide-react';
import { ActiveTab, DailyEntry, Product, KhataRecord, StoreProfile } from '../types';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';
import { Language, getTranslation } from '../utils/translations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  language: Language;
  onToggleLanguage: () => void;
  onResetData: () => void;
  onPrint: () => void;
  lowStockCount: number;
  pendingKhataCount: number;
  profile: StoreProfile;
  onOpenStoreSettings: () => void;
  onOpenAuthModal: () => void;
  onRestoreData?: (data: {
    profile?: StoreProfile;
    entries: Record<string, DailyEntry>;
    products: Product[];
    khata: KhataRecord[];
  }) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMobilePreview,
  setIsMobilePreview,
  language,
  onToggleLanguage,
  onResetData,
  onPrint,
  lowStockCount,
  pendingKhataCount,
  profile,
  onOpenStoreSettings,
  onOpenAuthModal,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const restored = importBackupJSON(text);
        if (onRestoreData) {
          onRestoreData(restored);
        }
      } catch (err) {
        alert('Failed to restore backup: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 relative overflow-hidden group cursor-pointer"
            onClick={() => setActiveTab('counter')}
            title="VyaparSnap Home"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-6 h-6 fill-none stroke-current"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M30 30h40M30 45h35M30 45c13 0 21 8 21 21M48 66l22 22M44 45c-10 0-14 0-14 0" />
              <path d="M68 24l16 0 0 16M84 24l-24 24" stroke="#85f8c4" strokeWidth="8" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                VyaparSnap
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Retail OS
              </span>
            </div>
            <button
              onClick={onOpenStoreSettings}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors group cursor-pointer text-left"
              title="Click to change Store Profile, UPI ID & Business Type"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold underline decoration-dotted decoration-slate-300 group-hover:decoration-emerald-500">
                {profile.storeName}
              </span>
              <span className="text-[10px] text-slate-400">({profile.customTypeName || profile.businessType})</span>
              <Settings className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('counter')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'counter'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation('counterTab', language)}</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'stock'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation('stockTab', language)}</span>
            {lowStockCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('khata')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'khata'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{getTranslation('khataTab', language)}</span>
            {pendingKhataCount > 0 && (
              <span className="bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {pendingKhataCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('entry')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'entry'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation('dailyClosingTab', language)}</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation('calendarTab', language)}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getTranslation('analyticsTab', language)}</span>
          </button>

          {/* Architecture & Flowchart Tab */}
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'architecture'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-indigo-600" />
            <span>{getTranslation('architectureTab', language)}</span>
          </button>
        </nav>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2">
          {/* Functional English <-> Hindi Switcher Pill */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 rounded-lg border border-amber-300 text-xs font-extrabold transition-all shadow-xs active:scale-95 cursor-pointer"
            title={language === 'en' ? 'हिंदी में बदलें (Switch to Hindi)' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </button>

          {/* Cloud Sync Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-bold transition-all shadow-xs"
            title="Multi-Device Cloud Sync via Supabase"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{getTranslation('cloudSync', language)}</span>
          </button>

          {/* Backup JSON */}
          <button
            onClick={() => exportBackupJSON()}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
            title="Backup Database (Download JSON)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Restore JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
            title="Restore Database (Upload JSON)"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          {/* Print/PDF */}
          <button
            onClick={onPrint}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Download/Print Monthly Summary"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Reset sample data */}
          <button
            onClick={onResetData}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reset to 26-Day Demo Dataset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mobile vs Desktop View Toggle (Hackathon Showcase mode) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-1">
            <button
              onClick={() => setIsMobilePreview(false)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                !isMobilePreview
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Full Desktop Command Center"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobilePreview(true)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                isMobilePreview
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Mobile Phone Viewport Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
