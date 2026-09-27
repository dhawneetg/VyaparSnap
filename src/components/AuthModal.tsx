import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  Lock,
  Store,
  Key,
  Database,
  ArrowRight,
  LogOut,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreProfile, DailyEntry, Product, KhataRecord } from '../types';
import {
  signUpMerchant,
  signInMerchant,
  signOutMerchant,
  getCachedUser,
  getMerchantDisplayIdentifier,
  getSupabaseConfig,
  saveSupabaseConfig,
  syncLocalStoreToCloud,
  fetchStoreFromCloud,
  isSupabaseConfigured,
} from '../utils/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StoreProfile;
  entries: Record<string, DailyEntry>;
  products: Product[];
  khata: KhataRecord[];
  onCloudSyncSuccess: (cloudData: {
    profile?: StoreProfile;
    products?: Product[];
    entries?: Record<string, DailyEntry>;
    khata?: KhataRecord[];
  }) => void;
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  entries,
  products,
  khata,
  onCloudSyncSuccess,
  showToast,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [pinOrPassword, setPinOrPassword] = useState('');
  const [storeName, setStoreName] = useState(profile.storeName);
  const [currentUser, setCurrentUser] = useState<User | null>(getCachedUser());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Platform Supabase Backend Config (for developer/admin override)
  const config = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(config.anonKey);
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    setCurrentUser(getCachedUser());
    setIsConfigured(isSupabaseConfigured());
    setErrorMessage(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!identifier.trim() || !pinOrPassword.trim()) {
      setErrorMessage('कृपया मोबाइल नंबर/ईमेल और पिन दर्ज करें (Please enter mobile/email and PIN)');
      return;
    }

    setIsLoading(true);
    if (authMode === 'signup') {
      const res = await signUpMerchant(
        identifier.trim(),
        pinOrPassword.trim(),
        storeName.trim() || profile.storeName
      );
      setIsLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setCurrentUser(res.user);
        showToast('दुकान का क्लाउड बैकअप खाता तैयार हो गया! (Store Account Created!)');
      }
    } else {
      const res = await signInMerchant(identifier.trim(), pinOrPassword.trim());
      setIsLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setCurrentUser(res.user);
        showToast('क्लाउड बैकअप से कनेक्ट हो गया! (Connected to Cloud Backup!)');
      }
    }
  };

  const handleSignOut = async () => {
    await signOutMerchant();
    setCurrentUser(null);
    showToast('Signed out of cloud account. Operating in local mode.');
  };

  const handleSaveDeveloperConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim(),
    });
    setIsConfigured(isSupabaseConfigured());
    showToast('Platform master Supabase connection updated!');
  };

  const handleSyncToCloud = async () => {
    setIsLoading(true);
    const res = await syncLocalStoreToCloud(profile, entries, products, khata);
    setIsLoading(false);
    showToast(res.message);
  };

  const handlePullFromCloud = async () => {
    setIsLoading(true);
    const res = await fetchStoreFromCloud();
    setIsLoading(false);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      onCloudSyncSuccess(res);
      showToast('क्लाउड से सारा डेटा सफलतापूर्वक डाउनलोड हुआ! (Data Restored!)');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-white font-display">Vyapar Cloud Backup</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {currentUser ? 'Active' : 'Free'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                दुकान का खाता और बिक्री ऑनलाइन सुरक्षित रखें
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {currentUser ? (
            /* ================= SIGNED IN MERCHANT VIEW ================= */
            <div className="space-y-4 animate-slide-up">
              {/* Status Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>क्लाउड बैकअप सक्रिय है (Live Backup Active)</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                    {profile.storeName}
                  </h4>
                  <p className="text-[11px] text-slate-600 truncate">
                    खाता: <span className="font-bold text-slate-800">{getMerchantDisplayIdentifier(currentUser)}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleSyncToCloud}
                  disabled={isLoading}
                  className="p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-extrabold flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-center"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-xs">क्लाउड पर सेव करें</span>
                  <span className="text-[10px] text-emerald-200 font-normal">Backup to Cloud</span>
                </button>

                <button
                  type="button"
                  onClick={handlePullFromCloud}
                  disabled={isLoading}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-center"
                >
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">फोन में डाउनलोड करें</span>
                  <span className="text-[10px] text-slate-400 font-normal">Restore to Device</span>
                </button>
              </div>

              {/* Multi-Device Sync Card */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>घर के फोन या टैबलेट पर दुकान देखें:</span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  दूसरे मोबाइल में VyaparSnap खोलें, यही मोबाइल नंबर और पिन डालें। आपकी दुकान की सारी बिक्री और खाता तुरंत सिंक हो जाएगा!
                </p>
              </div>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉग आउट करें (Sign Out Session)</span>
              </button>
            </div>
          ) : (
            /* ================= SIGN IN / REGISTER FORM ================= */
            <form onSubmit={handleAuthSubmit} className="space-y-3.5 animate-slide-up">
              {/* Mode Toggle */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  लॉग इन (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`py-2 rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  नया बैकअप (New Backup)
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[11px] font-bold">
                  {errorMessage}
                </div>
              )}

              {/* Store Name (if signup) */}
              {authMode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    दुकान का नाम (Shop Name)
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="उदा. रमेश किराना स्टोर"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Number or Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    मोबाइल नंबर या ईमेल (Mobile or Email)
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    10-अंक मोबाइल
                  </span>
                </div>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="उदा. 9876543210 या ramesh@kirana.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 4-Digit Security PIN or Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    सुरक्षा पिन या पासवर्ड (Shop PIN)
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    उदा. 4 अंकों का पिन
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={pinOrPassword}
                    onChange={(e) => setPinOrPassword(e.target.value)}
                    placeholder="उदा. 1234"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 दूसरे फोन पर यही पिन डालकर आप दुकान की बिक्री देख सकते हैं।
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-xs"
              >
                <span>
                  {authMode === 'signin' ? 'लॉग इन और सिंक करें (Sign In & Connect)' : 'बैकअप खाता बनाएं (Create Cloud Backup)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch Mode Prompt */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  {authMode === 'signin'
                    ? 'पहली बार आए हैं? नया बैकअप खाता बनाएं (New Store)'
                    : 'पहले से खाता है? यहाँ लॉग इन करें (Sign In)'}
                </button>
              </div>

              {/* Offline Safe Guarantee */}
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-emerald-950 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>100% ऑफलाइन गारंटी:</strong> बिना इंटरनेट या बिना लॉग इन किए भी व्यापारस्नैप इस फोन पर हमेशा सुरक्षित काम करता रहेगा।
                </p>
              </div>
            </form>
          )}

          {/* ================= DEVELOPER / ADMIN ACCORDION ================= */}
          <details className="mt-4 pt-3 border-t border-slate-100 group">
            <summary className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-between select-none py-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>प्लेटफ़ॉर्म सेटिंग्स (Developer Master Database)</span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-1.5 text-slate-500 text-[10px]">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  VyaparSnap operates with a <strong>single central Supabase instance</strong>. All vendors automatically connect to this master database with Row-Level Security isolation.
                </p>
              </div>

              <form onSubmit={handleSaveDeveloperConfig} className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Central Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Anon Public Key
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] font-bold ${isConfigured ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {isConfigured ? '🟢 Master Supabase Linked' : '🟡 Local Mode (No Server Key)'}
                  </span>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition-all"
                  >
                    Save Key
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
