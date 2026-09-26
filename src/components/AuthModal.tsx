import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CloudCheck,
  Lock,
  Mail,
  Store,
  Key,
  Database,
  ArrowRight,
  LogOut,
  RefreshCw,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreProfile, DailyEntry, Product, KhataRecord } from '../types';
import {
  signUpMerchant,
  signInMerchant,
  signOutMerchant,
  getCachedUser,
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
  const [activeTab, setActiveTab] = useState<'auth' | 'config'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState(profile.storeName);
  const [currentUser, setCurrentUser] = useState<User | null>(getCachedUser());
  const [isLoading, setIsLoading] = useState(false);

  // Cloud Config state
  const config = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(config.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(config.anonKey);
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    setCurrentUser(getCachedUser());
    setIsConfigured(isSupabaseConfigured());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    if (authMode === 'signup') {
      const res = await signUpMerchant(email, password, storeName || profile.storeName);
      setIsLoading(false);
      if (res.error) {
        alert(res.error);
      } else {
        setCurrentUser(res.user);
        showToast('Store account created and linked!');
      }
    } else {
      const res = await signInMerchant(email, password);
      setIsLoading(false);
      if (res.error) {
        alert(res.error);
      } else {
        setCurrentUser(res.user);
        showToast('Signed into Supabase Cloud successfully!');
      }
    }
  };

  const handleSignOut = async () => {
    await signOutMerchant();
    setCurrentUser(null);
    showToast('Signed out of cloud session. Operating in local mode.');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseUrl.trim(),
      anonKey: supabaseAnonKey.trim(),
    });
    setIsConfigured(isSupabaseConfigured());
    showToast('Supabase Cloud configuration saved!');
    setActiveTab('auth');
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
      alert(res.error);
    } else {
      onCloudSyncSuccess(res);
      showToast('Downloaded latest data from Supabase Cloud!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-slide-up no-print overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display">Supabase Cloud Sync</h3>
              <p className="text-[11px] text-slate-400">Multi-device sync & automated backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'auth'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Account & Sync
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cloud Config
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {activeTab === 'auth' ? (
            currentUser ? (
              /* Signed In State */
              <div className="space-y-4 animate-slide-up">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Connected to Cloud
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 block truncate max-w-[220px]">
                      {currentUser.email}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Store: {profile.storeName}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSyncToCloud}
                    disabled={isLoading}
                    className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Upload to Cloud</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePullFromCloud}
                    disabled={isLoading}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Download to Device</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <span className="font-bold block text-slate-800">Multi-Device Access:</span>
                  <p>Log in with this same email on your home phone or tablet to view real-time sales & profit.</p>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            ) : (
              /* Signed Out / Login Form */
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="text-center pb-1">
                  <span className="font-extrabold text-base text-slate-900 block font-display">
                    {authMode === 'signin' ? 'Sign In to Store Account' : 'Create Multi-Device Account'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Link your store to Supabase cloud for real-time multi-device sync
                  </p>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Store Name</label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Store Name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="merchant@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>{authMode === 'signin' ? 'Sign In & Connect' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    {authMode === 'signin'
                      ? "Don't have an account? Sign Up"
                      : 'Already have an account? Sign In'}
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] text-center">
                  💡 <strong>100% Offline Guaranteed:</strong> Signing in is optional. VyaparSnap always functions locally on this device without network.
                </div>
              </form>
            )
          ) : (
            /* Cloud Configuration Form */
            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div className="text-center pb-1">
                <span className="font-extrabold text-base text-slate-900 block font-display">
                  Supabase Project Credentials
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Connect your own Supabase instance for cloud persistence
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Database className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Anon Public Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
              >
                Save Cloud Configuration
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] space-y-1">
                <span className="font-bold text-slate-700 block">Status:</span>
                <span className={isConfigured ? 'text-emerald-700 font-bold' : 'text-amber-600 font-bold'}>
                  {isConfigured ? '🟢 Supabase API Connected' : '🟡 Local Mode (No Cloud Configured)'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
