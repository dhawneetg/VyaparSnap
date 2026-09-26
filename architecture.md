# System Architecture Document: VyaparSnap

This document details the software architecture, data flow, component hierarchy, database schemas, hardware abstraction pipelines, and offline-first engine powering **VyaparSnap** (formerly SalesSnap).

---

## 1. High-Level Architectural Pattern

VyaparSnap is designed around a **Local-First, Offline-Ready Progressive Web Architecture (PWA)** specifically optimized for Indian micro-retail environments (Kirana stores, neighborhood boutiques, quick-service counters). The client device acts as the single primary source of truth; network synchronization, soundbox synthesis, and messaging pipelines operate asynchronously without blocking checkout flows.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT RUNTIME (Mobile Browser / PWA Standalone)                │
│                                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   ⚡ Express      │  │  📦 Traffic-Light│  │  📖 Customer    │  │   📊 Day P&L    │  │
│  │   Counter View   │  │   Stock Ledger   │  │   Khata Ledger  │  │   Reconciler    │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                     │                     │                    │           │
│           ▼                     ▼                     ▼                    ▼           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     Application State & Reactive Data Layer                      │  │
│  │           • Active Cart      • Live Products      • Daily Entries & Khata        │  │
│  └──────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                         │                                              │
│                                         ▼                                              │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                      Local Storage & IndexedDB Engine (Storage API)              │  │
│  │    [products]         [entries / ledger]         [khata_records]     [metadata]  │  │
│  └──────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                         │                                              │
│                   ┌─────────────────────┼─────────────────────┐                        │
│                   ▼                     ▼                     ▼                        │
│         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐               │
│         │ Service Worker   │  │ Hardware & Audio │  │ WhatsApp & UPI   │               │
│         │ (Offline Cache)  │  │ (Soundbox/Voice) │  │ URI Protocols    │               │
│         └─────────┬────────┘  └──────────────────┘  └──────────────────┘               │
└───────────────────┼────────────────────────────────────────────────────────────────────┘
                    │ (When Network Available)
                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     CLOUD BACKEND & ASYNC PERSISTENCE (Optional Sync)                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │    PostgreSQL Ledger Backup • Row Level Security (RLS) • Merchant Sync Queue     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Models & Schemas

The application schema supports atomic day-to-day point-of-sale transactions, multi-category inventory tracking, customer credit accounts (Khata), and historical P&L analytics:

```typescript
// types/index.ts

/**
 * Product Catalog & Stock Unit
 */
export interface Product {
  id: string;              // Unique identifier (UUID or p{n})
  name: string;            // e.g. "Amul Taaza Milk 500ml"
  price: number;           // Unit price in ₹
  stockQty: number;        // Current inventory count
  category: 
    | 'Dairy & Bakery' 
    | 'Staples & Grains' 
    | 'Packaged Food' 
    | 'Personal & Home' 
    | 'Beverages';
  icon: string;            // Emoji or SVG glyph
  isFrequent: boolean;     // Pinned to rapid 1-tap counter grid
  unit: string;            // 'pouch' | 'kg' | 'pack' | 'pcs' | 'ltr'
}

/**
 * Active Point-of-Sale Line Item
 */
export interface CartItem {
  id: string;              // Cart instance UUID
  productId?: string;      // Catalog link (optional for ad-hoc custom ₹ entries)
  name: string;
  price: number;
  qty: number;
  icon?: string;
}

/**
 * Customer Khata (Credit Ledger) Entry
 */
export interface KhataRecord {
  id: string;              // Record UUID
  customerName: string;    // e.g. "Ramesh Sharma (Flat 302)"
  customerPhone: string;   // 10-digit mobile number for WhatsApp reminder
  amount: number;          // Outstanding credit amount in ₹
  date: string;            // 'YYYY-MM-DD'
  notes: string;           // Items purchased on credit
  isSettled: boolean;      // Settlement status flag
  settledAt?: string;      // ISO timestamp of repayment
}

/**
 * Categorized Daily Outflow
 */
export interface ExpenseBreakdown {
  id: string;
  category: 
    | 'Wholesale / Stock' 
    | 'Electricity & Rent' 
    | 'Staff Wages' 
    | 'Tea & Misc' 
    | 'Delivery & Transport';
  amount: number;
}

/**
 * Daily Consolidated Financial Ledger Entry
 */
export interface DailyEntry {
  date: string;            // Primary Key: 'YYYY-MM-DD'
  sales: number;           // Total counter revenue in ₹
  expenses: number;        // Total business expenditure in ₹
  cashSales: number;       // Physical cash collected
  upiSales: number;        // Digital UPI QR payments received
  khataSales?: number;     // Sales extended on credit (Udhari)
  transactionCount?: number; // Total customer slips processed
  notes?: string;          // Day summary notes
  expenseItems?: ExpenseBreakdown[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Aggregated 30-Day Executive Telemetry
 */
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
```

---

## 3. Component Hierarchy & Modular Structure

The codebase is built on **Vite + React 18 + TypeScript**, styled with Tailwind CSS, utilizing high-contrast tokens ($48\text{px}+$ touch targets) and zero multi-level modal trees:

```
src/
├── main.tsx                     # Entry point & PWA service worker registration
├── App.tsx                      # Root application controller & reactive state hub
├── index.css                    # Tailwind design system tokens & micro-animations
│
├── components/
│   ├── Header.tsx               # Brand identity, desktop tab navigation & quick actions
│   ├── BottomNav.tsx            # Sticky mobile bottom bar (thumb-friendly 48px targets)
│   │
│   ├── CounterView.tsx          # 3-Tap Express Counter & live cart manager
│   ├── StockLedgerView.tsx      # Traffic-light inventory cards with 1-tap restock pills
│   ├── KhataView.tsx            # Credit register & 1-tap WhatsApp payment reminders
│   ├── DailyEntryView.tsx       # 30-second end-of-day closing reconciler & voice input
│   ├── CalendarView.tsx         # 30-day interactive P&L calendar matrix & habit streak
│   ├── AnalyticsView.tsx        # 30-day SVG profit curve & CSV ledger export
│   └── ReceiptModal.tsx         # Printable slip & daily financial summary preview
│
├── data/
│   └── seedData.ts              # Pre-seeded September 2026 data for instant demo verification
│
├── types/
│   └── index.ts                 # Strict TypeScript schemas and tab definitions
│
└── utils/
    ├── storage.ts               # Local persistence engine, formatters, and seed state
    ├── audio.ts                 # Web Audio cash chime & speech synthesis soundbox
    └── voiceInput.ts            # Web Speech API recognition for voice sales entry
```

---

## 4. Key Functional Pipelines

### 4.1. Zero-Cost WhatsApp Receipt Dispatch Pipeline
VyaparSnap bypasses expensive third-party messaging APIs (Twilio, Gupshup, Meta Business API) by generating RFC 3986 compliant deep links that invoke the merchant's native WhatsApp client:

$$\text{Target URL} = \texttt{https://wa.me/91} + \text{phoneNumber} + \texttt{?text=} + \text{encodeURIComponent}(\text{ReceiptSlip})$$

#### Generated Receipt Format:
```text
🧾 *RAMESH KIRANA STORE*
Date: 26 Sep 2026
--------------------------
• 2x Amul Taaza Milk 500ml — ₹66
• 1x Modern Bread — ₹25
• 1x Custom Item — ₹25
--------------------------
*TOTAL BILL: ₹116*
Payment Mode: UPI ✅

Thank you for shopping with us! 🙏
```

### 4.2. NPCI-Standard Dynamic UPI QR Engine
When the shopkeeper selects `[📱 UPI / QR]`, the application dynamically generates a standardized NPCI string rendered via `qrcode.react`:

```text
upi://pay?pa=rameshkirana@okhdfcbank&pn=RameshKiranaStore&am=116&cu=INR&tn=Bill-4921
```
* **No external hardware soundbox needed:** The customer scans directly from the merchant's smartphone screen using PhonePe, Google Pay, or Paytm.

### 4.3. Virtual Soundbox & Audio Feedback Pipeline
Micro-merchants rely on sound confirmation during noisy market hours:
1. **Web Audio API Chime:** Generates dual harmonic frequencies ($987.77\,\text{Hz} \rightarrow 1318.51\,\text{Hz}$ with an exponential decay bell curve at $1760\,\text{Hz}$) to simulate a high-end physical cash register bell without relying on external MP3 assets.
2. **Text-to-Speech Announcement:** Uses the browser `window.speechSynthesis` API to vocalize payment receipt in Hindi or Indian English:
   $$\text{Voice Output: } \textit{"सेल्स स्नैप पर } X \textit{ रुपये प्राप्त हुए"}$$

### 4.4. Voice-to-Ledger Recognition Pipeline
To eliminate typing friction for non-tech-savvy merchants, `voiceInput.ts` interfaces with the browser's `webkitSpeechRecognition`:
* Supports Indian English / Hinglish spoken commands (e.g., *"Aaj ki bikri barah hazaar, kharcha chaar hazaar"*).
* Regex filters automatically parse numeric values and route them to `sales` or `expenses` fields.

### 4.5. Customer Khata & Dynamic Reminder Pipeline
Credit sales (Udhari) are a cornerstone of neighborhood retail:
* When a sale is completed with `KHATA` payment mode, the items are automatically logged to the customer's ledger.
* Merchants can send a 1-tap WhatsApp payment reminder embedded with a direct UPI repayment link:
  $$\text{Reminder: } \textit{"Namaste ji, your pending balance is ₹} X \textit{ for } Y \textit{. Pay via UPI: } \texttt{upi://pay?...}$$

### 4.6. End-of-Day Profit Aggregation Engine
When navigating to the **[📊 Day P&L]** screen, the system calculates daily performance:
1. Aggregates cash, UPI, and credit sales for the selected date.
2. Deducts itemized expenses (Wholesale stock, rent, electricity, wages).
3. Computes:
   $$\text{Net Profit} = \sum \text{Sales} - \sum \text{Expenses}$$
4. Dynamically evaluates financial health:
   * $\text{Net Profit} \ge 0$: **Emerald Green** `#059669` (Profit)
   * $\text{Net Profit} < 0$: **Rose Crimson** `#E11D48` (Loss)
5. Generates printable paper receipts and monthly visual calendar heatmaps.

---

## 5. Security, Resilience & Offline Guarantees

* **Zero-Cloud Lockout:** 100% of core features (counter billing, stock decrement, Khata tracking, P&L calculations) function without internet.
* **Service Worker Caching Strategy:**
  * **Core App Shell & Scripts:** Cache-First strategy ensuring sub-second boot times.
  * **Dynamic Google Fonts & Icons:** Stale-While-Revalidate caching.
* **Data Portability & Disaster Recovery:**
  * **JSON Backup & Restore:** Merchants can export a complete JSON snapshot of their ledger to WhatsApp or local storage, preventing loss during device changes.
  * **CSV Audit Export:** One-click spreadsheet export for tax advisors or family record-keeping.
* **Privacy by Design:** All transaction data and customer telephone numbers remain on device storage; zero telemetry is sold to third-party ad networks.
