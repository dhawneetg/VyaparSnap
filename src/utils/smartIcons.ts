// Smart automatic icon detection for Indian micro-retail products and services

interface KeywordIconRule {
  keywords: string[];
  icon: string;
}

const KEYWORD_RULES: KeywordIconRule[] = [
  // --- Street Food, Snacks & Chaat ---
  { keywords: ['pani puri', 'panipuri', 'golgappa', 'puchka', 'puri', 'dahi puri', 'sev puri', 'bhel', 'chaat'], icon: '🥟' },
  { keywords: ['samosa', 'kachori', 'patties', 'patty', 'tikki', 'pakora', 'vada', 'batata'], icon: '🥟' },
  { keywords: ['chole', 'bhature', 'pav bhaji', 'pav', 'misal', 'dosa', 'idli'], icon: '🍛' },
  { keywords: ['burger', 'sandwich', 'hotdog'], icon: '🥪' },
  { keywords: ['pizza', 'slice'], icon: '🍕' },
  { keywords: ['fries', 'french fries', 'chips', 'wafers', 'kurkure', 'lays'], icon: '🍟' },
  { keywords: ['roll', 'kathi roll', 'wrap', 'frankie'], icon: '🌯' },
  { keywords: ['momos', 'dimsum'], icon: '🥟' },
  { keywords: ['noodles', 'chowmein', 'maggi', 'pasta'], icon: '🍜' },
  { keywords: ['soup'], icon: '🥣' },
  { keywords: ['ice cream', 'kulfi', 'cone', 'falooda'], icon: '🍦' },
  { keywords: ['sweet', 'mithai', 'gulab jamun', 'rasgulla', 'jalebi', 'laddu', 'peda', 'halwa'], icon: '🍡' },

  // --- e-Mitra, Cyber Cafe & Digital Services ---
  { keywords: ['aadhaar', 'aadhar', 'pvc card', 'id card', 'voter id', 'pan card', 'smart card'], icon: '🪪' },
  { keywords: ['print', 'color print', 'document print', 'form print'], icon: '🖨️' },
  { keywords: ['xerox', 'photocopy', 'copy', 'b&w print'], icon: '📄' },
  { keywords: ['lamination', 'laminate'], icon: '📑' },
  { keywords: ['online form', 'job form', 'application', 'exam form', 'police verification'], icon: '📝' },
  { keywords: ['bill', 'electricity bill', 'water bill', 'bijli', 'challan'], icon: '🧾' },
  { keywords: ['ticket', 'train ticket', 'bus ticket', 'flight ticket', 'irctc'], icon: '🎫' },
  { keywords: ['photo', 'passport photo', 'urgent photo', 'studio'], icon: '📸' },
  { keywords: ['scan', 'scanning'], icon: '📤' },
  { keywords: ['recharge', 'mobile recharge', 'dth recharge'], icon: '⚡' },
  { keywords: ['money transfer', 'dmt', 'cash withdrawal', 'aeps'], icon: '💸' },
  { keywords: ['certificate', 'caste', 'income certificate', 'bonafide', 'ration card'], icon: '📜' },
  { keywords: ['stamp', 'stamp paper', 'agreement', 'affidavit', 'notary'], icon: '⚖️' },
  { keywords: ['pen', 'pencil', 'notebook', 'register', 'envelope', 'stapler'], icon: '✏️' },

  // --- Bakery & Confectionery ---
  { keywords: ['cake', 'birthday cake', 'truffle', 'fondant', 'red velvet'], icon: '🎂' },
  { keywords: ['pastry', 'black forest', 'pineapple pastry'], icon: '🍰' },
  { keywords: ['bread', 'white bread', 'brown bread', 'multigrain', 'loaf', 'pav'], icon: '🍞' },
  { keywords: ['croissant', 'danish'], icon: '🥐' },
  { keywords: ['muffin', 'cupcake'], icon: '🧁' },
  { keywords: ['biscuit', 'cookie', 'cookies', 'rusk', 'toast', 'khari'], icon: '🍪' },
  { keywords: ['chocolate', 'chocolates', 'cadbury', 'kitkat', 'dairy milk'], icon: '🍫' },
  { keywords: ['cream roll', 'donut', 'doughnut'], icon: '🍩' },

  // --- Clothing, Garments & Boutique ---
  { keywords: ['kurti', 'kurta', 'dress', 'frock', 'gown', 'salwar'], icon: '👗' },
  { keywords: ['saree', 'sari', 'lehenga', 'dupatta', 'chunni'], icon: '🥻' },
  { keywords: ['shirt', 'formal shirt', 'casual shirt'], icon: '👔' },
  { keywords: ['t-shirt', 'tshirt', 'tee', 'polo'], icon: '👕' },
  { keywords: ['jeans', 'denim', 'pant', 'trouser', 'leggings', 'jegging', 'plazo', 'track pant'], icon: '👖' },
  { keywords: ['jacket', 'blazer', 'coat', 'sweater', 'hoodie'], icon: '🧥' },
  { keywords: ['socks', 'gloves', 'cap', 'hat', 'belt'], icon: '🧦' },
  { keywords: ['alteration', 'stitching', 'tailor', 'sewing', 'fitting', 'thread'], icon: '🪡' },
  { keywords: ['shoe', 'shoes', 'chappal', 'sandals', 'slippers'], icon: '👟' },

  // --- Mobile, Accessories & Electronics ---
  { keywords: ['mobile', 'phone', 'smartphone', 'keypad phone'], icon: '📱' },
  { keywords: ['charger', 'adapter', 'fast charger', 'plug'], icon: '🔌' },
  { keywords: ['cable', 'data cable', 'type-c', 'usb', 'lightning', 'otg', 'aux'], icon: '🪢' },
  { keywords: ['glass', 'tempered glass', 'screen guard', 'membrane'], icon: '🛡️' },
  { keywords: ['cover', 'back cover', 'phone case', 'pouch'], icon: '📱' },
  { keywords: ['earphone', 'earphones', 'headphones', 'neckband', 'airpods', 'tws', 'headset'], icon: '🎧' },
  { keywords: ['speaker', 'bluetooth speaker', 'soundbar'], icon: '🔊' },
  { keywords: ['power bank', 'battery'], icon: '🔋' },
  { keywords: ['memory card', 'sd card', 'pen drive', 'usb drive'], icon: '💾' },
  { keywords: ['sim', 'sim card', 'port'], icon: '📶' },
  { keywords: ['repair', 'screen change', 'folder change', 'jack', 'mic'], icon: '🔧' },

  // --- Beverages & Drinks ---
  { keywords: ['tea', 'chai', 'masala chai', 'cutting'], icon: '☕' },
  { keywords: ['coffee', 'cappuccino', 'latte', 'cold coffee', 'espresso'], icon: '☕' },
  { keywords: ['milk', 'doodh', 'chaas', 'buttermilk', 'lassi'], icon: '🥛' },
  { keywords: ['cold drink', 'coca-cola', 'pepsi', 'thums up', 'sprite', 'fanta', 'frooti', 'maaza', 'sting'], icon: '🥤' },
  { keywords: ['juice', 'shake', 'smoothie'], icon: '🧃' },
  { keywords: ['water', 'mineral water', 'bisleri', 'aquafina'], icon: '💧' },

  // --- Grocery, Staples & Grains ---
  { keywords: ['atta', 'flour', 'maida', 'suji', 'besan', 'wheat', 'grain'], icon: '🌾' },
  { keywords: ['rice', 'basmati', 'chawal', 'poha'], icon: '🍚' },
  { keywords: ['dal', 'toor dal', 'moong dal', 'chana', 'rajma', 'pulses'], icon: '🥣' },
  { keywords: ['oil', 'mustard oil', 'sunflower oil', 'refined oil', 'tel'], icon: '🛢️' },
  { keywords: ['ghee', 'butter', 'amul butter', 'makhan', 'paneer', 'cheese'], icon: '🧈' },
  { keywords: ['sugar', 'cheeni', 'shakkar', 'jaggery', 'gud'], icon: '🧂' },
  { keywords: ['salt', 'namak', 'tata salt'], icon: '🧂' },
  { keywords: ['masala', 'mirch', 'haldi', 'dhaniya', 'spices', 'jeera'], icon: '🌶️' },
  { keywords: ['kaju', 'badam', 'kismis', 'almond', 'cashew', 'dry fruits'], icon: '🥜' },
  { keywords: ['egg', 'eggs', 'anda'], icon: '🥚' },

  // --- Personal & Home Care ---
  { keywords: ['soap', 'dettol', 'lux', 'lifebuoy', 'bath'], icon: '🧼' },
  { keywords: ['surf', 'detergent', 'washing powder', 'ariel', 'tide'], icon: '🧺' },
  { keywords: ['shampoo', 'conditioner', 'hair oil'], icon: '🧴' },
  { keywords: ['toothpaste', 'colgate', 'brush', 'toothbrush'], icon: '🪥' },
  { keywords: ['broom', 'mop', 'pocha', 'cleaning'], icon: '🧹' },
  { keywords: ['agarbatti', 'incense', 'matchbox', 'pooja'], icon: '🪔' },
];

/**
 * Automatically resolves a smart, context-aware emoji icon for an item name
 */
export function getSmartIcon(productName: string, categoryFallback?: string): string {
  if (!productName || !productName.trim()) {
    return '📦';
  }

  const query = productName.toLowerCase().trim();

  // 1. Direct keyword match
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (query.includes(kw)) {
        return rule.icon;
      }
    }
  }

  // 2. Category-based fallback if provided
  if (categoryFallback) {
    const catLower = categoryFallback.toLowerCase();
    if (catLower.includes('bread') || catLower.includes('bakery') || catLower.includes('cake')) return '🎂';
    if (catLower.includes('drink') || catLower.includes('beverage') || catLower.includes('chai') || catLower.includes('tea')) return '☕';
    if (catLower.includes('cloth') || catLower.includes('boutique') || catLower.includes('fashion')) return '👗';
    if (catLower.includes('mobile') || catLower.includes('electronic') || catLower.includes('tech')) return '📱';
    if (catLower.includes('online') || catLower.includes('print') || catLower.includes('xerox') || catLower.includes('emitra')) return '📄';
    if (catLower.includes('food') || catLower.includes('snack') || catLower.includes('chaat') || catLower.includes('fast')) return '🥟';
    if (catLower.includes('dairy')) return '🥛';
    if (catLower.includes('staple') || catLower.includes('grain')) return '🌾';
    if (catLower.includes('personal') || catLower.includes('home')) return '🧼';
  }

  return '🏷️';
}

/**
 * Curated preset icons by business category for rapid 1-tap manual picker
 */
export const POPULAR_CATEGORY_ICONS = {
  'Street Food & Chaat': ['🥟', '🍛', '🥪', '🍕', '🍟', '🌯', '🍜', '🥣', '🍦', '🍡', '🧃', '🥤', '🍵'],
  'e-Mitra & Digital': ['🪪', '🖨️', '📄', '📑', '📝', '🧾', '🎫', '📸', '📤', '⚡', '💸', '📜', '⚖️', '✏️'],
  'Bakery & Sweets': ['🎂', '🍰', '🍞', '🥐', '🧁', '🍪', '🍫', '🍩', '🧈', '🧇', '🥞'],
  'Clothing & Fashion': ['👗', '🥻', '👔', '👕', '👖', '🧥', '🧦', '🪡', '👟', '👜', '🕶️'],
  'Mobile & Tech': ['📱', '🔌', '🪢', '🛡️', '🎧', '🔊', '🔋', '💾', '📶', '🔧', '💻'],
  'Kirana & Grocery': ['🥛', '🍞', '🥚', '🧈', '🧂', '🌾', '🛢️', '☕', '🍪', '🍜', '🍚', '🥣', '🧼', '🧺'],
};
