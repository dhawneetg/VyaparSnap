# Product Requirements Document (PRD): VyaparSnap

**All-in-One Express Counter, WhatsApp Billing & Daily Profit Logger for Small Retail Businesses**

---

### Assigned Digital DNA
* **Technology:** Web / Progressive Web App (PWA)
* **Industry:** Retail
* **Target User:** Small & Micro Businesses (Kirana stores, small boutiques, neighborhood marts)
* **Primary Constraint:** **Simple Interface** (Zero cognitive overhead, 48px+ touch targets, one-handed mobile ergonomics)

---

## 1. Executive Summary & Value Proposition

**VyaparSnap** unifies fast counter operations and daily financial clarity into an ultra-streamlined, offline-first Progressive Web App. Traditional retail software is bloated and desktop-dependent; simple bookkeeping apps don't handle active checkout. VyaparSnap bridges this gap with a single dual-purpose philosophy:

> **"3-Tap Counter by day. 3-Number Profit by night. Zero confusion."**

1. **At the Counter (Speed):** Turn any ₹7,000 Android smartphone into a high-speed POS terminal. Tap 2 items, select Cash/UPI, and dispatch a WhatsApp receipt in under 10 seconds.
2. **At Store Closing (Clarity):** Review daily cash vs. digital collections, log ad-hoc expenses in 30 seconds, and immediately see net profit color-coded green or red.

---

## 2. Problem Statement

India and emerging markets host over 15 million independent micro-retailers (Kirana, clothing, hardware, mobile accessories). They are trapped between two unworkable extremes:

1. **Complex POS & Accounting Systems (Tally, SAP, Zoho Books):**
   * Multi-level navigation, deep modal dialogues, mandatory tax fields, and expensive hardware terminals (₹10,000 – ₹25,000).
   * Unusable during rush hours when shopkeepers have 10 seconds per customer.
2. **Paper Registers / Notebooks (Bahi Khata):**
   * Fast to scribble, but prone to arithmetic mistakes, lost slips, and zero visibility into true daily profit or stock burn.
   * Shopkeepers work 14-hour days without knowing: *"Did I actually make money today after paying rent, electricity, and stock replenishment?"*

---

## 3. Target User & Persona

### Primary Persona: Ramesh Kumar
* **Age:** 42
* **Business:** Neighborhood Kirana & General Store (Single counter, ~150–250 transactions/day)
* **Device:** Budget Android Smartphone (Redmi / Realme, 4G / spotty Wi-Fi)
* **Tech Comfort:** High comfort with WhatsApp and UPI apps (PhonePe / GPay / Paytm soundbox), low comfort with spreadsheets or enterprise menus.
* **Operational Reality:** Operates the counter solo or with one family member. Holds a phone in one hand while packing groceries with the other.

### User Requirements:
* Must be operable with one thumb (large 48px+ tap targets).
* Must work 100% offline during power cuts or network slowdowns.
* Zero mandatory setup: No 10-step catalog imports before ringing up the first sale.

---

## 4. Product Solution & Core Pillars

VyaparSnap eliminates navigation trees. The application consists of three focused screens accessible via a persistent bottom navigation bar:

```
  ┌────────────────────────────────────────────────────────┐
  │                      VyaparSnap                        │
  ├───────────────────┬────────────────────┬───────────────┤
  │  [⚡ Counter]     │  [📦 Stock Alert]  │  [📊 Day P&L] │
  │  3-Tap Billing    │  Traffic-Light     │  Daily Profit │
  │  & WhatsApp Slip  │  Swipe Restock     │  & History    │
  └───────────────────┴────────────────────┴───────────────┘
```

---

## 5. Detailed Feature Specifications

### 5.1. Pillar 1: Express Counter & WhatsApp Billing (Day Operations)
* **Quick Item Tiles:** Top 8–12 highest-frequency items (Milk, Bread, Eggs, Sugar, Atta) as large touch cards.
* **Custom ₹ Amount Dialer:** Single-tap keypad to enter ad-hoc price amounts for unlisted items without creating formal SKUs.
* **Dual Payment Split:** Instant toggle between `[💵 CASH]` and `[📱 UPI / QR]`.
* **Zero-Cost WhatsApp Digital Slip:**
  * Uses standard WhatsApp URI deep-linking (`https://wa.me/<number>?text=<encoded_bill>`).
  * Works on native WhatsApp without paid WhatsApp Business API credits or thermal receipt printers.
  * Formatted with shop name, date/time, itemized list, total, and payment mode.

### 5.2. Pillar 2: End-of-Day P&L & Cash Reconciler (Closing Operations)
* **Automated Sales Totalizer:** Automatically pulls daily counter collections categorized into Cash vs. UPI.
* **30-Second Expense Logger:** Simple input field for store expenses (e.g., Vendor stock purchase, helper wages, tea/snacks, electricity).
* **Instant Net Profit Display:**
  $$\text{Net Profit} = (\text{Total Counter Sales}) - (\text{Daily Expenses})$$
  * Bold color-coded card: **Vibrant Green** for profit, **Muted Crimson** for loss.
* **Monthly Calendar Ledger:** Visual 30-day grid with daily net badges (`+₹4,200`, `-₹800`) to highlight weekly trends and loss patterns instantly.

### 5.3. Pillar 3: Visual "Traffic Light" Stock Monitor
* **Single-Glance Inventory:**
  * 🟢 **Green:** Safe stock (> 10 units)
  * 🟡 **Yellow:** Low stock warning (1–9 units)
  * 🔴 **Red:** Out of stock (0 units)
* **Gesture Restock:** Quick swipe or single tap presets (`+5`, `+10`, `+25`, `+50`) to adjust counts without opening edit modals.

### 5.4. Offline-First PWA Engine
* Service worker caching allows the entire app to boot in <1 second even in airplane mode.
* Transaction writes persist locally to IndexedDB immediately, queueing cloud sync in the background when connectivity resumes.

---

## 6. Scope Boundaries: What We Are NOT Building (Anti-Scope)

To protect the **Simple Interface** constraint and ensure delivery within hackathon timelines, the following features are strictly excluded:

| Feature | Reason for Exclusion | Alternative in VyaparSnap |
| :--- | :--- | :--- |
| **Complex Barcode Scanner SDKs** | Slow camera autofocus on budget phones creates counter friction. | High-frequency preset tiles + quick custom amount dialer. |
| **GST / Tax Invoicing / Multi-Hassle HSN** | Overwhelms micro-kiranas; requires extensive accounting setup. | Clean digital summary receipt suitable for retail consumers. |
| **Thermal Printer Bluetooth Drivers** | Fragile pairing; high upfront hardware cost (₹3,000–₹6,000). | WhatsApp deep-link paperless receipt (`wa.me`). |
| **Deep ERP Multi-Level Categories** | Buries items under 4–5 folder layers. | Flat 12 frequent tiles + quick search + single dialer. |
| **Mandatory User Sign-Up Wall** | Blocks immediate usage on first launch. | Instant local guest access; optional cloud backup sync. |

---

## 7. Technology Stack

* **Frontend Framework:** Next.js (App Router) / React 19 + TypeScript
* **Styling & Design System:** Tailwind CSS with custom high-contrast tokens (minimum 48px touch targets, Inter/Outfit typography, dark/light contrast optimization).
* **Local Storage & Offline Engine:** IndexedDB (via `idb` / Dexie.js wrapper) + Service Workers (PWA manifest).
* **Backend & Cloud Persistence:** Supabase (PostgreSQL + Row Level Security) for cloud backup and multi-device ledger sync.
* **Communication Protocol:** RFC 3986 compliant URL encoder for direct WhatsApp Web/App deep-linking.
* **Deployment:** Vercel Edge Network.

---

## 8. Screen Layouts & Wireframes

### Screen 1: Express Counter
```text
+-------------------------------------------------------+
|  VyaparSnap                       [ ₹ Cart: 116.00 ]  |
+-------------------------------------------------------+
|  FREQUENT ITEMS                                       |
|  +-------------------+  +-------------------+         |
|  | Milk 500ml (₹33)  |  | Bread Pack (₹25)  |         |
|  +-------------------+  +-------------------+         |
|  | Sugar 1kg  (₹42)  |  | Eggs (6 pcs) (₹40)|         |
|  +-------------------+  +-------------------+         |
|  | [ + Custom ₹ ]    |  | [ 🔍 Search Item ] |        |
|  +-------------------+  +-------------------+         |
+-------------------------------------------------------+
|  CURRENT TICKET (2 Items)                             |
|  * 2x Milk 500ml                            ₹66.00   |
|  * 1x Butter 100g                           ₹50.00   |
+-------------------------------------------------------+
|  PAYMENT MODE:                                        |
|  [   💵 CASH (₹116)   ]   |   [   📱 UPI QR (₹116)  ] |
+-------------------------------------------------------+
|  [ 💬 SHARE WHATSAPP RECEIPT & COMPLETE SALE (1 Tap) ] |
+-------------------------------------------------------+
|  [⚡ Counter]       [📦 Stock Ledger]     [📊 Day P&L]|
+-------------------------------------------------------+
```

### Screen 2: End-of-Day Profit & Reconciliation Screen
```text
+-------------------------------------------------------+
|  VyaparSnap — Daily Closing         26 Sep 2026       |
+-------------------------------------------------------+
|  TODAY'S REVENUE (Auto-Calculated from Counter)       |
|  💵 Cash: ₹4,850  |  📱 UPI: ₹6,350  | Total: ₹11,200 |
+-------------------------------------------------------+
|  TODAY'S EXPENSES                                     |
|  [ ₹ Enter expense amount... (e.g. 3200)            ] |
|  [ Note: Stock purchase / Vegetable mandi / Rent     ] |
|  [ + ADD EXPENSE RECORD ]                             |
+-------------------------------------------------------+
|  ╔═════════════════════════════════════════════════╗  |
|  ║  TODAY'S NET PROFIT                             ║  |
|  ║  ₹11,200 (Sales) - ₹3,200 (Expenses)            ║  |
|  ║  ---------------------------------------------  ║  |
|  ║  ✅ NET PROFIT: +₹8,000                         ║  |
|  ╚═════════════════════════════════════════════════╝  |
+-------------------------------------------------------+
|  CALENDAR SNAPSHOT (Last 5 Days)                      |
|  [Mon: +₹6.2k] [Tue: +₹7.1k] [Wed: -₹400] [Thu: +₹8k] |
+-------------------------------------------------------+
|  [⚡ Counter]       [📦 Stock Ledger]     [📊 Day P&L]|
+-------------------------------------------------------+
```

---

## 9. Expected Impact & Value Delivered

| Metric | Traditional Status Quo | With VyaparSnap |
| :--- | :--- | :--- |
| **Counter Checkout Time** | 45–60 seconds (handwritten or manual calculator) | **Under 10 seconds (3 taps)** |
| **Hardware Upfront Cost** | ₹15,000–₹25,000 (POS, scanner, thermal printer) | **₹0 (runs on owner's existing phone)** |
| **Receipt Delivery Cost** | ₹0.20/SMS or paper roll consumption | **₹0 (WhatsApp deep link)** |
| **End-of-Day Bookkeeping** | 20–30 mins of ledger calculation | **Under 60 seconds** |
| **Daily P&L Visibility** | Unknown until end of month (or tax audit) | **Real-time, instant** |

---

## 10. Success Metrics & Key Performance Indicators (KPIs)

* **Counter Velocity:** Average transaction creation to WhatsApp trigger time $< 10$ seconds.
* **Day-Close Completion Rate:** $> 80\%$ of active users complete the 60-second Day-Close P&L log.
* **App Performance:** First Contentful Paint (FCP) $< 0.8$s; offline checkout operational $100\%$ without network drops.
* **User Stickiness:** $\ge 25$ days active billing per store/month.

---

## 11. Delivery Roadmap & Hackathon Milestones

* **Milestone 1 (Day 1–2):** Architecture setup, IndexedDB local store schema, UI design system with simple high-contrast touch targets.
* **Milestone 2 (Day 3–4):** Express Counter module, dynamic ticket calculation, WhatsApp URI formatting engine.
* **Milestone 3 (Day 5–6):** Daily Closing & P&L calculation module, expense logger, calendar history view.
* **Milestone 4 (Day 7):** PWA offline caching verification, end-to-end testing, responsive polish, and Vercel deployment.
