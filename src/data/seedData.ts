import { DailyEntry, Product, KhataRecord } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Amul Taaza Milk 500ml', price: 33, stockQty: 24, category: 'Dairy & Bakery', icon: '🥛', isFrequent: true, unit: 'pouch' },
  { id: 'p2', name: 'Modern Bread (White)', price: 25, stockQty: 14, category: 'Dairy & Bakery', icon: '🍞', isFrequent: true, unit: 'pack' },
  { id: 'p3', name: 'Farm Fresh Eggs', price: 42, stockQty: 30, category: 'Dairy & Bakery', icon: '🥚', isFrequent: true, unit: '6 pcs' },
  { id: 'p4', name: 'Amul Butter 100g', price: 58, stockQty: 6, category: 'Dairy & Bakery', icon: '🧈', isFrequent: true, unit: 'pack' }, // Yellow: Low stock
  { id: 'p5', name: 'Madhur Sugar Pure', price: 44, stockQty: 45, category: 'Staples & Grains', icon: '🧂', isFrequent: true, unit: '1 kg' },
  { id: 'p6', name: 'Aashirvaad Shudh Atta', price: 210, stockQty: 3, category: 'Staples & Grains', icon: '🌾', isFrequent: true, unit: '5 kg' }, // Yellow: Low stock
  { id: 'p7', name: 'Fortune Sunlite Oil', price: 145, stockQty: 0, category: 'Staples & Grains', icon: '🛢️', isFrequent: false, unit: '1 ltr' }, // Red: Out of stock
  { id: 'p8', name: 'Tata Tea Gold', price: 130, stockQty: 18, category: 'Beverages', icon: '☕', isFrequent: true, unit: '250 g' },
  { id: 'p9', name: 'Parle-G Gold Biscuits', price: 10, stockQty: 50, category: 'Packaged Food', icon: '🍪', isFrequent: true, unit: 'pack' },
  { id: 'p10', name: 'Maggi 2-Minute Noodles', price: 14, stockQty: 0, category: 'Packaged Food', icon: '🍜', isFrequent: true, unit: 'pack' }, // Red: Out of stock
  { id: 'p11', name: 'Tata Salt Vaccum', price: 28, stockQty: 32, category: 'Staples & Grains', icon: '🧂', isFrequent: false, unit: '1 kg' },
  { id: 'p12', name: 'India Gate Basmati Rice', price: 160, stockQty: 8, category: 'Staples & Grains', icon: '🍚', isFrequent: false, unit: '1 kg' }, // Yellow
  { id: 'p13', name: 'Toor Dal Premium', price: 175, stockQty: 15, category: 'Staples & Grains', icon: '🥣', isFrequent: false, unit: '1 kg' },
  { id: 'p14', name: 'Dettol Soap Original', price: 38, stockQty: 22, category: 'Personal & Home', icon: '🧼', isFrequent: false, unit: 'bar' },
  { id: 'p15', name: 'Surf Excel Detergent', price: 65, stockQty: 19, category: 'Personal & Home', icon: '🧺', isFrequent: false, unit: '500 g' },
  { id: 'p16', name: 'Coca-Cola Can', price: 40, stockQty: 5, category: 'Beverages', icon: '🥤', isFrequent: false, unit: '300 ml' }, // Yellow
];

export const INITIAL_KHATA_RECORDS: KhataRecord[] = [
  {
    id: 'k1',
    customerName: 'Ramesh Sharma (Flat 302)',
    customerPhone: '9876543210',
    amount: 650,
    date: '2026-09-24',
    notes: '2x Atta bag + Cooking oil on credit',
    isSettled: false,
  },
  {
    id: 'k2',
    customerName: 'Sunita Devi (Tailor Shop)',
    customerPhone: '9823456789',
    amount: 320,
    date: '2026-09-25',
    notes: 'Weekly milk and eggs account',
    isSettled: false,
  },
  {
    id: 'k3',
    customerName: 'Rajesh Verma (Taxi Driver)',
    customerPhone: '9811223344',
    amount: 1150,
    date: '2026-09-22',
    notes: 'Monthly staples package',
    isSettled: false,
  },
  {
    id: 'k4',
    customerName: 'Anil Gupta (Shop #4)',
    customerPhone: '9899887766',
    amount: 480,
    date: '2026-09-20',
    notes: 'Tea & snacks for market workers',
    isSettled: true,
    settledAt: '2026-09-23',
  },
];

export const INITIAL_SEED_ENTRIES: Record<string, DailyEntry> = {
  '2026-09-01': {
    date: '2026-09-01',
    sales: 12000,
    expenses: 7000,
    cashSales: 7500,
    upiSales: 4500,
    transactionCount: 38,
    notes: 'Monthly staples restocked (Atta & Rice bags)',
    expenseItems: [
      { id: '1', category: 'Wholesale / Stock', amount: 6000 },
      { id: '2', category: 'Tea & Misc', amount: 1000 },
    ],
  },
  '2026-09-02': {
    date: '2026-09-02',
    sales: 9500,
    expenses: 4500,
    cashSales: 6000,
    upiSales: 3500,
    transactionCount: 29,
    notes: 'Smooth sales, milk delivered early',
    expenseItems: [{ id: '1', category: 'Wholesale / Stock', amount: 4500 }],
  },
  '2026-09-03': {
    date: '2026-09-03',
    sales: 6000,
    expenses: 7000, // Loss day: -₹1,000
    cashSales: 3800,
    upiSales: 2200,
    transactionCount: 19,
    notes: 'Heavy rains in market area, generator diesel purchased',
    expenseItems: [
      { id: '1', category: 'Electricity & Rent', amount: 4000 },
      { id: '2', category: 'Wholesale / Stock', amount: 3000 },
    ],
  },
  '2026-09-04': { date: '2026-09-04', sales: 11000, expenses: 3000, cashSales: 7000, upiSales: 4000, transactionCount: 34, notes: 'Festival sweets stock arrived' },
  '2026-09-05': { date: '2026-09-05', sales: 8500, expenses: 5500, cashSales: 5000, upiSales: 3500, transactionCount: 27, notes: 'Normal weekend rush' },
  '2026-09-06': { date: '2026-09-06', sales: 13000, expenses: 7000, cashSales: 8000, upiSales: 5000, transactionCount: 42, notes: 'Sunday morning grocery rush' },
  '2026-09-07': { date: '2026-09-07', sales: 8000, expenses: 4000, cashSales: 4800, upiSales: 3200, transactionCount: 26, notes: 'Standard Monday sales' },
  '2026-09-08': { date: '2026-09-08', sales: 7500, expenses: 5500, cashSales: 4500, upiSales: 3000, transactionCount: 24, notes: 'Snack supplier invoice settled' },
  '2026-09-09': { date: '2026-09-09', sales: 14000, expenses: 5000, cashSales: 8500, upiSales: 5500, transactionCount: 45, notes: 'Cooking oil carton orders cleared' },
  '2026-09-10': { date: '2026-09-10', sales: 7000, expenses: 4000, cashSales: 4200, upiSales: 2800, transactionCount: 23, notes: 'Regular retail trade' },
  '2026-09-11': { date: '2026-09-11', sales: 12500, expenses: 5500, cashSales: 7500, upiSales: 5000, transactionCount: 39, notes: 'Wholesale cold drinks refilled' },
  '2026-09-12': { date: '2026-09-12', sales: 5500, expenses: 6000, cashSales: 3500, upiSales: 2000, transactionCount: 18, notes: 'Shop painting touch-up & minor repairs' },
  '2026-09-13': { date: '2026-09-13', sales: 9000, expenses: 5000, cashSales: 5500, upiSales: 3500, transactionCount: 31, notes: 'Sunday dairy sales high' },
  '2026-09-14': { date: '2026-09-14', sales: 10000, expenses: 4000, cashSales: 6000, upiSales: 4000, transactionCount: 33, notes: 'Bread and egg supply replenished' },
  '2026-09-15': { date: '2026-09-15', sales: 11500, expenses: 3500, cashSales: 7000, upiSales: 4500, transactionCount: 37, notes: 'Stationery & packing items restocked' },
  '2026-09-16': { date: '2026-09-16', sales: 8500, expenses: 3500, cashSales: 5000, upiSales: 3500, transactionCount: 28, notes: 'Midweek steady transactions' },
  '2026-09-17': { date: '2026-09-17', sales: 7800, expenses: 4800, cashSales: 4700, upiSales: 3100, transactionCount: 25, notes: 'Cleaning and sanitation supplies bought' },
  '2026-09-18': { date: '2026-09-18', sales: 6900, expenses: 4900, cashSales: 4100, upiSales: 2800, transactionCount: 22, notes: 'Grains & pulses weighed and packed' },
  '2026-09-19': { date: '2026-09-19', sales: 8200, expenses: 4200, cashSales: 5000, upiSales: 3200, transactionCount: 27, notes: 'Good confectionery sales' },
  '2026-09-20': { date: '2026-09-20', sales: 9100, expenses: 4100, cashSales: 5500, upiSales: 3600, transactionCount: 30, notes: 'Family bulk grocery shopping' },
  '2026-09-21': { date: '2026-09-21', sales: 18500, expenses: 10000, cashSales: 11000, upiSales: 7500, transactionCount: 58, notes: 'Festival pre-orders and massive dry fruit sales' },
  '2026-09-22': { date: '2026-09-22', sales: 14200, expenses: 5000, cashSales: 8700, upiSales: 5500, transactionCount: 46, notes: 'Outstanding vendor bulk purchase clearance' },
  '2026-09-23': { date: '2026-09-23', sales: 8400, expenses: 4400, cashSales: 5100, upiSales: 3300, transactionCount: 27, notes: 'Dairy and bakery evening sales' },
  '2026-09-24': { date: '2026-09-24', sales: 7900, expenses: 3900, cashSales: 4700, upiSales: 3200, transactionCount: 26, notes: 'Quick day with high UPI percentage' },
  '2026-09-25': { date: '2026-09-25', sales: 9000, expenses: 4000, cashSales: 5400, upiSales: 3600, transactionCount: 30, notes: 'Advance orders taken for weekend' },
  '2026-09-26': {
    date: '2026-09-26',
    sales: 15000,
    expenses: 8000,
    cashSales: 9200,
    upiSales: 5800,
    transactionCount: 49,
    notes: 'Stock purchase from APMC market, van delivery paid',
    expenseItems: [
      { id: '1', category: 'Wholesale / Stock', amount: 6500 },
      { id: '2', category: 'Electricity & Rent', amount: 1500 },
    ],
  },
};
