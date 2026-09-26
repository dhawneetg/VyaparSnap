# Developer Tooling & Tech Stack Guide: VyaparSnap

This document defines the complete technical tooling, libraries, dependencies, and developer environment for building, testing, and deploying **VyaparSnap**.

---

## 1. Core Framework & Runtime

| Tool / Technology | Version / Recommendation | Role & Rationale |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x (LTS)` | Runtime environment for development, packaging, and builds. |
| **TypeScript** | `5.x` | Strict type safety for financial ledgers, inventory counts, and data contracts. |
| **Next.js (App Router)** | `15.x` (or React 19) | Modern React framework offering zero-config SSR/SSG, fast routing, and PWA integration. |
| **Package Manager** | `pnpm` or `npm` | Fast, deterministic dependency management. |

---

## 2. UI, Styling & Accessibility Tools

| Library / Tool | Package | Role & Usage |
| :--- | :--- | :--- |
| **Tailwind CSS** | `tailwindcss`, `@tailwindcss/postcss` | Utility-first CSS for rapid development. Configured with a 48px+ minimum touch target scale. |
| **Icons** | `lucide-react` | Ultra-lightweight, visually clean iconography (Counter, Cash, UPI, Calendar, Inventory). |
| **UI Helpers** | `clsx`, `tailwind-merge` | Conditional class composition without specificity collisions. |
| **Animation (Micro)** | `framer-motion` (or vanilla CSS transitions) | Subtle micro-interactions: card swipe restock, instant profit pulse (green/red). |

---

## 3. Storage & State Management Tools

| Tool | Package | Role & Justification |
| :--- | :--- | :--- |
| **Dexie.js** | `dexie`, `dexie-react-hooks` | Robust, reactive wrapper around native browser **IndexedDB**. Guarantees zero-latency offline persistence for transactions, products, and daily logs. |
| **Zustand** | `zustand` | Minimalist client-side store (<2kB) for active counter ticket/cart state and modal triggers. Eliminates boilerplate. |
| **Cloud Sync (Optional/Backend)** | `@supabase/supabase-js` | Edge PostgreSQL backend for secure ledger backup and cloud sync when device is online. |

---

## 4. Operational & Utility Libraries

| Utility | Package | Purpose |
| :--- | :--- | :--- |
| **WhatsApp Link Generator** | Custom URI Encoder (`RFC 3986`) | Constructs native deep-links (`https://wa.me/{phone}?text={bill}`) without requiring paid third-party API keys or SMS gateways. |
| **UPI QR Generator** | `qrcode.react` | Generates dynamic standard Indian UPI QR codes (`upi://pay?pa=...&am=...&tn=...`) directly on the screen for customer scanning. |
| **Date & Time Formatting** | `date-fns` | Lightweight date manipulation for day-closing summaries and monthly calendar aggregation. |
| **Number & Currency Utility** | Native `Intl.NumberFormat` | Handles INR formatting (`en-IN`, currency `INR`, zero decimal cents for whole rupee transactions). |

---

## 5. Development, Linting & Testing Tools

| Tool | Purpose | Configuration / Command |
| :--- | :--- | :--- |
| **ESLint & Prettier** | Code style, syntax enforcement, and formatting. | `npm run lint` |
| **Vitest** | Fast unit and integration testing for currency math, cart calculation, and ledger reconciliation. | `npm run test` |
| **Testing Library** | Component interaction testing for counter and touch buttons. | `@testing-library/react` |
| **Lighthouse / PageSpeed** | Auditing PWA compliance, accessibility, and FCP performance. | Target score $\ge 95$ across all categories. |

---

## 6. PWA & Service Worker Configuration

* **Engine:** Custom Service Worker utilizing Google Workbox or `@serwist/next`.
* **Caching Strategy:**
  * **Static Assets (HTML/CSS/JS/Icons):** Cache-First with background revalidation.
  * **API / Cloud Sync:** Network-First with automatic IndexedDB offline fallback.
* **Web App Manifest (`manifest.json`):**
  * `display: "standalone"`
  * `orientation: "portrait"`
  * `theme_color: "#0F172A"`
  * `background_color: "#0F172A"`

---

## 7. Developer CLI & Workflow Commands

```bash
# Install dependencies
npm install

# Start local development server with hot-reload
npm run dev

# Run unit tests for cart calculations & ledger logic
npm run test

# Run code linter
npm run lint

# Build production bundle and generate PWA service worker
npm run build

# Start production server locally for PWA offline verification
npm run start
```
