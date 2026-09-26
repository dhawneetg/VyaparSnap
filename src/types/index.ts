export interface Product {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  category: 'Dairy & Bakery' | 'Staples & Grains' | 'Packaged Food' | 'Personal & Home' | 'Beverages';
  icon: string;
  isFrequent: boolean;
  unit: string; // e.g. 'pack', 'kg', 'ltr', 'pcs'
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  qty: number;
  icon?: string;
}

export interface KhataRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  date: string;
  notes: string;
  isSettled: boolean;
  settledAt?: string;
}

export interface ExpenseBreakdown {
  id: string;
  category: 'Wholesale / Stock' | 'Electricity & Rent' | 'Staff Wages' | 'Tea & Misc' | 'Delivery & Transport';
  amount: number;
}

export interface DailyEntry {
  date: string; // 'YYYY-MM-DD'
  sales: number;
  expenses: number;
  cashSales: number;
  upiSales: number;
  khataSales?: number;
  transactionCount?: number;
  notes?: string;
  expenseItems?: ExpenseBreakdown[];
  createdAt?: string;
  updatedAt?: string;
}

export type ActiveTab = 'counter' | 'stock' | 'khata' | 'entry' | 'calendar' | 'analytics';

export interface MonthlyStats {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  profitMarginPercent: number;
  profitableDaysCount: number;
  lossDaysCount: number;
  totalDaysLogged: number;
  avgDailySales: number;
  avgDailyExpenses: number;
  highestSalesDay: { date: string; amount: number };
  mostProfitableDay: { date: string; amount: number };
}
