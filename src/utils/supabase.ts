import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { DailyEntry, Product, KhataRecord, StoreProfile } from '../types';

const STORAGE_KEY_SUPABASE_CONFIG = 'vyaparsnap_supabase_config_v1';
const STORAGE_KEY_SESSION_USER = 'vyaparsnap_session_user_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Default demo placeholder / environment variables if available
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return {
    url: DEFAULT_URL,
    anonKey: DEFAULT_ANON_KEY,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
  cachedClient = null; // reset client instance
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return cachedClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

/* ==================== AUTHENTICATION ==================== */
export async function signUpMerchant(
  email: string,
  pass: string,
  storeName: string
): Promise<{ user: User | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      user: null,
      error: 'Supabase URL & Anon Key not configured. Please enter them in Cloud Settings.',
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          store_name: storeName,
        },
      },
    });

    if (error) return { user: null, error: error.message };
    if (data.user) {
      localStorage.setItem(STORAGE_KEY_SESSION_USER, JSON.stringify(data.user));
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function signInMerchant(
  email: string,
  pass: string
): Promise<{ user: User | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      user: null,
      error: 'Supabase URL & Anon Key not configured. Please enter them in Cloud Settings.',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return { user: null, error: error.message };
    if (data.user) {
      localStorage.setItem(STORAGE_KEY_SESSION_USER, JSON.stringify(data.user));
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function signOutMerchant(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      // safe ignore
    }
  }
  localStorage.removeItem(STORAGE_KEY_SESSION_USER);
}

export function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ==================== MULTI-DEVICE CLOUD SYNC ==================== */
export async function syncLocalStoreToCloud(
  profile: StoreProfile,
  entries: Record<string, DailyEntry>,
  products: Product[],
  khata: KhataRecord[]
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Cloud database not connected. Operating in 100% Local Guest Mode.' };
  }

  const user = getCachedUser();
  if (!user) {
    return { success: false, message: 'Please Sign In to sync across multiple devices.' };
  }

  try {
    // 1. Sync store profile
    await client.from('stores').upsert(
      {
        user_id: user.id,
        store_name: profile.storeName,
        owner_name: profile.ownerName,
        phone: profile.phone,
        upi_vpa: profile.upiVpa,
        business_type: profile.businessType,
        custom_type_name: profile.customTypeName || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    // 2. Sync products catalog
    const productRows = products.map((p) => ({
      user_id: user.id,
      product_id: p.id,
      name: p.name,
      price: p.price,
      stock_qty: p.stockQty,
      category: p.category,
      icon: p.icon,
      is_frequent: p.isFrequent,
      unit: p.unit,
      updated_at: new Date().toISOString(),
    }));
    await client.from('products').upsert(productRows, { onConflict: 'user_id, product_id' });

    // 3. Sync Daily Ledger Entries
    const entryRows = Object.values(entries).map((e) => ({
      user_id: user.id,
      entry_date: e.date,
      sales: e.sales,
      expenses: e.expenses,
      cash_sales: e.cashSales || 0,
      upi_sales: e.upiSales || 0,
      khata_sales: e.khataSales || 0,
      transaction_count: e.transactionCount || 0,
      notes: e.notes || null,
      updated_at: new Date().toISOString(),
    }));
    await client.from('daily_entries').upsert(entryRows, { onConflict: 'user_id, entry_date' });

    // 4. Sync Khata Credit Records
    const khataRows = khata.map((k) => ({
      user_id: user.id,
      record_id: k.id,
      customer_name: k.customerName,
      customer_phone: k.customerPhone,
      amount: k.amount,
      record_date: k.date,
      notes: k.notes,
      is_settled: k.isSettled,
      settled_at: k.settledAt || null,
      updated_at: new Date().toISOString(),
    }));
    await client.from('khata_records').upsert(khataRows, { onConflict: 'user_id, record_id' });

    return { success: true, message: 'All transactions & inventory synchronized with Supabase Cloud!' };
  } catch (err) {
    return {
      success: false,
      message: `Cloud sync error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function fetchStoreFromCloud(): Promise<{
  profile?: StoreProfile;
  products?: Product[];
  entries?: Record<string, DailyEntry>;
  khata?: KhataRecord[];
  error?: string;
}> {
  const client = getSupabaseClient();
  const user = getCachedUser();
  if (!client || !user) {
    return { error: 'Not connected to Supabase Cloud.' };
  }

  try {
    // Fetch Profile
    const { data: storeData } = await client.from('stores').select('*').eq('user_id', user.id).single();
    let profile: StoreProfile | undefined;
    if (storeData) {
      profile = {
        storeName: storeData.store_name,
        ownerName: storeData.owner_name,
        phone: storeData.phone,
        upiVpa: storeData.upi_vpa,
        businessType: storeData.business_type,
        customTypeName: storeData.custom_type_name,
        currencySymbol: '₹',
      };
    }

    // Fetch Products
    const { data: prodData } = await client.from('products').select('*').eq('user_id', user.id);
    const products: Product[] = (prodData || []).map((row) => ({
      id: row.product_id,
      name: row.name,
      price: row.price,
      stockQty: row.stock_qty,
      category: row.category,
      icon: row.icon,
      isFrequent: row.is_frequent,
      unit: row.unit,
    }));

    // Fetch Entries
    const { data: entryData } = await client.from('daily_entries').select('*').eq('user_id', user.id);
    const entries: Record<string, DailyEntry> = {};
    (entryData || []).forEach((row) => {
      entries[row.entry_date] = {
        date: row.entry_date,
        sales: row.sales,
        expenses: row.expenses,
        cashSales: row.cash_sales,
        upiSales: row.upi_sales,
        khataSales: row.khata_sales,
        transactionCount: row.transaction_count,
        notes: row.notes,
      };
    });

    // Fetch Khata
    const { data: khataData } = await client.from('khata_records').select('*').eq('user_id', user.id);
    const khata: KhataRecord[] = (khataData || []).map((row) => ({
      id: row.record_id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      amount: row.amount,
      date: row.record_date,
      notes: row.notes,
      isSettled: row.is_settled,
      settledAt: row.settled_at,
    }));

    return { profile, products, entries, khata };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
