# Product Requirements Document (PRD)
## SalesSnap — Daily Sales Logger for Small Retail Businesses

---

## 📋 Overview

**Product Name:** SalesSnap
**Tagline:** Know your numbers, grow your business
**Version:** 1.0
**Author:** Dhawneet
**Date:** September 2026

---

## 1. Problem Statement

Small retail business owners in India and globally face a common challenge: **they don't have a simple way to track their daily sales and expenses**.

### Current Pain Points:
- ❌ **No clear picture of daily profit/loss** — Owners often realize losses too late
- ❌ **Paper registers are messy** — Hard to analyze trends or find past records
- ❌ **Accounting software is too complex** — Tally, Zoho Books require training and are overkill for a kirana store or small boutique
- ❌ **No quick insights** — "Did I make money today?" shouldn't require a spreadsheet

**The core problem:** Small business owners need to know one simple thing every day — *"How did my business do today?"*

---

## 2. Target Users

### Primary User Persona

**Name:** Ramesh
**Age:** 35-50
**Business:** Kirana store / small clothing boutique / mobile repair shop
**Tech Comfort:** Basic — uses WhatsApp, UPI payments, maybe checks YouTube
**Pain Point:** Ends the day wondering if he made profit but has no clear record

### User Characteristics:
- 📍 Runs a single retail outlet
- 💰 Handles cash and UPI transactions
- 📱 Has a smartphone with internet
- ⏰ Has 5-10 minutes at end of day for logging
- 🧾 Currently uses notebooks or nothing to track sales

### Secondary Users:
- Family members who help manage the shop
- Small business consultants helping these shops

---

## 3. Solution Overview

**SalesSnap** is a minimalist web application that lets small retail business owners log their daily sales and expenses in under 60 seconds, and instantly see their profit.

### Key Value Proposition:
> **One screen. Three numbers. Zero confusion.**

The product focuses on simplicity:
1. Enter today's sales amount
2. Enter today's expenses
3. See your profit instantly

That's it. No inventory, no complex categories, no learning curve.

---

## 4. Features

### MVP Features (Version 1.0)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Daily Entry Form** | Simple form to log sales, expenses, and optional notes | High |
| **Instant Profit Display** | Shows: Sales - Expenses = Profit (color-coded green/red) | High |
| **Monthly Calendar View** | Visual calendar showing each day's profit/loss | High |
| **Basic Reports** | Weekly and monthly summaries with totals | Medium |
| **Dark/Light Mode** | Toggle for preference and battery saving | Low |

### Post-MVP Features (Future Versions)

- 📊 Simple charts showing sales trends
- 📤 Export data to PDF/Excel
- 🔔 Daily reminder notifications
- 📱 PWA (install as app on phone)
- 🏪 Multiple shop support

### What We're NOT Building (Scope Boundary)

- ❌ Inventory management
- ❌ Customer database
- ❌ Invoice generation
- ❌ GST/tax calculations
- ❌ Multi-user accounts
- ❌ Payment processing

---

## 5. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js** | UI framework — component-based, fast, widely supported |
| **Tailwind CSS** | Styling — rapid development, responsive by default |
| **LocalStorage** | Client-side data persistence — works offline, no server needed for MVP |

### Why This Stack?
- ✅ **Simple to build** — One developer can ship MVP in 1-2 weeks
- ✅ **No backend needed for MVP** — Data stored locally on user's device
- ✅ **Fast performance** — Instant load times, crucial for daily use
- ✅ **Mobile-first** — Responsive design works on phones, which users have
- ✅ **Free hosting** — Can deploy on Vercel, Netlify, or GitHub Pages

### Future Backend (Optional)
- **Supabase** or **Firebase** — When user accounts and cloud sync are needed
- **PostgreSQL** — For structured data storage and reporting

---

## 6. User Flow

### Primary Flow: Daily Logging

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   USER OPENS APP                                                │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────┐                                               │
│   │  HOME PAGE  │                                               │
│   │  "Today's   │                                               │
│   │   Entry"    │                                               │
│   └──────┬──────┘                                               │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────┐                                       │
│   │  ENTER SALES (₹)    │  ← Input field with number pad       │
│   │  Example: 15,000    │                                       │
│   └──────────┬──────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌─────────────────────┐                                       │
│   │  ENTER EXPENSES (₹) │  ← Input field                        │
│   │  Example: 8,000     │                                       │
│   └──────────┬──────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌─────────────────────┐                                       │
│   │  OPTIONAL NOTES     │  ← "Stock purchase" / "Rent paid"     │
│   └──────────┬──────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌─────────────────────┐                                       │
│   │    SAVE BUTTON      │                                       │
│   └──────────┬──────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌─────────────────────┐                                       │
│   │  INSTANT RESULT     │                                       │
│   │  ─────────────────  │                                       │
│   │  💰 Sales: ₹15,000  │                                       │
│   │  📤 Expenses: ₹8,000│                                       │
│   │  ─────────────────  │                                       │
│   │  ✅ PROFIT: ₹7,000  │  ← Green if profit, Red if loss       │
│   └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Secondary Flow: Viewing History

```
USER TAPS "HISTORY"
        │
        ▼
┌─────────────────────┐
│  CALENDAR VIEW      │
│  ─────────────────  │
│  ◀  SEPTEMBER 2026 ▶│
│  ┌───┬───┬───┬───┐  │
│  │Mon│Tue│Wed│Thu│  │
│  ├───┼───┼───┼───┤  │
│  │   │ 1 │ 2 │ 3 │  │
│  │   │+5k│-1k│+8k│  │  ← Shows profit/loss on each day
│  ├───┼───┼───┼───┤  │
│  │ 4 │ 5 │ 6 │ 7 │  │
│  │+3k│   │+6k│+4k│  │  ← Empty = not logged yet
│  └───┴───┴───┴───┘  │
└─────────────────────┘
        │
        ▼
USER TAPS A DAY → Sees full breakdown
```

---

## 7. UI Sketches / Wireframes

### Screen 1: Home / Daily Entry

```
┌────────────────────────────────────┐
│                                    │
│         📊 SalesSnap               │
│         ─────────────              │
│                                    │
│    ┌──────────────────────────┐    │
│    │      26 Sep 2026         │    │
│    │      FRIDAY              │    │
│    └──────────────────────────┘    │
│                                    │
│    ┌──────────────────────────┐    │
│    │  💰 Today's Sales        │    │
│    │  ┌────────────────────┐  │    │
│    │  │ ₹ 0                │  │    │
│    │  └────────────────────┘  │    │
│    └──────────────────────────┘    │
│                                    │
│    ┌──────────────────────────┐    │
│    │  📤 Today's Expenses     │    │
│    │  ┌────────────────────┐  │    │
│    │  │ ₹ 0                │  │    │
│    │  └────────────────────┘  │    │
│    └──────────────────────────┘    │
│                                    │
│    ┌──────────────────────────┐    │
│    │  📝 Notes (optional)     │    │
│    │  ┌────────────────────┐  │    │
│    │  │                    │  │    │
│    │  └────────────────────┘  │    │
│    └──────────────────────────┘    │
│                                    │
│    ┌──────────────────────────┐    │
│    │                          │    │
│    │      💾 SAVE ENTRY       │    │
│    │                          │    │
│    └──────────────────────────┘    │
│                                    │
│    ─────────────────────────────   │
│    [🏠 Home]  [📅 History] [📊]    │
│                                    │
└────────────────────────────────────┘
```

### Screen 2: After Saving (Result View)

```
┌────────────────────────────────────┐
│                                    │
│              ✅ Saved!             │
│                                    │
│    ╔══════════════════════════╗    │
│    ║                          ║    │
│    ║   📊 TODAY'S SUMMARY     ║    │
│    ║   ──────────────────     ║    │
│    ║                          ║    │
│    ║   💰 Sales:    ₹15,000   ║    │
│    ║   📤 Expenses: ₹ 8,000   ║    │
│    ║   ──────────────────     ║    │
│    ║                          ║    │
│    ║   ✅ PROFIT:   ₹ 7,000   ║    │
│    ║                          ║    │
│    ╚══════════════════════════╝    │
│                                    │
│         (Green background for      │
│          profit, Red for loss)     │
│                                    │
│    ┌──────────────────────────┐    │
│    │     📝 EDIT ENTRY        │    │
│    └──────────────────────────┘    │
│                                    │
│    [🏠 Home]  [📅 History] [📊]    │
│                                    │
└────────────────────────────────────┘
```

### Screen 3: History / Calendar View

```
┌────────────────────────────────────┐
│                                    │
│         📅 History                 │
│         ─────────                  │
│                                    │
│      ◀    September 2026    ▶      │
│                                    │
│    ┌────┬────┬────┬────┬────┐      │
│    │ Mon│ Tue│ Wed│ Thu│ Fri│      │
│    ├────┼────┼────┼────┼────┤      │
│    │    │  1 │  2 │  3 │  4 │      │
│    │    │+5k │-1k │+8k │+3k │      │
│    ├────┼────┼────┼────┼────┤      │
│    │  5 │  6 │  7 │  8 │  9 │      │
│    │    │+6k │+4k │+2k │+9k │      │
│    ├────┼────┼────┼────┼────┤      │
│    │ 10 │ 11 │ 12 │ 13 │ 14 │      │
│    │+3k │+7k │-500│+4k │+6k │      │
│    ├────┼────┼────┼────┼────┤      │
│    │ 15 │ 16 │ 17 │ 18 │ 19 │      │
│    │+8k │+5k │+3k │+2k │    │      │
│    └────┴────┴────┴────┴────┘      │
│                                    │
│    ╔══════════════════════════╗    │
│    ║ 📊 MONTH SUMMARY         ║    │
│    ║ ────────────────────     ║    │
│    ║ Total Sales:    ₹85,000  ║    │
│    ║ Total Expenses: ₹42,000  ║    │
│    ║ Net Profit:     ₹43,000  ║    │
│    ╚══════════════════════════╝    │
│                                    │
│    [🏠 Home]  [📅 History] [📊]    │
│                                    │
└────────────────────────────────────┘
```

---

## 8. Expected Impact

### For Small Business Owners

| Impact | Before SalesSnap | After SalesSnap |
|--------|------------------|-----------------|
| **Time to log daily sales** | 10-15 minutes (notebook) | Under 60 seconds |
| **Visibility into profit** | End of month, if at all | Daily, instant |
| **Decision making** | Guesswork | Data-driven |
| **Tax/audit readiness** | Scattered papers | Digital records, exportable |

### Quantitative Impact Goals

- 📈 **Reduce time spent on daily bookkeeping by 80%**
- 📈 **Increase awareness of daily profit/loss from ~20% to 100%** of users
- 📈 **Help users identify loss-making days within the same month** instead of realizing too late

### Social Impact

- 🌍 **Financial literacy** — Owners become more aware of their business health
- 🌍 **Inclusivity** — Simple interface means even less tech-savvy owners can benefit
- 🌍 **Small business survival** — Better financial awareness leads to better decisions

---

## 9. Success Metrics

### MVP Success Criteria

| Metric | Target |
|--------|--------|
| Daily active entries per user | ≥ 20 entries/month |
| User retention (30-day) | ≥ 40% |
| Average time to complete entry | < 60 seconds |
| App load time | < 2 seconds |

---

## 10. Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Phase 1: Design** | 2 days | Finalized wireframes, color palette |
| **Phase 2: Development** | 7 days | Working MVP with core features |
| **Phase 3: Testing** | 3 days | Bug fixes, mobile responsiveness |
| **Phase 4: Deployment** | 1 day | Live on Vercel/Netlify |
| **Total** | ~2 weeks | Ready for competition submission |

---

## 11. Conclusion

SalesSnap solves a real, everyday problem for millions of small retail business owners who just want to know: *"Did I make money today?"*

By keeping the interface simple, the technology accessible, and the focus razor-sharp on daily logging and instant insights, SalesSnap delivers immediate value without overwhelming users with features they don't need.

**One screen. Three numbers. Zero confusion.**

---

*Prepared for: CYBORG CLUB X UNSTOP Digital DNA Competition*
*Technology: Web Development | Industry: Retail | User: Small Businesses | Constraint: Simple Interface*
