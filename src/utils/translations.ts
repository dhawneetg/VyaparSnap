export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Brand & Slogans
  appTitle: {
    en: 'VyaparSnap',
    hi: 'व्यापारस्नैप',
  },
  appTagline: {
    en: '3-Tap Counter, WhatsApp Billing & Daily Profit Ledger',
    hi: '3-टैप काउंटर, व्हाट्सएप बिलिंग व दैनिक मुनाफा खाता',
  },
  retailOS: {
    en: 'Retail OS',
    hi: 'स्मार्ट दुकान',
  },

  // Navigation Tabs
  counterTab: {
    en: '3-Tap Counter',
    hi: '3-टैप काउंटर',
  },
  stockTab: {
    en: 'Stock Ledger',
    hi: 'स्टॉक खाता',
  },
  khataTab: {
    en: 'Khata (Credit)',
    hi: 'ग्राहक खाता (उधार)',
  },
  dailyClosingTab: {
    en: 'Daily Closing',
    hi: 'दैनिक क्लोजिंग',
  },
  calendarTab: {
    en: 'Calendar',
    hi: 'कैलेंडर',
  },
  analyticsTab: {
    en: 'Analytics',
    hi: 'बिज़नेस रिपोर्ट',
  },
  architectureTab: {
    en: 'System & Architecture',
    hi: 'सिस्टम फ्लोचार्ट',
  },

  // Header Actions
  cloudSync: {
    en: 'Cloud Sync',
    hi: 'क्लाउड सिंक',
  },
  storeProfile: {
    en: 'Store Profile',
    hi: 'दुकान प्रोफाइल',
  },
  resetDemo: {
    en: 'Reset Demo',
    hi: 'डेमो रीसेट',
  },
  print: {
    en: 'Print',
    hi: 'प्रिंट',
  },
  exportData: {
    en: 'Export JSON',
    hi: 'बैकअप डाउनलोड',
  },
  importData: {
    en: 'Import JSON',
    hi: 'बैकअप लोड',
  },
  languageToggle: {
    en: 'हिंदी',
    hi: 'English',
  },

  // Counter View
  counterTitle: {
    en: '3-Tap Express Counter',
    hi: '3-टैप सुपरफ़ास्ट काउंटर',
  },
  counterSubtitle: {
    en: 'Tap items to build basket • 1-tap WhatsApp bill • Auto-stock deduction',
    hi: 'सामान दबाकर टोकन बनाएं • 1-टैप व्हाट्सएप बिल • स्टॉक स्वतः घटेगा',
  },
  soundboxVoice: {
    en: 'Soundbox',
    hi: 'साउंडबॉक्स',
  },
  todaysBills: {
    en: "Today's Bills",
    hi: 'आज के बिल',
  },
  searchPlaceholder: {
    en: 'Search milk, atta, oil, biscuits, tea...',
    hi: 'दूध, आटा, तेल, बिस्कुट, चाय खोजें...',
  },
  addNewProduct: {
    en: '+ Add New Item',
    hi: '+ नया सामान जोड़ें',
  },
  currentBasket: {
    en: 'Current Basket',
    hi: 'वर्तमान बिल टोकन',
  },
  clearBasket: {
    en: 'Clear',
    hi: 'साफ करें',
  },
  basketEmpty: {
    en: 'Counter ticket is empty.',
    hi: 'काउंटर टिकट खाली है।',
  },
  basketEmptyHint: {
    en: 'Tap items on the left to add.',
    hi: 'बाईं ओर से सामान दबाकर जोड़ें।',
  },
  totalPayable: {
    en: 'Total Payable Amount',
    hi: 'कुल देय राशि',
  },
  itemsCount: {
    en: 'Items',
    hi: 'सामान',
  },
  paymentChannel: {
    en: 'Payment Channel',
    hi: 'भुगतान का माध्यम',
  },
  cash: {
    en: '💵 Cash',
    hi: '💵 नकद (Cash)',
  },
  upiQr: {
    en: '📱 UPI QR',
    hi: '📱 यूपीआई (UPI QR)',
  },
  khataCredit: {
    en: '📒 Khata / Credit',
    hi: '📒 उधार (Khata)',
  },
  customerNameOptional: {
    en: 'Customer Name (Optional)',
    hi: 'ग्राहक का नाम (वैकल्पिक)',
  },
  customerNameRequired: {
    en: 'Customer Name (Required)',
    hi: 'ग्राहक का नाम (अनिवार्य)',
  },
  mobileNumber: {
    en: 'WhatsApp Mobile (Optional)',
    hi: 'व्हाट्सएप मोबाइल नंबर',
  },
  completeSale: {
    en: 'Complete Sale (Done)',
    hi: 'बिक्री पूरी करें (Done)',
  },
  whatsAppBillSave: {
    en: 'WhatsApp Bill & Save',
    hi: 'व्हाट्सएप पर्ची भेजें व सेव करें',
  },
  roundOff: {
    en: 'Round to',
    hi: 'राउंड ऑफ करें',
  },
  discountApplied: {
    en: 'Discount Applied',
    hi: 'छूट दी गई',
  },

  // Stock Ledger
  stockTitle: {
    en: 'Traffic-Light Stock Ledger',
    hi: 'ट्रैफिक-लाइट स्टॉक खाता',
  },
  stockSubtitle: {
    en: 'Color-coded shelf monitor • 1-tap preset restock • Edit & Delete items • Auto-decrement on counter sale',
    hi: 'रंग-बिरंगा शेल्फ मॉनिटर • 1-टैप स्टॉक रिफिल • सामान बदलें व हटाएं • बिक्री पर स्वतः कटौती',
  },
  outOfStock: {
    en: '🔴 Out of Stock',
    hi: '🔴 खत्म सामान (0 बचा)',
  },
  lowStock: {
    en: '🟡 Low Stock',
    hi: '🟡 कम स्टॉक (< 10 बचा)',
  },
  safeStock: {
    en: '🟢 Safe Stock',
    hi: '🟢 भरपूर स्टॉक',
  },
  supplierSlipBtn: {
    en: '📲 Supplier Reorder Slip',
    hi: '📲 सप्लायर ऑर्डर पर्ची',
  },

  // Khata
  khataTitle: {
    en: 'Customer Credit Ledger (Khata)',
    hi: 'ग्राहक उधारी बहीखाता (खाता)',
  },
  pendingCredit: {
    en: 'Total Outstanding Credit',
    hi: 'कुल बकाया उधारी',
  },
  settleCredit: {
    en: 'Mark Settled (चुकाया)',
    hi: 'उधार चुकता करें',
  },
  sendWhatsAppReminder: {
    en: 'WhatsApp Reminder',
    hi: 'तकादा संदेश भेजें',
  },

  // Daily Closing
  dailyClosingTitle: {
    en: 'Daily Closing & Profit Reconciler',
    hi: 'दैनिक क्लोजिंग व मुनाफा हिसाब',
  },
  grossSales: {
    en: 'Gross Sales',
    hi: 'कुल बिक्री (Gross Sales)',
  },
  expenses: {
    en: 'Expenses',
    hi: 'दुकान के खर्चे',
  },
  netProfit: {
    en: 'Net Profit',
    hi: 'शुद्ध मुनाफा (Net Profit)',
  },
  cashInHand: {
    en: 'Cash in Drawer',
    hi: 'गल्ले में नकद',
  },
  upiCollected: {
    en: 'UPI Bank Inflow',
    hi: 'बैंक में यूपीआई',
  },
};

export function getTranslation(key: string, lang: Language): string {
  if (TRANSLATIONS[key]) {
    return TRANSLATIONS[key][lang] || TRANSLATIONS[key].en;
  }
  return key;
}
