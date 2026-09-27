import { DailyEntry, MonthlyStats, Product, KhataRecord, CartItem, StoreProfile, SaleTransaction } from '../types';
import { INITIAL_SEED_ENTRIES, INITIAL_PRODUCTS, INITIAL_KHATA_RECORDS, INITIAL_TRANSACTIONS } from '../data/seedData';
import { DEFAULT_STORE_PROFILE } from '../data/businessCatalogs';

const STORAGE_KEY_ENTRIES = 'salessnap_entries_v2';
const STORAGE_KEY_PRODUCTS = 'salessnap_products_v2';
const STORAGE_KEY_KHATA = 'salessnap_khata_v2';
const STORAGE_KEY_STORE_PROFILE = 'vyaparsnap_store_profile_v2';
const STORAGE_KEY_TRANSACTIONS = 'salessnap_transactions_v2';

/* ==================== STORE PROFILE ==================== */
export function loadStoreProfile(): StoreProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STORE_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STORE_PROFILE, JSON.stringify(DEFAULT_STORE_PROFILE));
      return DEFAULT_STORE_PROFILE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading store profile', err);
    return DEFAULT_STORE_PROFILE;
  }
}

export function saveStoreProfile(profile: StoreProfile): StoreProfile {
  localStorage.setItem(STORAGE_KEY_STORE_PROFILE, JSON.stringify(profile));
  return profile;
}

/* ==================== ENTRIES ==================== */
export function loadEntries(): Record<string, DailyEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(INITIAL_SEED_ENTRIES));
      return INITIAL_SEED_ENTRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading entries from localStorage', err);
    return INITIAL_SEED_ENTRIES;
  }
}

export function saveEntry(entry: DailyEntry): Record<string, DailyEntry> {
  const current = loadEntries();
  const updated = {
    ...current,
    [entry.date]: {
      ...entry,
      updatedAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(updated));
  return updated;
}

export function deleteEntry(date: string): Record<string, DailyEntry> {
  const current = loadEntries();
  const updated = { ...current };
  delete updated[date];
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(updated));
  return updated;
}

/* ==================== PRODUCTS / INVENTORY ==================== */
export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading products', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveProduct(product: Product): Product[] {
  const current = loadProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = current.map((p) => (p.id === product.id ? product : p));
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  return updated;
}

export function deleteProduct(productId: string): Product[] {
  const current = loadProducts();
  const updated = current.filter((p) => p.id !== productId);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  return updated;
}

export function updateStockQuantity(productId: string, delta: number): Product[] {
  const current = loadProducts();
  const updated = current.map((p) => {
    if (p.id === productId) {
      return { ...p, stockQty: Math.max(0, p.stockQty + delta) };
    }
    return p;
  });
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  return updated;
}

export function decrementStockOnSale(cart: CartItem[]): Product[] {
  const current = loadProducts();
  const updated = current.map((product) => {
    const cartMatch = cart.find(
      (item) => item.productId === product.id || item.name.toLowerCase() === product.name.toLowerCase()
    );
    if (cartMatch) {
      return { ...product, stockQty: Math.max(0, product.stockQty - cartMatch.qty) };
    }
    return product;
  });
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  return updated;
}

/* ==================== KHATA / CREDIT LEDGER ==================== */
export function loadKhata(): KhataRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KHATA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(INITIAL_KHATA_RECORDS));
      return INITIAL_KHATA_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading khata', err);
    return INITIAL_KHATA_RECORDS;
  }
}

export function addKhataRecord(record: Omit<KhataRecord, 'id'>): KhataRecord[] {
  const current = loadKhata();
  const newRecord: KhataRecord = {
    ...record,
    id: `khata-${Date.now()}`,
  };
  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(updated));
  return updated;
}

export function settleKhataRecord(id: string): KhataRecord[] {
  const current = loadKhata();
  const updated = current.map((r) =>
    r.id === id ? { ...r, isSettled: true, settledAt: new Date().toISOString().split('T')[0] } : r
  );
  localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(updated));
  return updated;
}

/* ==================== TRANSACTIONS / ORDER HISTORY ==================== */
export function loadTransactions(): SaleTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading transactions', err);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransaction(tx: SaleTransaction): SaleTransaction[] {
  const current = loadTransactions();
  const updated = [tx, ...current];
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  return updated;
}

export function deleteTransaction(transactionId: string): SaleTransaction[] {
  const current = loadTransactions();
  const updated = current.filter((t) => t.id !== transactionId);
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
  return updated;
}

/* ==================== RESET ALL ==================== */
export function resetToSeedData() {
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(INITIAL_SEED_ENTRIES));
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(INITIAL_KHATA_RECORDS));
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  return {
    entries: INITIAL_SEED_ENTRIES,
    products: INITIAL_PRODUCTS,
    khata: INITIAL_KHATA_RECORDS,
    transactions: INITIAL_TRANSACTIONS,
  };
}

/* ==================== STATS CALCULATION ==================== */
export function calculateMonthlyStats(
  entries: Record<string, DailyEntry>,
  yearMonth: string = '2026-09'
): MonthlyStats {
  const filtered = Object.values(entries).filter((entry) => entry.date.startsWith(yearMonth));

  let totalSales = 0;
  let totalExpenses = 0;
  let profitableDaysCount = 0;
  let lossDaysCount = 0;
  let highestSales = { date: '', amount: 0 };
  let mostProfitable = { date: '', amount: -Infinity };

  filtered.forEach((entry) => {
    totalSales += entry.sales;
    totalExpenses += entry.expenses;
    const profit = entry.sales - entry.expenses;

    if (profit >= 0) {
      profitableDaysCount++;
    } else {
      lossDaysCount++;
    }

    if (entry.sales > highestSales.amount) {
      highestSales = { date: entry.date, amount: entry.sales };
    }

    if (profit > mostProfitable.amount) {
      mostProfitable = { date: entry.date, amount: profit };
    }
  });

  const totalDaysLogged = filtered.length;
  const netProfit = totalSales - totalExpenses;
  const profitMarginPercent = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  const avgDailySales = totalDaysLogged > 0 ? Math.round(totalSales / totalDaysLogged) : 0;
  const avgDailyExpenses = totalDaysLogged > 0 ? Math.round(totalExpenses / totalDaysLogged) : 0;

  return {
    totalSales,
    totalExpenses,
    netProfit,
    profitMarginPercent: Math.round(profitMarginPercent * 10) / 10,
    profitableDaysCount,
    lossDaysCount,
    totalDaysLogged,
    avgDailySales,
    avgDailyExpenses,
    highestSalesDay: highestSales.amount > 0 ? highestSales : { date: '2026-09-21', amount: 18500 },
    mostProfitableDay: mostProfitable.amount > -Infinity ? mostProfitable : { date: '2026-09-22', amount: 9200 },
  };
}

/* ==================== FORMATTERS ==================== */
export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatCompactINR(val: number): string {
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '+';
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(0)}k`;
  }
  return `${sign}₹${abs}`;
}

/* ==================== EXPORT TO CSV ==================== */
export function exportLedgerToCSV(entries: Record<string, DailyEntry>) {
  const sorted = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date));
  const headers = ['Date', 'Gross Sales (INR)', 'Cash Sales (INR)', 'UPI Sales (INR)', 'Expenses (INR)', 'Net Profit/Loss (INR)', 'Margin %', 'Daily Notes'];

  const rows = sorted.map((e) => {
    const profit = e.sales - e.expenses;
    const margin = e.sales > 0 ? ((profit / e.sales) * 100).toFixed(1) : '0';
    return [
      e.date,
      e.sales,
      e.cashSales || Math.round(e.sales * 0.6),
      e.upiSales || Math.round(e.sales * 0.4),
      e.expenses,
      profit,
      `${margin}%`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VyaparSnap_Ledger_September_2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==================== FULL JSON BACKUP & RESTORE ==================== */
export interface BackupData {
  version: string;
  exportedAt: string;
  app: string;
  profile?: StoreProfile;
  entries: Record<string, DailyEntry>;
  products: Product[];
  khata: KhataRecord[];
  transactions?: SaleTransaction[];
}

export function exportBackupJSON(): void {
  const data: BackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    app: 'VyaparSnap',
    profile: loadStoreProfile(),
    entries: loadEntries(),
    products: loadProducts(),
    khata: loadKhata(),
    transactions: loadTransactions(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VyaparSnap_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importBackupJSON(jsonStr: string): {
  profile?: StoreProfile;
  entries: Record<string, DailyEntry>;
  products: Product[];
  khata: KhataRecord[];
  transactions?: SaleTransaction[];
} {
  const parsed = JSON.parse(jsonStr) as Partial<BackupData>;
  if (!parsed.entries || !parsed.products) {
    throw new Error('Invalid backup file format.');
  }

  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(parsed.entries));
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(parsed.products));
  if (parsed.khata) {
    localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(parsed.khata));
  }
  if (parsed.profile) {
    localStorage.setItem(STORAGE_KEY_STORE_PROFILE, JSON.stringify(parsed.profile));
  }
  if (parsed.transactions) {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(parsed.transactions));
  }

  return {
    profile: parsed.profile,
    entries: parsed.entries,
    products: parsed.products,
    khata: parsed.khata || [],
    transactions: parsed.transactions || [],
  };
}

