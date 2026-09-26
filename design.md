---
name: Tactile Modern Fintech
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#ba0035'
  on-secondary: '#ffffff'
  secondary-container: '#e21e49'
  on-secondary-container: '#fffbff'
  tertiary: '#006194'
  on-tertiary: '#ffffff'
  tertiary-container: '#007bb9'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#ffdada'
  secondary-fixed-dim: '#ffb3b6'
  on-secondary-fixed: '#40000c'
  on-secondary-fixed-variant: '#920028'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  surface-canvas: '#F8FAFC'
  surface-card: '#FFFFFF'
  profit-emerald: '#059669'
  profit-emerald-tint: '#ECFDF5'
  profit-emerald-dark: '#065F46'
  expense-rose: '#E11D48'
  expense-rose-tint: '#FFF1F2'
  expense-rose-dark: '#9F1239'
  slate-subtle: '#F1F5F9'
  slate-border: '#E2E8F0'
  slate-muted: '#64748B'
  slate-body: '#334155'
  slate-display: '#0F172A'
typography:
  headline-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  currency-input:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.04em
  tabular-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: 1.5rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system is engineered for micro-retail entrepreneurs and local shop owners who require instant clarity at the end of an exhausting business day. The emotional tone balances high-trust financial precision with welcoming warmth and tactile accessibility. The aesthetic blends **tactile modernism** with **high-contrast fintech utility**: physical, confidence-inspiring surfaces, prominent monetary indicators, and rapid single-hand ergonomics.

Visual clutter, decorative abstractions, and complex accounting jargon are eliminated. Every viewport centers exclusively on the operational reality of small business bookkeeping: income, expenditure, and bottom-line net profit.

## Colors

The palette establishes unambiguous semantic polarity:

- **Primary (`profit-emerald` / `#059669`):** Represents incoming capital, positive delta, and daily profit. Used for primary execution actions, affirmative metric displays, and profit badges. Paired with `#ECFDF5` for soft tinted container fills.
- **Secondary (`expense-rose` / `#E11D48`):** Encodes outgoing capital, operating expenses, and net daily losses. Paired with `#FFF1F2` for warning containers and debit state chips.
- **Tertiary (`#0284C7`):** Reserved for contextual navigation, calendar range badges, and secondary analytical states.
- **Neutral Core (`#0F172A` over `#F8FAFC`):** Deep slate typography ensures AAA contrast against canvas and card surfaces, remaining clear under harsh shop lighting and budget mobile screens.

## Typography

The type system pairs **Plus Jakarta Sans** for headings, structural labels, and high-impact numeric values with **Inter** for descriptions and form helpers. 

Numeric entry displays and profit readouts rely on tabular figures (`font-variant-numeric: tabular-nums`) within Plus Jakarta Sans to prevent layout jitter during live calculations. Currency symbols (`₹`) maintain equal vertical alignment with numbers to ensure instant scanning.

## Layout & Spacing

A mobile-first single-column framework designed for thumb-driven one-handed operation under 60 seconds:

- **Mobile Viewports (<640px):** Single-column stack with `1rem` screen margin and `1rem` vertical flow gaps. Key interactive cards occupy 100% width. Action triggers and numeric inputs maintain a minimum touch target height of `54px`.
- **Desktop/Tablet Viewports (≥640px):** Constrained centered layout container maxing out at `540px` for the daily logging screen to preserve the high-speed vertical flow, expanding to a 12-column grid (`max-w-4xl`) for monthly ledger calendars and performance breakdown dashboards.
- **Rhythm Rules:** Form field groups use `space-sm` between label and input, `space-md` between distinct input cards, and `space-xl` between data entry sections and execution buttons.

## Elevation & Depth

Visual hierarchy uses **tactile surface stratification** paired with tinted ambient edge shadows rather than high-blur floating overlays:

- **Level 0 (Canvas):** `#F8FAFC`, flat baseline.
- **Level 1 (Entry Cards & Calendar Cells):** Surface `#FFFFFF`, border `1px solid #E2E8F0`, subtle shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active Focus & Touch States):** Elevated `#FFFFFF`, shadow `0 4px 12px -2px rgba(15, 23, 42, 0.08)`, border rings mapped to active input intent (Emerald for sales, Rose for expenses).
- **Level 3 (Sticky Action Deck & Bottom Bar):** Pinned floating panels with `backdrop-filter: blur(12px)`, background `rgba(255, 255, 255, 0.92)`, border-top `1px solid #E2E8F0`, and upward shadow `0 -4px 16px -4px rgba(15, 23, 42, 0.06)`.
- **Level 4 (Summary Profit/Loss Result Card):** Solid tinted fill (`#ECFDF5` or `#FFF1F2`) paired with a heavier structural border (`2px solid`) and colored shadow (`0 8px 24px -4px rgba(5, 150, 105, 0.15)` for profit; `rgba(225, 29, 72, 0.15)` for loss).

## Shapes

The interface utilizes **Rounded (`roundedness: 2`)** geometry to balance friendly consumer software accessibility with crisp enterprise structure:

- Primary input containers, metric result cards, and persistent bottom sheets use `rounded-xl` (`1.5rem` / `24px`) to create clear content buckets.
- Action buttons, interactive list items, and form input frames use `rounded-lg` (`1rem` / `16px`).
- Filter pills, status indicators, and currency prefix badges use full pill shapes (`rounded-full` / `9999px`) to distinguish categorical indicators from tappable data inputs.

## Components

### 1. Currency Input Cards
- **Structure:** White card container with an integrated label, currency prefix icon, and bold numeric field.
- **States:** 
  - *Sales Focus:* Card border transitions to `2px solid #059669` with an emerald glow ring (`rgba(5, 150, 105, 0.1)`).
  - *Expense Focus:* Card border transitions to `2px solid #E11D48` with a rose glow ring (`rgba(225, 29, 72, 0.1)`).
- **Format:** Left-aligned fixed currency symbol (`₹`) at 24px weight, followed by auto-formatting comma-separated digits in `2rem` bold font.

### 2. Primary Action Buttons
- **Height & Sizing:** Minimum height `56px`, full width on mobile devices, with bold centered typography.
- **Profit Save Button:** Solid `#059669` fill, `#FFFFFF` text, active click down-press effect (`transform: scale(0.98)`).
- **Secondary Buttons:** Ghost background with `#E2E8F0` border, `#0F172A` text, hover `#F1F5F9`.

### 3. Net Daily Profit Result Card
- **Layout:** High-contrast summary display presented immediately upon submission.
- **Visuals:** 
  - *Profitable Day:* Background `#ECFDF5`, border `2px solid #A7F3D0`, large profit metric in `#065F46`, paired with an upward trending badge.
  - *Loss Day:* Background `#FFF1F2`, border `2px solid #FECDD3`, metric in `#9F1239`, paired with a downward indicator badge.

### 4. Calendar Ledger Matrix
- **Layout:** 7-column grid with sticky day headers (`M, T, W, T, F, S, S`).
- **Cells:** Fixed aspect ratio squares with date number (top-left) and micro numeric delta (+₹5k / -₹1k) anchored bottom-center.
- **Color Coding:** Days with net profit use subtle `#ECFDF5` background with `#059669` typography; days with losses use `#FFF1F2` with `#E11D48` typography; unlogged days render in `#F8FAFC` with `#94A3B8` borders.

### 5. Persistent Thumb-Zone Navigation
- **Dock:** Fixed bottom navigation bar with a height of `64px`, elevated via subtle backdrop blur.
- **Items:** Three evenly spaced tabs (Home/Entry, Calendar History, Reports) with 24px vector icons, 12px label typography, and emerald highlight states for the active screen.