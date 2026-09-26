# Product Requirement Document (PRD): VyaparLite

**Assigned Digital DNA:**
- **Technology:** Web/App Development
- **Industry:** Retail
- **User:** Small Businesses
- **Constraint:** Simple Interface

---

## 1. Problem
Independent micro and small retail shops (e.g., local kirana stores, clothing outlets, neighborhood hardware shops) face continuous operational bottlenecks:
* **Overcomplicated Software:** Standard retail POS and inventory software (e.g., SAP, Tally, Zoho) feature multi-level navigation, deep menus, and mandatory data fields that overwhelm non-technical shop owners.
* **Counter Friction:** Peak store hours demand rapid checkouts. Manual paper calculations or clunky desktop systems cause queues, calculation errors, and transaction delays.
* **Expensive Hardware Dependency:** Traditional POS solutions require desktop terminals, dedicated barcode scanners, and thermal receipt printers, demanding an upfront investment of ₹10,000–₹25,000.

---

## 2. Users
* **Target Audience:** Micro and small retail business owners, single-counter shopkeepers, and local merchants.
* **User Persona:** Mobile-first user operating on a mid-range or budget smartphone; needs an intuitive, large-touch interface operable with one hand while attending to customers.

---

## 3. Solution
**VyaparLite** is an ultra-streamlined, offline-first Progressive Web App (PWA) designed to convert any budget smartphone into a high-speed retail checkout counter. Adhering strictly to the **Simple Interface** constraint, VyaparLite features a unified 3-tap checkout engine, zero-friction WhatsApp receipt sharing, and a single-glance color-coded inventory ledger.

---

## 4. Key Features

### 4.1. 3-Tap Express Billing
* High-frequency item tiles displayed directly on the launch view.
* Custom numeric amount dialer for quick ad-hoc items.
* Bill calculation occurs in real time with auto-tax and discounts applied in a single tap.

### 4.2. Instant Paperless Receipts (WhatsApp Click-to-Chat)
* Eliminates physical thermal printers.
* Generates a concise digital transaction slip sent straight to the buyer's WhatsApp via standard deep-linking (no paid API/SMS gateway costs required).

### 4.3. Visual "Traffic Light" Stock Ledger
* No nested dropdowns or spreadsheets.
* Items categorized visually:
  * **Green:** Adequate stock
  * **Yellow:** Low stock (< 5 units)
  * **Red:** Out of stock
* Direct swipe action on an item card to restock quantities in presets (+5, +10, +50).

### 4.4. Offline-First Capability
* Full operational continuity during network blackouts or unstable cellular coverage.
* Automatic local background queue that pushes updates when connection restores.

### 4.5. Single-Number Day Close Summary
* Eliminates complex balance sheets.
* Closing screen displays only critical bottom-line figures: Total Daily Revenue, Cash Collection, and Digital/UPI Collection.

---

## 5. Technology Stack

* **Frontend:** Next.js / React, Tailwind CSS (leveraging high-contrast palettes, 48px+ touch targets, and zero modal clutter).
* **Application Shell (PWA):** Service Workers and Workbox with local IndexedDB storage for full offline persistence and near-zero load times.
* **Backend & Storage:** Node.js backend with Supabase (PostgreSQL) for cloud-syncing products, transaction ledgers, and secure authentication.
* **Communication Layer:** Direct WhatsApp URI protocol integration (`https://wa.me/`) for zero-cost, immediate customer billing dispatch.

---

## 6. User Flow
[Open App] ──> [Tap Items / Enter ₹] ──> [Select Cash / UPI] ──> [Share WhatsApp Bill] ──> [Auto-Sync Stock]

1. **Launch:** Shopkeeper taps the home-screen PWA icon; the app opens immediately into the active cash counter (bypassing welcome slides and setup wizards).
2. **Bill Assembly:** Shopkeeper taps 1–3 visual product tiles or keys in custom values.
3. **Payment Choice:** Single tap on either `CASH` or `UPI QR`.
4. **Complete & Dispatch:** Optional entry of customer phone number $\rightarrow$ tap `Complete`, which formats and triggers the WhatsApp digital slip.
5. **Background Update:** Inventory updates instantly on the device and syncs to the cloud ledger whenever online.

---

## 7. UI Wireframes & Layouts

### 7.1. Main Screen: Express Counter
```text
+-------------------------------------------------------+
|  VyaparLite                         [₹ Total: 0.00]   |
+-------------------------------------------------------+
|  FREQUENT ITEMS                                       |
|  +-------------------+  +-------------------+         |
|  | Milk 500ml (₹33)  |  | Bread Pack (₹25)  |         |
|  +-------------------+  +-------------------+         |
|  | Sugar 1kg  (₹42)  |  | Butter 100g (₹58) |         |
|  +-------------------+  +-------------------+         |
|  | [ + Custom ₹ ]    |  | [ Search Item ]   |         |
|  +-------------------+  +-------------------+         |
+-------------------------------------------------------+
|  ACTIVE CART                                          |
|  * 1 x Milk 500ml                            ₹33.00   |
|  * 1 x Butter 100g                           ₹58.00   |
|  --------------------------------------------------   |
|  PAYABLE AMOUNT: ₹91.00                               |
+-------------------------------------------------------+
|  [   CASH PAYMENT   ]   |   [   UPI QR SCANNER   ]    |
+-------------------------------------------------------+
|           >>> FINALIZE & SEND WHATSAPP BILL           |
+-------------------------------------------------------+
|  [Counter]             [Inventory]          [Summary] |
+-------------------------------------------------------+

### 7.2. Secondary Screen: Inventory Status

+-------------------------------------------------------+
|  Stock Status                         [ + New Item ]  |
+-------------------------------------------------------+
|  [GREEN]  Milk 500ml                24 units left     |
|  ---------------------------------------------------  |
|  [YELLOW] Sugar 1kg                  3 units left     |
|           >>> Swipe right to restock (+10)            |
|  ---------------------------------------------------  |
|  [RED]    Atta 5kg                   OUT OF STOCK     |
|           >>> Swipe right to restock (+5)             |
+-------------------------------------------------------+
|  [Counter]             [Inventory]          [Summary] |
+-------------------------------------------------------+


8. Expected Impact
Speed: Cuts counter checkout duration from ~45 seconds down to under 10 seconds.

Cost Efficiency: Saves ₹10,000+ in hardware startup fees by repurposing consumer smartphones as point-of-sale terminals.

Zero Learning Curve: Visual layout and minimal screens eliminate staff onboarding and technical training requirements.

Inventory Accuracy: Color-coded swipe controls minimize stock-outs on core everyday retail goods.