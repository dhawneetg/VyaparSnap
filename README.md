# 🏪 VyaparSnap (व्यापार स्नैप)

> **"3-Tap Counter by day. 3-Number Profit by night. Zero confusion."**

An ultra-streamlined, offline-first Progressive Web App (PWA) designed for small retail businesses, neighborhood Kirana stores, and local merchants. VyaparSnap eliminates bulky ₹25,000 POS hardware, expensive SMS gateways, and fragile thermal printers in favor of a 10-second smartphone checkout, zero-cost WhatsApp billing, virtual soundbox audio confirmation, and an instant daily profit & loss reconciler.

Built for the **CYBORG CLUB X UNSTOP Digital DNA Hackathon**.

---

## 📌 Problem & Motivation

India and emerging markets host over **15 million independent micro-retailers** (Kirana stores, small boutiques, neighborhood marts). These merchants are trapped between two unworkable extremes:

1. **Complex POS & Accounting Systems (Tally, Zoho Books, SAP):**
   * Multi-level menus, deep modal dialogs, and mandatory tax setup.
   * Completely unusable during rush hours when shopkeepers have 10 seconds per customer.
   * Requires expensive dedicated hardware (₹10,000–₹25,000).
2. **Paper Registers (Bahi Khata):**
   * Prone to arithmetic errors, torn receipts, and forgotten credit accounts.
   * Zero visibility into true daily profit: *"Did I actually make money today after paying wholesale vendors, electricity, and shop rent?"*

**VyaparSnap solves this with a singular dual-purpose design:** high-speed checkout during peak daylight counter hours, and 60-second financial reconciliation at closing.

---

## ✨ Key Features & Pillars

### 1. ⚡ 3-Tap Express Counter (Day Operations)
* **High-Frequency Staple Tiles:** Top 12 daily essentials (Milk, Bread, Eggs, Atta, Sugar, Oil) as large, 1-tap touch cards with live stock counters.
* **Rapid 48px On-Screen Touch Numpad:** Dedicated 48px touch dialer (0–9, +10, +20, +50, +100, +200, Clear, Backspace) to ring up unlisted items without bringing up the cumbersome mobile OS keyboard.
* **Under 10-Second Checkout:** Add items, select payment mode, and complete checkout in under 3 taps.

### 2. 💬 Zero-Cost WhatsApp Digital Slip Engine
* Uses standard RFC 3986 URL deep links (`https://wa.me/91{phone}?text={encodedSlip}`) directly opening the merchant's WhatsApp app.
* No paid WhatsApp Business API credits, no SMS gateway fees, and no thermal paper rolls required.
* Generates clean, itemized customer receipts with store name, date, items, total, and payment mode.

### 3. 📱 Dynamic NPCI UPI QR Generator
* Instant on-screen NPCI UPI QR code generation via `qrcode.react`.
* Customers scan directly from the shopkeeper's phone screen using PhonePe, Google Pay, or Paytm.
* Eliminates the need for external soundbox or terminal rentals (saving ₹125–₹250/month).

### 4. 🔊 Virtual Soundbox & Audio Feedback
* **Web Audio API Cash Chime:** Synthesizes realistic dual-tone cash register bell chimes ($987.77\,\text{Hz} \rightarrow 1318.51\,\text{Hz} \rightarrow 1760\,\text{Hz}$) without relying on external MP3 audio files.
* **Voice Soundbox Announcement:** Uses browser `window.speechSynthesis` to vocalize payment receipts in Hindi or Indian English:
  > *"व्यापार स्नैप पर ₹116 प्राप्त हुए"*

### 5. 🎙️ Voice-to-Ledger Recognition
* Web Speech API integration (`SpeechRecognition`) for hands-free daily closing entry.
* Non-tech-savvy merchants can speak naturally in Hinglish/Indian English (*"Aaj ki bikri barah hazaar, kharcha teen hazaar"*); the system automatically extracts numeric sales and expenses.

### 6. 📦 Traffic-Light Stock Ledger
* Single-glance visual stock status:
  * 🟢 **Green (Healthy):** $\ge 10$ units
  * 🟡 **Yellow (Low Stock Warning):** $1–9$ units
  * 🔴 **Red (Out of Stock):** $0$ units
* **1-Tap Quick Restock Bar:** Single-touch preset pills (`+5`, `+10`, `+25`, `+50`) to replenish inventory counts without filling out forms.
* Automatic stock decrement upon every counter checkout.

### 7. 📖 Customer Khata (Credit Ledger)
* Track neighborhood store credit (Udhari) accounts with ease.
* Automatically appends credit sales to customer accounts.
* **1-Tap WhatsApp Payment Reminders:** Automatically drafts friendly polite reminder messages with an embedded dynamic UPI link (`upi://pay?...`) for direct repayment.

### 8. 📊 End-of-Day P&L Reconciler & 30-Day Calendar Matrix
* Auto-aggregates daily sales into Cash vs. UPI collections.
* Itemized 30-second expense logger (Stock purchase, rent, electricity, helper wages, tea/snacks).
* **Instant Profit Pill:** Color-coded in vibrant Emerald Green for profit or Rose Red for loss:
  $$\text{Net Profit} = \sum \text{Sales} - \sum \text{Expenses}$$
* **30-Day Calendar Matrix:** Monthly grid with daily profit/loss badges (`+₹8,000`, `-₹400`) and habit streak tracking.

### 9. 📈 Executive Analytics & CSV Export
* Interactive 30-day SVG profit trajectory sparkline.
* Weekly sales vs. expense telemetry.
* **1-Click CSV / Excel Export:** Download complete ledger records for tax consultants or audit backups.

### 10. 🛡️ 100% Offline-First PWA & Disaster Recovery
* **PWA Standalone Mode:** Installable directly to Android or iOS home screens.
* **Service Worker Pre-caching:** Boots in under 1 second, even in complete airplane mode during network blackouts.
* **Disaster Recovery:** 1-click **Download JSON Backup** and **Upload JSON Restore** so merchants never lose data when clearing browser history or changing phones.

---

## 🏛️ System Architecture

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

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript |
| **Bundler & Build Tool** | Vite 5 |
| **Styling & Design System** | Tailwind CSS (High-contrast tokens, $48\text{px}+$ touch targets) |
| **Icons & Visuals** | Lucide React, Canvas Confetti |
| **QR Code Engine** | `qrcode.react` (NPCI standard UPI payloads) |
| **Audio & Hardware APIs** | Web Audio API (Synthesized cash chimes), Web SpeechSynthesis API (Virtual Soundbox) |
| **Speech Recognition** | Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **PWA & Offline** | Web App Manifest (`manifest.json`), Service Worker (`sw.js`) |
| **Persistence** | LocalStorage / IndexedDB API with full JSON backup & CSV export |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhawneetg/VyaparSnap.git
   cd VyaparSnap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
├── public/
│   ├── icon.svg                 # Vector PWA application icon
│   ├── manifest.json            # PWA Web App Manifest (standalone, theme colors)
│   └── sw.js                    # Offline caching service worker
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Brand header, backup/restore, desktop navigation
│   │   ├── BottomNav.tsx        # Sticky mobile navigation (48px touch targets)
│   │   ├── CounterView.tsx      # 3-Tap counter, rapid 48px touch pad, live basket
│   │   ├── StockLedgerView.tsx  # Traffic-light stock status & 1-tap restock pills
│   │   ├── KhataView.tsx        # Customer credit accounts & WhatsApp reminder links
│   │   ├── DailyEntryView.tsx   # Daily reconciliation form & voice input
│   │   ├── CalendarView.tsx     # 30-day interactive P&L calendar matrix & streaks
│   │   ├── AnalyticsView.tsx    # 30-day SVG profit curve & CSV spreadsheet export
│   │   └── ReceiptModal.tsx     # Printable slip simulation & WhatsApp share
│   ├── data/
│   │   └── seedData.ts          # Comprehensive September 2026 demo dataset
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Product, Entry, Khata, etc.)
│   ├── utils/
│   │   ├── storage.ts           # Local storage CRUD, formatters, CSV & JSON backup
│   │   ├── audio.ts             # Web Audio register chime & SpeechSynthesis soundbox
│   │   └── voiceInput.ts        # Web Speech API recognition wrapper
│   ├── App.tsx                  # Core controller, reactive state, mobile frame toggle
│   ├── index.css                # Tailwind design system & animations
│   ├── main.tsx                 # App mount & service worker registration
│   └── vite-env.d.ts            # Vite client type references
├── architecture.md              # Detailed technical architecture specification
├── prd.md                       # Comprehensive Product Requirements Document
├── phases.md                    # Roadmap, development milestones & acceptance criteria
├── memory.md                    # Architectural Decision Records (ADRs) & constraints
├── index.html                   # HTML shell with Google Fonts & PWA meta tags
└── package.json                 # Project dependencies & scripts
```

---

## 📊 Business Impact & ROI

| Metric | Traditional Status Quo | With VyaparSnap |
| :--- | :--- | :--- |
| **Counter Checkout Time** | 45–60 seconds (handwritten or manual calculator) | **Under 10 seconds (3 taps)** |
| **Hardware Upfront Cost** | ₹15,000–₹25,000 (POS terminal, barcode scanner, thermal printer) | **₹0 (runs on owner's existing phone)** |
| **Receipt Delivery Cost** | ₹0.20/SMS or paper roll consumption | **₹0 (native WhatsApp deep link)** |
| **Soundbox Monthly Rental** | ₹125–₹250/month (Paytm/PhonePe hardware box) | **₹0 (Virtual Web Audio Soundbox)** |
| **End-of-Day Bookkeeping** | 20–30 minutes of ledger arithmetic | **Under 60 seconds** |
| **Daily P&L Visibility** | Unknown until end of month (or tax audit) | **Real-time, instant** |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
