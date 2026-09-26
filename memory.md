# Project Memory & Context: VyaparSnap

This document serves as the persistent memory, architectural decisions record (ADRs), and constraints baseline for **VyaparSnap**.

---

## 📌 Project Identity & Background

* **Project Name:** VyaparSnap
* **Tagline:** *3-Tap Counter by day, 3-Number Profit by night. Zero confusion.*
* **Hackathon:** CYBORG CLUB X UNSTOP Digital DNA Competition
* **Track / Assigned DNA:**
  * **Technology:** Web / Progressive Web App (PWA)
  * **Industry:** Retail
  * **Target User:** Small & Micro Retailers (Kirana stores, neighborhood boutiques, micro merchants)
  * **Core Constraint:** **Simple Interface** (Zero cognitive overhead, high-contrast, large touch targets, thumb-friendly)

---

## 🧠 Synthesis Rationale & History

The project originates from synthesizing the strongest elements of two initial PRDs:
1. **VyaparLite (`PRD(demo).md`):** Provided high-utility counter checkout, zero-cost WhatsApp digital receipt sharing (`wa.me/`), and visual traffic-light inventory alerts.
2. **SalesSnap (`PRD_Daily_Sales_Logger.md`):** Provided disciplined end-of-day financial reconciliation ("Did I make money today?"), 30-day visual P&L calendar, deep user persona (Ramesh Kumar), and quantifiable success metrics.

**VyaparSnap** combines both into an end-to-end daily operational loop for micro-retailers without bloating the UI.

---

## 🏛️ Architectural Decision Records (ADRs)

### ADR-001: Local-First IndexedDB Persistence (Dexie.js)
* **Context:** Indian kirana shops face unstable cellular network connectivity and power outages.
* **Decision:** All critical counter transactions, inventory updates, and daily expense logs are written locally to IndexedDB first.
* **Consequence:** 100% operational uptime in airplane mode; zero wait time for server round-trips during peak counter rushes.

### ADR-002: Zero-Cost WhatsApp Deep-Linking Protocol (`wa.me`)
* **Context:** Small merchants cannot afford ₹0.20/SMS gateways, ₹3,000 thermal receipt printers, or paid Meta Business API accounts.
* **Decision:** Generate standard browser deep links (`https://wa.me/{phone}?text={encodedSlip}`) directly invoking the merchant's WhatsApp app.
* **Consequence:** Instant paperless receipts dispatched at ₹0 operational cost.

### ADR-003: Quick-Frequency Tiles + Amount Dialer over Barcode Scanners
* **Context:** Camera-based barcode scanning on budget ₹7,000 smartphones suffers from slow autofocus, bad lighting, and dirty camera lenses, causing counter queues.
* **Decision:** Display the top 8–12 highest frequency staple items as large touch tiles, paired with a rapid numeric dialer for ad-hoc unlisted items.
* **Consequence:** Checkouts complete in under 10 seconds with 1–3 thumb taps.

### ADR-004: Strict 3-View Bottom Navigation Hierarchy
* **Context:** Non-tech-savvy users get lost in multi-tiered menus, sidebars, and nested dialogs.
* **Decision:** The UI is locked to exactly three persistent views on a bottom navigation bar:
  1. `[⚡ Counter]` — Active daytime checkout.
  2. `[📦 Stock]` — Visual traffic-light stock count with single-tap restock.
  3. `[📊 Day P&L]` — End-of-day cash reconciliation & 30-day profit calendar.
* **Consequence:** Zero navigation depth; any screen is reachable in 1 tap.

---

## 🚫 Hard Constraints & Guardrails

1. **Strictly Simple Interface:** Never introduce nested modals, multi-step checkout wizards, or complex table grids.
2. **Minimum 48px Touch Targets:** All interactive buttons and cards must be thumb-friendly for one-handed operation.
3. **No Mandatory Auth on First Run:** The app must open immediately into the active cash counter upon launch; users can ring up sales with zero onboarding barriers.
4. **No Third-Party Advertising Trackers:** Merchant financial records and customer phone numbers remain strictly private on the device.

---

## 📁 Artifact Index & File Map

* [prd.md](file:///d:/Code%20things/Hackathons/Digital%20Dna%20!CYBORG%20CLUB%20X%20UNSTOP!/prd.md) — Comprehensive, synthesized Product Requirements Document.
* [tools.md](file:///d:/Code%20things/Hackathons/Digital%20Dna%20!CYBORG%20CLUB%20X%20UNSTOP!/tools.md) — Developer toolchain, runtime, dependencies, and CLI commands.
* [architecture.md](file:///d:/Code%20things/Hackathons/Digital%20Dna%20!CYBORG%20CLUB%20X%20UNSTOP!/architecture.md) — System architecture, Dexie DB schema, component trees, and data flow pipelines.
* [phases.md](file:///d:/Code%20things/Hackathons/Digital%20Dna%20!CYBORG%20CLUB%20X%20UNSTOP!/phases.md) — Phased implementation roadmap (Phases 0–7) with acceptance criteria.
* [memory.md](file:///d:/Code%20things/Hackathons/Digital%20Dna%20!CYBORG%20CLUB%20X%20UNSTOP!/memory.md) — Persistent project context, ADRs, and core guardrails.
