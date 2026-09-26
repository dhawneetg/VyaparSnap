import { Product, BusinessType, StoreProfile } from '../types';

export interface BusinessPreset {
  id: BusinessType;
  label: string;
  hindiLabel: string;
  icon: string;
  defaultStoreName: string;
  defaultOwnerName: string;
  defaultUpi: string;
  categories: string[];
  starterProducts: Product[];
}

export const BUSINESS_PRESETS: Record<BusinessType, BusinessPreset> = {
  kirana: {
    id: 'kirana',
    label: 'Kirana & Grocery',
    hindiLabel: 'किराना व जनरल स्टोर',
    icon: '🛒',
    defaultStoreName: 'Ramesh Kirana & General Store',
    defaultOwnerName: 'Ramesh Kumar',
    defaultUpi: 'rameshkirana@okhdfcbank',
    categories: ['Dairy & Bakery', 'Staples & Grains', 'Packaged Food', 'Beverages', 'Personal & Home'],
    starterProducts: [
      { id: 'p1', name: 'Amul Taaza Milk 500ml', price: 33, stockQty: 24, category: 'Dairy & Bakery', icon: '🥛', isFrequent: true, unit: 'pouch' },
      { id: 'p2', name: 'Modern Bread (White)', price: 25, stockQty: 14, category: 'Dairy & Bakery', icon: '🍞', isFrequent: true, unit: 'pack' },
      { id: 'p3', name: 'Farm Fresh Eggs', price: 42, stockQty: 30, category: 'Dairy & Bakery', icon: '🥚', isFrequent: true, unit: '6 pcs' },
      { id: 'p4', name: 'Amul Butter 100g', price: 58, stockQty: 6, category: 'Dairy & Bakery', icon: '🧈', isFrequent: true, unit: 'pack' },
      { id: 'p5', name: 'Madhur Sugar Pure 1kg', price: 44, stockQty: 45, category: 'Staples & Grains', icon: '🧂', isFrequent: true, unit: '1 kg' },
      { id: 'p6', name: 'Aashirvaad Shudh Atta 5kg', price: 210, stockQty: 3, category: 'Staples & Grains', icon: '🌾', isFrequent: true, unit: '5 kg' },
      { id: 'p7', name: 'Fortune Sunlite Oil 1L', price: 145, stockQty: 10, category: 'Staples & Grains', icon: '🛢️', isFrequent: false, unit: '1 ltr' },
      { id: 'p8', name: 'Tata Tea Gold 250g', price: 130, stockQty: 18, category: 'Beverages', icon: '☕', isFrequent: true, unit: '250 g' },
      { id: 'p9', name: 'Parle-G Gold Biscuits', price: 10, stockQty: 50, category: 'Packaged Food', icon: '🍪', isFrequent: true, unit: 'pack' },
      { id: 'p10', name: 'Maggi 2-Minute Noodles', price: 14, stockQty: 25, category: 'Packaged Food', icon: '🍜', isFrequent: true, unit: 'pack' },
      { id: 'p11', name: 'Tata Salt Vacuum 1kg', price: 28, stockQty: 32, category: 'Staples & Grains', icon: '🧂', isFrequent: false, unit: '1 kg' },
      { id: 'p12', name: 'Dettol Soap Original', price: 38, stockQty: 22, category: 'Personal & Home', icon: '🧼', isFrequent: false, unit: 'bar' },
    ],
  },

  bakery: {
    id: 'bakery',
    label: 'Bakery & Confectionery',
    hindiLabel: 'बेकरी व केक शॉप',
    icon: '🎂',
    defaultStoreName: 'Crown Bakehouse & Pastry Shop',
    defaultOwnerName: 'Sunil Verma',
    defaultUpi: 'crownbakery@upi',
    categories: ['Cakes & Pastries', 'Fresh Breads', 'Savory Snacks', 'Cookies & Biscuits', 'Beverages'],
    starterProducts: [
      { id: 'b1', name: 'Chocolate Truffle Cake 500g', price: 350, stockQty: 8, category: 'Cakes & Pastries', icon: '🎂', isFrequent: true, unit: 'half kg' },
      { id: 'b2', name: 'Black Forest Pastry', price: 55, stockQty: 20, category: 'Cakes & Pastries', icon: '🍰', isFrequent: true, unit: 'piece' },
      { id: 'b3', name: 'Fresh Milk Bread Loaf', price: 35, stockQty: 30, category: 'Fresh Breads', icon: '🍞', isFrequent: true, unit: 'pack' },
      { id: 'b4', name: 'Crispy Veg Paneer Patties', price: 30, stockQty: 25, category: 'Savory Snacks', icon: '🥟', isFrequent: true, unit: 'piece' },
      { id: 'b5', name: 'Hot Aloo Patties', price: 20, stockQty: 35, category: 'Savory Snacks', icon: '🥟', isFrequent: true, unit: 'piece' },
      { id: 'b6', name: 'Butter Croissant', price: 60, stockQty: 12, category: 'Fresh Breads', icon: '🥐', isFrequent: false, unit: 'piece' },
      { id: 'b7', name: 'Red Velvet Cupcake', price: 45, stockQty: 18, category: 'Cakes & Pastries', icon: '🧁', isFrequent: true, unit: 'piece' },
      { id: 'b8', name: 'Butter Choco-chip Cookies', price: 120, stockQty: 15, category: 'Cookies & Biscuits', icon: '🍪', isFrequent: false, unit: 'box' },
      { id: 'b9', name: 'Vanilla Cream Roll', price: 15, stockQty: 40, category: 'Savory Snacks', icon: '🍩', isFrequent: true, unit: 'piece' },
      { id: 'b10', name: 'Bakery Milk Rusk Toast', price: 40, stockQty: 22, category: 'Cookies & Biscuits', icon: '🍞', isFrequent: false, unit: 'pack' },
    ],
  },

  streetfood: {
    id: 'streetfood',
    label: 'Street Food & Pani Puri',
    hindiLabel: 'पानी पूरी व चाट भंडार',
    icon: '🥟',
    defaultStoreName: 'Gupta Ji Chaat & Pani Puri',
    defaultOwnerName: 'Raju Gupta',
    defaultUpi: 'guptapanipuri@paytm',
    categories: ['Pani Puri Specials', 'Chaat Counters', 'Fried Snacks', 'Beverages'],
    starterProducts: [
      { id: 'sf1', name: 'Pani Puri / Golgappa (6 pcs)', price: 30, stockQty: 150, category: 'Pani Puri Specials', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'sf2', name: 'Special Dahi Puri (6 pcs)', price: 50, stockQty: 80, category: 'Pani Puri Specials', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'sf3', name: 'Sev Puri Mumbai Style', price: 40, stockQty: 75, category: 'Pani Puri Specials', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'sf4', name: 'Sukha Masala Puri (Extra)', price: 15, stockQty: 90, category: 'Pani Puri Specials', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'sf5', name: 'Crispy Samosa Chaat', price: 45, stockQty: 60, category: 'Chaat Counters', icon: '🍛', isFrequent: true, unit: 'plate' },
      { id: 'sf6', name: 'Delhi Papdi Chaat', price: 50, stockQty: 50, category: 'Chaat Counters', icon: '🍛', isFrequent: false, unit: 'plate' },
      { id: 'sf7', name: 'Mumbai Bhel Puri', price: 35, stockQty: 70, category: 'Chaat Counters', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'sf8', name: 'Ragda Patties Plate', price: 50, stockQty: 40, category: 'Chaat Counters', icon: '🍛', isFrequent: false, unit: 'plate' },
      { id: 'sf9', name: 'Chilled Bisleri Water 500ml', price: 10, stockQty: 48, category: 'Beverages', icon: '💧', isFrequent: true, unit: 'bottle' },
      { id: 'sf10', name: 'Cold Drink Can 300ml', price: 40, stockQty: 30, category: 'Beverages', icon: '🥤', isFrequent: false, unit: 'can' },
    ],
  },

  emitra: {
    id: 'emitra',
    label: 'e-Mitra & Cyber Cafe',
    hindiLabel: 'ई-मित्र व ऑनलाइन सेवा केंद्र',
    icon: '💻',
    defaultStoreName: 'Sharma e-Mitra & Online Hub',
    defaultOwnerName: 'Dinesh Sharma',
    defaultUpi: 'sharmaemitra@upi',
    categories: ['Print & Xerox', 'Smart Cards & PVC', 'Online Forms & Gov', 'Utility Bills', 'Stationery'],
    starterProducts: [
      { id: 'em1', name: 'Aadhaar PVC Smart Card', price: 70, stockQty: 50, category: 'Smart Cards & PVC', icon: '🪪', isFrequent: true, unit: 'card' },
      { id: 'em2', name: 'B&W Photocopy / Xerox', price: 2, stockQty: 500, category: 'Print & Xerox', icon: '📄', isFrequent: true, unit: 'page' },
      { id: 'em3', name: 'Color Printout (Laser)', price: 10, stockQty: 200, category: 'Print & Xerox', icon: '🖨️', isFrequent: true, unit: 'page' },
      { id: 'em4', name: 'Document Lamination A4', price: 20, stockQty: 80, category: 'Print & Xerox', icon: '📑', isFrequent: true, unit: 'sheet' },
      { id: 'em5', name: 'Online Job Form Filling', price: 100, stockQty: 99, category: 'Online Forms & Gov', icon: '📝', isFrequent: true, unit: 'form' },
      { id: 'em6', name: 'New PAN Card Application', price: 200, stockQty: 50, category: 'Online Forms & Gov', icon: '🪪', isFrequent: true, unit: 'app' },
      { id: 'em7', name: 'Electricity / Water Bill Pay', price: 15, stockQty: 100, category: 'Utility Bills', icon: '🧾', isFrequent: true, unit: 'bill' },
      { id: 'em8', name: 'Passport Size Photo (8 Pcs)', price: 50, stockQty: 60, category: 'Smart Cards & PVC', icon: '📸', isFrequent: true, unit: 'sheet' },
      { id: 'em9', name: 'Train Ticket Booking (IRCTC)', price: 60, stockQty: 40, category: 'Online Forms & Gov', icon: '🎫', isFrequent: false, unit: 'ticket' },
      { id: 'em10', name: 'Mobile Recharge Service', price: 10, stockQty: 100, category: 'Utility Bills', icon: '⚡', isFrequent: false, unit: 'service' },
    ],
  },

  boutique: {
    id: 'boutique',
    label: 'Clothing & Boutique',
    hindiLabel: 'कपड़ा व बुटीक सेंटर',
    icon: '👗',
    defaultStoreName: 'Shree Fashion & Designer Boutique',
    defaultOwnerName: 'Pooja Agarwal',
    defaultUpi: 'shreefashion@upi',
    categories: ['Women Ethnic', 'Men Casuals', 'Bottom Wear', 'Accessories', 'Stitching & Alteration'],
    starterProducts: [
      { id: 'c1', name: 'Pure Cotton Daily Kurti', price: 450, stockQty: 18, category: 'Women Ethnic', icon: '👗', isFrequent: true, unit: 'piece' },
      { id: 'c2', name: 'Designer Anarkali Kurti', price: 850, stockQty: 10, category: 'Women Ethnic', icon: '👗', isFrequent: true, unit: 'piece' },
      { id: 'c3', name: 'Stretch Denim Jeans (Slim)', price: 799, stockQty: 14, category: 'Bottom Wear', icon: '👖', isFrequent: true, unit: 'piece' },
      { id: 'c4', name: 'Casual Cotton T-Shirt', price: 299, stockQty: 25, category: 'Men Casuals', icon: '👕', isFrequent: true, unit: 'piece' },
      { id: 'c5', name: 'Formal Office Shirt', price: 550, stockQty: 12, category: 'Men Casuals', icon: '👔', isFrequent: false, unit: 'piece' },
      { id: 'c6', name: 'Bandhani Print Dupatta', price: 180, stockQty: 22, category: 'Women Ethnic', icon: '🥻', isFrequent: true, unit: 'piece' },
      { id: 'c7', name: 'Lycra Leggings (Free Size)', price: 220, stockQty: 30, category: 'Bottom Wear', icon: '👖', isFrequent: true, unit: 'piece' },
      { id: 'c8', name: 'Trouser Pant Alteration', price: 50, stockQty: 50, category: 'Stitching & Alteration', icon: '🪡', isFrequent: true, unit: 'job' },
      { id: 'c9', name: 'Kurti Fitting & Stitching', price: 120, stockQty: 30, category: 'Stitching & Alteration', icon: '🪡', isFrequent: false, unit: 'job' },
      { id: 'c10', name: 'Cotton Ankle Socks (Pair)', price: 40, stockQty: 40, category: 'Accessories', icon: '🧦', isFrequent: false, unit: 'pair' },
    ],
  },

  cafe: {
    id: 'cafe',
    label: 'Cafe & Quick Service',
    hindiLabel: 'चाय, नाश्ता व कैफे',
    icon: '☕',
    defaultStoreName: 'Chai & Samosa Junction',
    defaultOwnerName: 'Vikram Singh',
    defaultUpi: 'chaijunction@upi',
    categories: ['Chai & Coffee', 'Hot Snacks', 'Sandwiches & Burgers', 'Cold Beverages'],
    starterProducts: [
      { id: 'cf1', name: 'Adrak Elaichi Masala Chai', price: 15, stockQty: 200, category: 'Chai & Coffee', icon: '☕', isFrequent: true, unit: 'cup' },
      { id: 'cf2', name: 'Filter Coffee South Style', price: 25, stockQty: 120, category: 'Chai & Coffee', icon: '☕', isFrequent: true, unit: 'cup' },
      { id: 'cf3', name: 'Crispy Samosa (2 pcs)', price: 30, stockQty: 80, category: 'Hot Snacks', icon: '🥟', isFrequent: true, unit: 'plate' },
      { id: 'cf4', name: 'Hot Bread Pakora with Chutney', price: 25, stockQty: 50, category: 'Hot Snacks', icon: '🥟', isFrequent: true, unit: 'piece' },
      { id: 'cf5', name: 'Veg Grilled Cheese Sandwich', price: 65, stockQty: 40, category: 'Sandwiches & Burgers', icon: '🥪', isFrequent: true, unit: 'piece' },
      { id: 'cf6', name: 'Classic Bun Maska', price: 35, stockQty: 45, category: 'Hot Snacks', icon: '🍞', isFrequent: true, unit: 'piece' },
      { id: 'cf7', name: 'Thick Cold Coffee with Icecream', price: 70, stockQty: 35, category: 'Cold Beverages', icon: '🥤', isFrequent: true, unit: 'glass' },
      { id: 'cf8', name: 'Spicy Paneer Roll', price: 80, stockQty: 30, category: 'Sandwiches & Burgers', icon: '🌯', isFrequent: false, unit: 'roll' },
      { id: 'cf9', name: 'Crispy Peri-Peri French Fries', price: 60, stockQty: 35, category: 'Hot Snacks', icon: '🍟', isFrequent: false, unit: 'plate' },
      { id: 'cf10', name: 'Mineral Water 500ml', price: 10, stockQty: 50, category: 'Cold Beverages', icon: '💧', isFrequent: true, unit: 'bottle' },
    ],
  },

  electronics: {
    id: 'electronics',
    label: 'Mobile & Electronics',
    hindiLabel: 'मोबाइल व इलेक्ट्रॉनिक शॉप',
    icon: '📱',
    defaultStoreName: 'Om Telecom & Mobile Accessories',
    defaultOwnerName: 'Amit Patel',
    defaultUpi: 'omtelecom@upi',
    categories: ['Cables & Chargers', 'Protective Gear', 'Audio & Earphones', 'Accessories', 'Repair Services'],
    starterProducts: [
      { id: 'el1', name: 'Fast Charging Cable (Type-C)', price: 150, stockQty: 35, category: 'Cables & Chargers', icon: '🪢', isFrequent: true, unit: 'pc' },
      { id: 'el2', name: '20W Fast Charging Adapter', price: 350, stockQty: 20, category: 'Cables & Chargers', icon: '🔌', isFrequent: true, unit: 'pc' },
      { id: 'el3', name: '9D Full Glue Tempered Glass', price: 100, stockQty: 60, category: 'Protective Gear', icon: '🛡️', isFrequent: true, unit: 'pc' },
      { id: 'el4', name: 'Clear Silicone Phone Case', price: 120, stockQty: 40, category: 'Protective Gear', icon: '📱', isFrequent: true, unit: 'pc' },
      { id: 'el5', name: 'Bass Wired 3.5mm Earphones', price: 199, stockQty: 25, category: 'Audio & Earphones', icon: '🎧', isFrequent: true, unit: 'pc' },
      { id: 'el6', name: 'Wireless Bluetooth Neckband', price: 499, stockQty: 15, category: 'Audio & Earphones', icon: '🎧', isFrequent: true, unit: 'pc' },
      { id: 'el7', name: 'OTG Metal USB Connector', price: 50, stockQty: 40, category: 'Accessories', icon: '💾', isFrequent: false, unit: 'pc' },
      { id: 'el8', name: 'Mobile Charging Port Repair', price: 200, stockQty: 50, category: 'Repair Services', icon: '🔧', isFrequent: true, unit: 'service' },
      { id: 'el9', name: 'Display Screen Glass Replacement', price: 800, stockQty: 20, category: 'Repair Services', icon: '📱', isFrequent: false, unit: 'service' },
      { id: 'el10', name: '10,000 mAh Power Bank', price: 899, stockQty: 8, category: 'Accessories', icon: '🔋', isFrequent: false, unit: 'pc' },
    ],
  },

  custom: {
    id: 'custom',
    label: 'Custom Business Profile',
    hindiLabel: 'कस्टम दुकान / व्यापार',
    icon: '🏷️',
    defaultStoreName: 'My Retail Business',
    defaultOwnerName: 'Business Owner',
    defaultUpi: 'merchant@upi',
    categories: ['General Items', 'Services', 'Special Offers'],
    starterProducts: [
      { id: 'cu1', name: 'Standard Product A', price: 100, stockQty: 25, category: 'General Items', icon: '🏷️', isFrequent: true, unit: 'item' },
      { id: 'cu2', name: 'Premium Service B', price: 250, stockQty: 50, category: 'Services', icon: '⚡', isFrequent: true, unit: 'service' },
      { id: 'cu3', name: 'Quick Sale Item C', price: 50, stockQty: 40, category: 'General Items', icon: '📦', isFrequent: true, unit: 'item' },
    ],
  },
};

export const DEFAULT_STORE_PROFILE: StoreProfile = {
  storeName: 'Ramesh Kirana & General Store',
  ownerName: 'Ramesh Kumar',
  phone: '9876543210',
  upiVpa: 'rameshkirana@okhdfcbank',
  businessType: 'kirana',
  currencySymbol: '₹',
};
