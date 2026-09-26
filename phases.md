# Implementation Phases & Development Roadmap: VyaparSnap

This document outlines the structured execution plan, milestone deliverables, task checklists, and acceptance criteria for developing **VyaparSnap**.

---

## 🗺️ High-Level Milestone Overview

```
Phase 0 ───> Phase 1 ───> Phase 2 ───> Phase 3 ───> Phase 4 ───> Phase 5 ───> Phase 6 & 7
Setup &      IndexedDB    Express       WhatsApp &    Traffic       Day-Close     PWA Offline
Design Sys   Layer        Counter       UPI QR        Stock         P&L Ledger    & Ship
```

---

## Phase 0: Project Scaffolding & Design Foundation
**Goal:** Establish clean repository structure, design tokens, and ergonomics adhering to the **Simple Interface** constraint.

- [ ] Initialize Next.js project with TypeScript and App Router.
- [ ] Install Tailwind CSS, `lucide-react`, `clsx`, `tailwind-merge`, and `dexie`.
- [ ] Configure Tailwind theme tokens:
  - Minimum touch targets: `min-h-[48px]`, `min-w-[48px]`.
  - Color palette: High-contrast Dark Slate (`#0F172A`), Emerald Green (`#10B981`), Amber Yellow (`#F59E0B`), Rose Red (`#F43F5E`).
- [ ] Build global `BottomNavbar` with the 3 core views:
  - `[⚡ Counter]`
  - `[📦 Stock]`
  - `[📊 Day P&L]`
- **Acceptance Criteria:** Mobile-responsive frame displays persistent 3-tab navigation with one-handed thumb ergonomics.

---

## Phase 1: Local Storage Engine & Seed Data
**Goal:** Implement zero-latency IndexedDB persistence layer.

- [ ] Configure Dexie database class in `lib/db.ts` with stores:
  - `products`: `++id, name, price, stockQty, isFrequent`
  - `transactions`: `++id, timestamp, dateStr, totalAmount, paymentMode`
  - `expenses`: `++id, timestamp, dateStr, amount, category`
  - `daily_logs`: `dateStr, totalSales, totalExpenses, netProfit`
- [ ] Create seed utility populating 12 common Indian retail goods (Milk, Bread, Butter, Sugar, Tea, Atta, Eggs, Biscuits, Soap, Oil, Rice, Dal).
- **Acceptance Criteria:** Database initializes offline on first launch; seed items populate automatically if the database is empty.

---

## Phase 2: Express Counter & 3-Tap Billing Engine
**Goal:** Allow shopkeepers to ring up a transaction in under 10 seconds.

- [ ] Build `QuickItemGrid`: Display large touch cards for frequent items with single-tap quantity increment.
- [ ] Build `CustomAmountPad`: Floating keypad to type ad-hoc amounts (e.g. ₹25 for miscellaneous items) directly into cart.
- [ ] Build `ActiveCartDrawer`: Sticky footer displaying active item count, total ₹ amount, and clear button.
- [ ] Build `PaymentToggle`: Fast selector for `[💵 CASH]` vs `[📱 UPI]`.
- [ ] Wire cart submission to automatically decrement product stock in IndexedDB and append a `transactions` record.
- **Acceptance Criteria:** Adding 2 items and tapping payment completes checkout in $\le 3$ clicks, updating local cart in $< 50$ms.

---

## Phase 3: Zero-Cost WhatsApp Receipts & UPI QR Generator
**Goal:** Deliver modern digital checkout without expensive hardware or paid SMS gateways.

- [ ] Implement `lib/whatsapp.ts`: Build template string formatter creating structured text receipts.
- [ ] Integrate RFC 3986 URL encoder creating direct WhatsApp links:
  `https://wa.me/{phone}?text={encodedText}`
- [ ] Build one-tap customer phone input modal with "Skip & Complete" option.
- [ ] Implement dynamic UPI QR modal (`qrcode.react`) with standard NPCI URI string for instant customer phone scanning.
- **Acceptance Criteria:** Tapping "Send WhatsApp Slip" opens WhatsApp with the formatted bill pre-filled; selecting UPI displays a valid QR code payable via PhonePe/GPay.

---

## Phase 4: Visual "Traffic-Light" Stock Ledger
**Goal:** Eliminate complex inventory tables in favor of glanceable stock health.

- [ ] Build `StockLedgerView`: Render list sorted by stock urgency:
  - 🔴 **Red:** Out of stock (`0 units`)
  - 🟡 **Yellow:** Low stock warning (`< 10 units`)
  - 🟢 **Green:** Adequate stock (`≥ 10 units`)
- [ ] Build `QuickRestockBar`: One-tap preset pills (`+5`, `+10`, `+25`, `+50`) on each item card to adjust inventory instantly.
- [ ] Add simple modal to add a new custom product.
- **Acceptance Criteria:** Shopkeeper can spot low-stock items at a glance and restock quantities in a single tap without nested forms.

---

## Phase 5: End-of-Day P&L Reconciler & Monthly Calendar
**Goal:** Answer *"Did I make money today?"* in under 60 seconds.

- [ ] Build `RevenueBreakdown`: Auto-aggregate today's completed transactions into Cash vs. UPI collections.
- [ ] Build `ExpenseLogger`: Ultra-fast form to log ad-hoc day expenses (amount + category/note).
- [ ] Build `NetProfitCard`: Real-time computation:
  $$\text{Net Profit} = \text{Sales} - \text{Expenses}$$
  Displays large, color-coded badge (Green for profit, Red for loss).
- [ ] Build `CalendarHistory`: Visual 30-day calendar view displaying daily net profit badges and monthly summary totals.
- **Acceptance Criteria:** Navigating to Day P&L instantly calculates net earnings; adding an expense dynamically updates profit color.

---

## Phase 6: PWA Offline Hardening & Performance Polish
**Goal:** Ensure 100% operational reliability under intermittent network conditions.

- [ ] Create `manifest.json` with app icons, standalone portrait mode, and theme colors.
- [ ] Register Service Worker caching all static assets and client routes.
- [ ] Test complete user flow in airplane mode (counter sale $\rightarrow$ stock decrement $\rightarrow$ daily profit calculation).
- [ ] Run Lighthouse audit to verify PWA installability, contrast accessibility, and sub-second FCP.
- **Acceptance Criteria:** App installs to home screen on Android/iOS and operates with zero errors in airplane mode.

---

## Phase 7: Deployment & Hackathon Presentation
**Goal:** Ship live public URL and prepare judge demonstration.

- [ ] Deploy production build to **Vercel**.
- [ ] Prepare demo script highlighting the **Digital DNA** constraints:
  - *Speed:* 10-second WhatsApp checkout.
  * *Simplicity:* One screen, 3 numbers for profit.
  * *Cost:* ₹0 hardware investment vs. ₹25,000 traditional POS.
