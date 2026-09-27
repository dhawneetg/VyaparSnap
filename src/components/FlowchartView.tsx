import React, { useState } from 'react';
import {
  GitCommit,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Server,
  Database,
  Volume2,
  QrCode,
  Share2,
  Boxes,
  BookOpen,
  Calendar,
  CheckCircle2,
  Zap,
  Activity,
  Workflow,
  Lock,
  Globe,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { Language } from '../utils/translations';

interface FlowchartViewProps {
  language?: Language;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ language = 'en' }) => {
  const isHi = language === 'hi';
  const [activeSection, setActiveSection] = useState<'architecture' | 'checkout-algo' | 'stock-algo' | 'sync-algo'>('architecture');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('pos-runtime');

  // Core Components (12 Components as required)
  const components = [
    {
      id: 'ui-runtime',
      name: isHi ? '1. क्लाइंट UI व POS रनटाइम' : '1. Client UI & POS Runtime',
      category: isHi ? 'फ्रंटएंड प्रेजेंटेशन' : 'Frontend Layer',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'React 18 + Tailwind SPA जो बिना इंटरनेट के 100% तेज काम करता है।'
        : 'React 18 + Tailwind SPA running with 0ms network latency on mobile or desktop.',
      details: [
        'Responsive Express Counter with multi-touch keypad',
        'Real-time reactive state updates on each tap',
        'PWA standalone installable capability on Android & iOS',
      ],
      icon: Smartphone,
      color: 'border-emerald-500 bg-emerald-50/60 text-emerald-800',
    },
    {
      id: 'store-presets',
      name: isHi ? '2. स्टोर प्रोफाइल व बिज़नेस प्रीसेट' : '2. Store Profile & Presets Engine',
      category: isHi ? 'डोमेन कॉन्फ़िग' : 'Domain Config',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'किराना, बेकरी, ई-मित्र, पानी पूरी, कैफे आदि दुकानों के बीच तुरंत स्विच करने का इंजन।'
        : 'Dynamic multi-domain configurator switching catalog, units & default prices across 8 Indian retail verticals.',
      details: [
        'Preset catalogs (Kirana, Bakery, e-Mitra, Street Food, Cafe, Boutique)',
        'Automatic emoji and unit assignment (kg, pcs, plate, pack)',
        'Live merchant UPI VPA ID binding',
      ],
      icon: Layers,
      color: 'border-blue-500 bg-blue-50/60 text-blue-800',
    },
    {
      id: 'cart-engine',
      name: isHi ? '3. बास्केट व राउंड-ऑफ डिस्काउंट इंजन' : '3. Cart & Round-Off Engine',
      category: isHi ? 'काउंटर कोर' : 'Counter Engine',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'सामान को जोड़ता है और चिल्लर (छूट्टे पैसे) की समस्या के लिए 1-टैप राउंड-ऑफ सुझाता है।'
        : 'Aggregates tapped products, custom ₹ amounts, and calculates 1-tap cash round-off (e.g. ₹93 -> ₹90).',
      details: [
        'Auto-suggests lower ₹10 round-off when change is unavailable',
        'Ad-hoc item support for uncataloged fast items',
        'Total quantity and payable subtotal memoization',
      ],
      icon: Zap,
      color: 'border-amber-500 bg-amber-50/60 text-amber-800',
    },
    {
      id: 'transaction-manager',
      name: isHi ? '4. बिलिंग व सेल ट्रांजैक्शन मैनेजर' : '4. Atomic Transaction & Bill Ledger',
      category: isHi ? 'ऑर्डर हिस्ट्री' : 'Order Ledger',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'प्रत्येक बिक्री का बिल नंबर बनाता है, दोबारा प्रिंट करने और गलती होने पर सेल रद्द (Void) करने की सुविधा देता है।'
        : 'Assigns incremental bill numbers, logs timestamps, enables thermal reprinting and atomic sale voiding.',
      details: [
        'Assigns sequential Bill # (e.g. Bill #101, #102...) with ISO timestamps',
        'Void sale action automatically reverses inventory deduction and sales revenue',
        'Filter orders by Cash, UPI QR, or Khata debt',
      ],
      icon: GitCommit,
      color: 'border-purple-500 bg-purple-50/60 text-purple-800',
    },
    {
      id: 'storage-vault',
      name: isHi ? '5. लोकल स्टोरेज व IndexedDB वॉल्ट' : '5. LocalStorage & IndexedDB Vault',
      category: isHi ? 'लोकल डेटाबेस' : 'Persistence Layer',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'दुकानदार का सारा डेटा ब्राउज़र में सुरक्षित रखता है; इंटरनेट न होने पर भी 100% सुरक्षित।'
        : 'Guarantees zero-network operation with atomic CRUD for inventory, khata, daily closing, and orders.',
      details: [
        'Persistent keys: entries, products, khata, transactions, profile',
        'One-click JSON backup export & instant restore file reader',
        'Instantaneous synchronous read/write cycles',
      ],
      icon: HardDrive,
      color: 'border-slate-600 bg-slate-100 text-slate-800',
    },
    {
      id: 'stock-monitor',
      name: isHi ? '6. ट्रैफिक-लाइट स्टॉक मॉनिटर' : '6. Traffic-Light Stock Monitor',
      category: isHi ? 'इन्वेंटरी' : 'Inventory Control',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'स्टॉक के अनुसार रंग (लाल: खत्म, पीला: कम, हरा: सुरक्षित) दिखाता है और बिक्री पर स्वतः घटाता है।'
        : 'Monitors real-time shelf inventory with color-coded alerts and auto-decrements on sale checkout.',
      details: [
        '🔴 Red: Stock = 0 (Critical Out-of-Stock)',
        '🟡 Yellow: 1 to 9 units (Low Stock reorder warning)',
        '🟢 Green: 10+ units (Healthy shelf inventory)',
      ],
      icon: Boxes,
      color: 'border-emerald-600 bg-emerald-50 text-emerald-900',
    },
    {
      id: 'soundbox-synth',
      name: isHi ? '7. साउंडबॉक्स व वॉयस अनाउंसर' : '7. Virtual Soundbox & Voice Synth',
      category: isHi ? 'हार्डवेयर ऑडियो' : 'Hardware & Audio',
      boundary: isHi ? 'ब्राउज़र वेब API' : 'Browser Web API',
      desc: isHi
        ? 'पेमेंट मिलने पर कैश रजिस्टर घंटी और हिंदी में वॉयस बोलकर पुष्टि करता है।'
        : 'Web Audio API chime synthesizer coupled with Web Speech API for Hindi voice payment confirmations.',
      details: [
        'Simulates ₹2,500 physical IoT soundbox box for ₹0 cost',
        'Custom Hindi speech: "[दुकान] पर [राशि] रुपये प्राप्त हुए"',
        'Zero network API calls — runs offline on device CPU',
      ],
      icon: Volume2,
      color: 'border-teal-500 bg-teal-50/60 text-teal-800',
    },
    {
      id: 'upi-qr',
      name: isHi ? '8. एनपीसीआई यूपीआई क्यूआर इंजन' : '8. NPCI UPI QR Generator',
      category: isHi ? 'पेमेंट रेल' : 'Payment Rail',
      boundary: isHi ? 'बैंकिंग व यूपीआई गेटवे' : 'NPCI UPI Rail',
      desc: isHi
        ? 'दुकानदार की यूपीआई आईडी और बिल राशि का डायनेमिक स्कैन कोड तैयार करता है।'
        : 'Encodes merchant VPA, store name, and bill amount into standard NPCI UPI intent QR format.',
      details: [
        'Scannable by Google Pay, PhonePe, Paytm, BHIM, Cred',
        'Zero intermediary merchant payment gateway cut (100% direct bank settlement)',
        'Dynamic bill amount pre-filled on customer phone',
      ],
      icon: QrCode,
      color: 'border-indigo-500 bg-indigo-50/60 text-indigo-800',
    },
    {
      id: 'whatsapp-rail',
      name: isHi ? '9. व्हाट्सएप पर्ची व सप्लायर डिस्पैचर' : '9. WhatsApp Bill & Reorder Dispatcher',
      category: isHi ? 'मैसेजिंग' : 'Messaging Protocol',
      boundary: isHi ? 'व्हाट्सएप एंड-टू-एंड' : 'WhatsApp Rail',
      desc: isHi
        ? 'ग्राहक को डिजिटल बिल पर्ची और थोक व्यापारी को सामान की पर्ची 1-टैप में भेजता है।'
        : 'Direct deep-link integration generating itemized customer receipts and distributor purchase orders.',
      details: [
        'Itemized customer invoice format with store branding and payment mode',
        '1-tap Wholesale Supplier Reorder Slip gathering all low/out-of-stock items',
        'Uses standard wa.me URI scheme with zero third-party messaging subscription cost',
      ],
      icon: Share2,
      color: 'border-green-600 bg-green-50 text-green-900',
    },
    {
      id: 'khata-engine',
      name: isHi ? '10. ग्राहक उधार खाता (Khata)' : '10. Customer Khata Credit Engine',
      category: isHi ? 'उधार बहीखाता' : 'Credit Ledger',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'ग्राहकों की उधारी, खरीदे गए सामान और भुगतान निपटान का हिसाब रखता है।'
        : 'Tracks outstanding store credit, maps customer phone numbers, and manages settlement receipts.',
      details: [
        'Records credit purchases directly from Express Counter with 1 tap',
        '1-tap WhatsApp payment reminder with outstanding balance',
        'Audit trail of settled repayments and dates',
      ],
      icon: BookOpen,
      color: 'border-amber-600 bg-amber-50 text-amber-900',
    },
    {
      id: 'pnl-reconciler',
      name: isHi ? '11. दैनिक क्लोजिंग व पी&एल रिकंसीलर' : '11. Daily Closing & P&L Reconciler',
      category: isHi ? 'वित्तीय रिपोर्ट' : 'Financial Ledger',
      boundary: isHi ? 'लोकल डिवाइस सैंडबॉक्स' : 'Offline Client Sandbox',
      desc: isHi
        ? 'दिनभर की कुल बिक्री, नकद बनाम यूपीआई, खर्चे और शुद्ध मुनाफे का हिसाब जोड़ता है।'
        : 'Reconciles cash in drawer against UPI bank receipts, deducts categorized expenses, and computes net profit.',
      details: [
        'Gross sales vs categorized expense deduction',
        'Cash drawer tally to prevent till leakage',
        'Monthly profit calendar with profit/loss color tags',
      ],
      icon: Calendar,
      color: 'border-rose-500 bg-rose-50/60 text-rose-800',
    },
    {
      id: 'cloud-bridge',
      name: isHi ? '12. ज़ीरो-टेक क्लाउड बैकअप ब्रिज' : '12. Zero-Tech Cloud Sync Bridge',
      category: isHi ? 'क्लाउड सिंक' : 'Cloud Sync',
      boundary: isHi ? 'सुपाबेस क्लाउड बैकएंड' : 'Supabase PostgreSQL Cloud',
      desc: isHi
        ? 'मोबाइल नंबर और पिन से मल्टी-डिवाइस डेटा सिंक करता है; न रहने पर भी ऐप चालू रहता है।'
        : 'Mobile + 4-digit PIN authentication syncing local snapshots to central PostgreSQL backend.',
      details: [
        'Single centralized Supabase backend — merchant requires no cloud knowledge',
        'Optimistic local-first queueing with cloud merge',
        'Row Level Security (RLS) ensuring strict shopkeeper data isolation',
      ],
      icon: Server,
      color: 'border-cyan-600 bg-cyan-50 text-cyan-900',
    },
  ];

  const selectedComp = components.find((c) => c.id === selectedComponentId) || components[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 animate-slide-up">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Workflow className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              {isHi ? 'सिस्टम आर्किटेक्चर एवं फ्लोचार्ट' : 'System Architecture & Algorithm Blueprint'}
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Archify Runtime
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {isHi
              ? 'व्यापारस्नैप का हाई-लेवल आर्किटेक्चर, 12 मुख्य कंपोनेंट्स, 4 ट्रस्ट बाउंड्री और एल्गोरिद्म फ्लोचार्ट।'
              : 'High-level runtime architecture showing 12 core components, primary checkout path, external dependencies, and trust boundaries.'}
          </p>
        </div>

        {/* Section Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSection === 'architecture'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏗️ {isHi ? 'सिस्टम आर्किटेक्चर' : 'Architecture Blueprint'}
          </button>
          <button
            onClick={() => setActiveSection('checkout-algo')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSection === 'checkout-algo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ {isHi ? '3-टैप काउंटर एल्गोरिद्म' : '3-Tap Checkout Flow'}
          </button>
          <button
            onClick={() => setActiveSection('stock-algo')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSection === 'stock-algo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 {isHi ? 'स्टॉक व सप्लायर पर्ची' : 'Stock & Reorder Flow'}
          </button>
        </div>
      </div>

      {activeSection === 'architecture' && (
        <div className="space-y-6">
          {/* Trust Boundaries Strip */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider font-display text-emerald-300">
                {isHi ? 'चार मुख्य सुरक्षा एवं ट्रस्ट सीमाएं (4 Trust Boundaries)' : 'Four Security & Trust Boundaries'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Boundary 1: Offline Edge</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isHi
                    ? '100% दुकानदार के ब्राउज़र व मोबाइल में सैंडबॉक्स। डेटा बिना अनुमति फोन से बाहर नहीं जाता।'
                    : '100% sandboxed inside client browser. Zero sales data leaks without explicit merchant action.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  <span>Boundary 2: NPCI UPI Rail</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isHi
                    ? 'डायनेमिक यूपीआई स्ट्रिंग। कोई कार्ड या बैंकिंग पासवर्ड स्टोर नहीं होता। पैसा सीधे बैंक में।'
                    : 'Dynamic standard UPI intents. Zero card/PIN storage. Direct bank-to-bank customer settlement.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Share2 className="w-4 h-4 text-green-400" />
                  <span>Boundary 3: WhatsApp Transport</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isHi
                    ? 'एंड-टू-एंड एनक्रिप्टेड मैसेजिंग सीधे दुकानदार और ग्राहक/सप्लायर के बीच wa.me प्रोटोकॉल से।'
                    : 'Encrypted peer-to-peer digital receipts using native wa.me deep-links. Zero intermediary servers.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>Boundary 4: Cloud Database</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isHi
                    ? 'सेंट्रल सुपाबेस पोस्टग्रेस। मोबाइल व 4-अंकीय पिन से आरएलएस (Row Level Security) द्वारा सुरक्षित।'
                    : 'Supabase PostgreSQL protected via shopkeeper mobile number & hashed 4-digit PIN authentication.'}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Runtime Path Highlight */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                {isHi ? 'मुख्य रनटाइम निष्पादन पथ (Primary Runtime Path)' : 'Primary Runtime Execution Path (The 3-Tap Flow)'}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                0ms Latency
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px] pt-1">
              {[
                { step: '1', title: isHi ? 'सामान टैप' : 'Tap Product', desc: isHi ? 'बास्केट में जुड़ा' : 'Basket +1' },
                { step: '2', title: isHi ? 'राउंड-ऑफ' : 'Round-Off', desc: isHi ? 'चिल्लर छूट -₹3' : '₹93 -> ₹90' },
                { step: '3', title: isHi ? 'मोड चयन' : 'Payment Mode', desc: isHi ? 'UPI / Cash / Khata' : 'Mode Picked' },
                { step: '4', title: isHi ? 'ऑटो-स्टॉक' : 'Stock Decrement', desc: isHi ? 'स्टॉक से घटा' : 'Inventory -Qty' },
                { step: '5', title: isHi ? 'साउंडबॉक्स' : 'Voice Chime', desc: isHi ? 'हिंदी में घोषणा' : 'Hindi Voice' },
                { step: '6', title: isHi ? 'व्हाट्सएप' : 'WhatsApp Slip', desc: isHi ? 'डिजिटल पर्ची' : 'Receipt Sent' },
                { step: '7', title: isHi ? 'लेजर क्लोजिंग' : 'P&L Ledger', desc: isHi ? 'मुनाफा दर्ज' : 'Profit Updated' },
              ].map((s, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex flex-col items-center text-center">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-extrabold text-[10px] flex items-center justify-center mb-1">
                    {s.step}
                  </span>
                  <span className="font-bold text-slate-800">{s.title}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 12 Core Components Grid & Selected Component Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 12 Components Grid (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                  {isHi ? '12 मुख्य घटक (Core Components)' : '12 Core System Components'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isHi ? 'विवरण देखने के लिए किसी भी घटक पर क्लिक करें' : 'Click any card to inspect internal details'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {components.map((c) => {
                  const Icon = c.icon;
                  const isSelected = selectedComponentId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComponentId(c.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? `${c.color} ring-2 ring-emerald-500 shadow-md`
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0">
                        <Icon className="w-4 h-4 text-slate-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-slate-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {c.category}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          {c.boundary}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Supporting Detail in Interactive Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 sticky top-20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <selectedComp.icon className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-slate-900">
                        {selectedComp.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">{selectedComp.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Active
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    {isHi ? 'भूमिका व कार्य' : 'Core Role & Purpose'}
                  </label>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedComp.desc}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                    {isHi ? 'सुरक्षा सीमा (Trust Boundary)' : 'Security Boundary'}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{selectedComp.boundary}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                    {isHi ? 'आंतरिक प्रक्रियाएं (Internal Operations)' : 'Internal Execution Specifications'}
                  </label>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedComp.details.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Architecture Pattern: Local-First PWA</span>
                  <span className="text-emerald-700 font-bold">100% Offline Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Flowcharts View */}
      {(activeSection === 'checkout-algo' || activeSection === 'stock-algo') && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {activeSection === 'checkout-algo' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                  <span>The 3-Tap Point-of-Sale Checkout Algorithm</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mathematical state transitions and event lifecycle during counter sales.
                </p>
              </div>

              {/* Step-by-Step Interactive Flowchart Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px]">
                      STAGE 1: INPUT
                    </span>
                    <span>Basket Assembly</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>ON_CLICK(Product) →</div>
                    <div>cart.find(id) ? qty++ : add(new)</div>
                    <div>grossTotal = Σ(price * qty)</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Calculates gross total and evaluates if loose change rounding is required.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[10px]">
                      STAGE 2: DECISION
                    </span>
                    <span>Payment & Round-off</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>IF (gross % 10 != 0) → RoundOff</div>
                    <div>total = gross - discount</div>
                    <div>SWITCH(PaymentMode):</div>
                    <div className="pl-2">• CASH: CashDrawer += total</div>
                    <div className="pl-2">• UPI: Render QR(payload)</div>
                    <div className="pl-2">• KHATA: AppendDebt(Customer)</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Branches into direct cash intake, dynamic UPI QR generation, or khata debt indexing.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl border-2 border-purple-400 bg-purple-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-purple-900">
                    <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-[10px]">
                      STAGE 3: COMMIT
                    </span>
                    <span>Hardware & Rollback</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>atomicDecrement(product.stockQty)</div>
                    <div>playChime() & speakHindiVoice()</div>
                    <div>saveTransaction(Bill#N)</div>
                    <div>dailySales += total</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Commits atomic state to localStorage, plays soundbox voice, and enables void rollback.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-emerald-600" />
                  <span>Traffic-Light Inventory & Wholesale Reorder Algorithm</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated shelf threshold calculation and supplier WhatsApp purchase order creation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Stage 1 */}
                <div className="p-4 rounded-2xl border-2 border-rose-400 bg-rose-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px]">
                      FILTER
                    </span>
                    <span>Threshold Detection</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-rose-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>FOR EACH product IN catalog:</div>
                    <div>IF stock == 0 → RED (Khatam)</div>
                    <div>ELSE IF stock &lt; 10 → YELLOW (Kam)</div>
                    <div>ELSE → GREEN (Safe)</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Classifies inventory into immediate restock priorities without manual counting.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[10px]">
                      AUTO-CALC
                    </span>
                    <span>Order Quantity Calculation</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>orderQty = stock == 0 ? 30 : 20</div>
                    <div>allowStepperAdjustment(±5 units)</div>
                    <div>addCustomItemsFromCatalog()</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Pre-fills suggested carton quantities based on retail packaging standards.
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px]">
                      DISPATCH
                    </span>
                    <span>WhatsApp Order Slip</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-1">
                    <div>formatSlipText(Store, Items, Date)</div>
                    <div>encodeURIComponent(slipText)</div>
                    <div>open("https://wa.me/91" + phone)</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Instantly opens WhatsApp with a professional purchase order ready to send to the distributor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
