import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CounterView } from './components/CounterView';
import { StockLedgerView } from './components/StockLedgerView';
import { KhataView } from './components/KhataView';
import { DailyEntryView } from './components/DailyEntryView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReceiptModal } from './components/ReceiptModal';
import { BottomNav } from './components/BottomNav';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { AuthModal } from './components/AuthModal';
import { ActiveTab, DailyEntry, Product, KhataRecord, CartItem, StoreProfile, SaleTransaction } from './types';
import { FlowchartView } from './components/FlowchartView';
import { Language } from './utils/translations';
import {
  loadEntries,
  saveEntry,
  deleteEntry,
  loadProducts,
  saveProduct,
  deleteProduct,
  updateStockQuantity,
  decrementStockOnSale,
  loadKhata,
  addKhataRecord,
  settleKhataRecord,
  loadTransactions,
  saveTransaction,
  deleteTransaction,
  resetToSeedData,
  calculateMonthlyStats,
  loadStoreProfile,
  saveStoreProfile,
} from './utils/storage';

export const App: React.FC = () => {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [khataRecords, setKhataRecords] = useState<KhataRecord[]>([]);
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('counter');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-26');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [receiptEntry, setReceiptEntry] = useState<DailyEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Language State: 'en' (English) | 'hi' (Hindi), persisted in localStorage
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('vyaparsnap_language') as Language) || 'en';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('vyaparsnap_language', next);
      showToast(next === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है 🇮🇳' : 'Switched language to English 🇬🇧');
      return next;
    });
  };

  // Store Profile & Modals
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(loadStoreProfile());
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    setEntries(loadEntries());
    setProducts(loadProducts());
    setKhataRecords(loadKhata());
    setTransactions(loadTransactions());
    setStoreProfile(loadStoreProfile());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveStoreProfile = (newProfile: StoreProfile) => {
    const saved = saveStoreProfile(newProfile);
    setStoreProfile(saved);
    showToast(
      language === 'hi'
        ? `दुकान प्रोफाइल अपडेट: ${newProfile.storeName}`
        : `Store updated: ${newProfile.storeName}`
    );
  };

  const handleApplyPresetCatalog = (newProducts: Product[], newProfile: StoreProfile) => {
    setProducts(newProducts);
    localStorage.setItem('salessnap_products_v2', JSON.stringify(newProducts));
    const saved = saveStoreProfile(newProfile);
    setStoreProfile(saved);
    showToast(
      language === 'hi'
        ? `दुकान बदली: ${newProfile.storeName} (${newProducts.length} सामान लोड हुए)!`
        : `Switched to ${newProfile.storeName} (${newProducts.length} items loaded)!`
    );
  };

  const handleCloudSyncSuccess = (cloudData: {
    profile?: StoreProfile;
    products?: Product[];
    entries?: Record<string, DailyEntry>;
    khata?: KhataRecord[];
  }) => {
    if (cloudData.profile) {
      saveStoreProfile(cloudData.profile);
      setStoreProfile(cloudData.profile);
    }
    if (cloudData.products) {
      setProducts(cloudData.products);
      localStorage.setItem('salessnap_products_v2', JSON.stringify(cloudData.products));
    }
    if (cloudData.entries) {
      setEntries(cloudData.entries);
      localStorage.setItem('salessnap_entries_v2', JSON.stringify(cloudData.entries));
    }
    if (cloudData.khata) {
      setKhataRecords(cloudData.khata);
      localStorage.setItem('salessnap_khata_v2', JSON.stringify(cloudData.khata));
    }
  };

  /* ==================== ACTIONS ==================== */
  const handleSaveEntry = (entry: DailyEntry) => {
    const updated = saveEntry(entry);
    setEntries(updated);
    setSelectedDate(entry.date);
    showToast(`Saved ₹${entry.sales} sales for ${entry.date}!`);
  };

  const handleDeleteEntry = (date: string) => {
    if (window.confirm(`Are you sure you want to remove the record for ${date}?`)) {
      const updated = deleteEntry(date);
      setEntries(updated);
      showToast(`Removed entry for ${date}`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all records back to demo dataset (September ledger, stock, khata, bills)?')) {
      const reset = resetToSeedData();
      setEntries(reset.entries);
      setProducts(reset.products);
      setKhataRecords(reset.khata);
      setTransactions(reset.transactions);
      setSelectedDate('2026-09-26');
      showToast('Reset to demo dataset successfully');
    }
  };

  // 3-Tap Counter Sale Completion: decrements stock, records transaction & updates daily sales
  const handleCompleteCounterSale = (
    total: number,
    mode: 'CASH' | 'UPI' | 'KHATA',
    cart: CartItem[],
    customerName?: string,
    customerPhone?: string,
    discount?: number
  ) => {
    const todayStr = '2026-09-26';
    const current = entries[todayStr] || {
      date: todayStr,
      sales: 0,
      expenses: 0,
      cashSales: 0,
      upiSales: 0,
      notes: '',
    };

    const newSales = current.sales + total;
    const newCash = mode === 'CASH' ? (current.cashSales || 0) + total : (current.cashSales || 0);
    const newUpi = mode === 'UPI' ? (current.upiSales || 0) + total : (current.upiSales || 0);
    const newKhata = mode === 'KHATA' ? (current.khataSales || 0) + total : (current.khataSales || 0);

    const updatedEntry: DailyEntry = {
      ...current,
      sales: newSales,
      cashSales: newCash,
      upiSales: newUpi,
      khataSales: newKhata,
      transactionCount: (current.transactionCount || 49) + 1,
      notes: current.notes ? `${current.notes} + Counter ₹${total}` : `Counter ₹${total}`,
    };

    const savedEntries = saveEntry(updatedEntry);
    setEntries(savedEntries);

    // Record persistent sale transaction
    const nextBillNo = transactions.length > 0 ? Math.max(...transactions.map((t) => t.billNo || 100)) + 1 : 101;
    const newTx: SaleTransaction = {
      id: `txn-${Date.now()}`,
      billNo: nextBillNo,
      timestamp: new Date().toISOString(),
      date: todayStr,
      total,
      paymentMode: mode,
      cart,
      customerName,
      customerPhone,
      discount,
    };
    const updatedTxns = saveTransaction(newTx);
    setTransactions(updatedTxns);

    // Auto-decrement inventory stock for sold items
    const updatedProducts = decrementStockOnSale(cart);
    setProducts(updatedProducts);

    // If Khata credit, append to customer Khata ledger
    if (mode === 'KHATA') {
      const itemNames = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');
      const updatedKhata = addKhataRecord({
        customerName: customerName || 'Walk-in Credit Customer',
        customerPhone: customerPhone || '',
        amount: total,
        date: todayStr,
        notes: itemNames || 'Counter credit sale',
        isSettled: false,
      });
      setKhataRecords(updatedKhata);
      showToast(`Bill #${nextBillNo} (₹${total}) added to ${customerName || 'Customer'} Khata!`);
    } else {
      showToast(`Bill #${nextBillNo} recorded: ₹${total} via ${mode}!`);
    }
  };

  // Void a sale transaction with stock restoration and ledger adjustment
  const handleVoidTransaction = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;
    if (
      !window.confirm(
        `Void Bill #${tx.billNo} for ₹${tx.total}?\n\n• Restores stock quantities for sold items\n• Deducts ₹${tx.total} from today's ledger`
      )
    ) {
      return;
    }

    const updatedTxns = deleteTransaction(transactionId);
    setTransactions(updatedTxns);

    // Restore stock for items
    let currentProducts = loadProducts();
    tx.cart.forEach((item) => {
      if (item.productId) {
        currentProducts = updateStockQuantity(item.productId, item.qty);
      }
    });
    setProducts(currentProducts);

    // Adjust daily entry
    const current = entries[tx.date];
    if (current) {
      const adjSales = Math.max(0, current.sales - tx.total);
      const adjCash = tx.paymentMode === 'CASH' ? Math.max(0, (current.cashSales || 0) - tx.total) : current.cashSales;
      const adjUpi = tx.paymentMode === 'UPI' ? Math.max(0, (current.upiSales || 0) - tx.total) : current.upiSales;
      const adjKhata = tx.paymentMode === 'KHATA' ? Math.max(0, (current.khataSales || 0) - tx.total) : current.khataSales;

      const updatedEntry: DailyEntry = {
        ...current,
        sales: adjSales,
        cashSales: adjCash,
        upiSales: adjUpi,
        khataSales: adjKhata,
        transactionCount: Math.max(0, (current.transactionCount || 1) - 1),
      };
      const saved = saveEntry(updatedEntry);
      setEntries(saved);
    }

    showToast(`Bill #${tx.billNo} voided and stock restored!`);
  };

  // Stock updates
  const handleUpdateStock = (productId: string, delta: number) => {
    const updated = updateStockQuantity(productId, delta);
    setProducts(updated);
    showToast(`Stock updated!`);
  };

  const handleAddProduct = (newProd: Product) => {
    const updated = saveProduct(newProd);
    setProducts(updated);
    showToast(`Added ${newProd.name} to inventory!`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = saveProduct(updatedProd);
    setProducts(updated);
    showToast(`Updated ${updatedProd.name}!`);
  };

  const handleDeleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    const updated = deleteProduct(productId);
    setProducts(updated);
    showToast(`Deleted ${target?.name || 'item'} from catalog.`);
  };

  // Khata settlements
  const handleSettleKhata = (id: string) => {
    const updated = settleKhataRecord(id);
    setKhataRecords(updated);
    showToast(`Credit account marked settled!`);
  };

  const stats = calculateMonthlyStats(entries, '2026-09');
  const currentEditingEntry = entries[selectedDate] || {
    date: selectedDate,
    sales: 0,
    expenses: 0,
    cashSales: 0,
    upiSales: 0,
    notes: '',
  };

  const lowStockCount = products.filter((p) => p.stockQty < 10).length;
  const pendingKhataCount = khataRecords.filter((r) => !r.isSettled).length;

  const handleRestoreData = (backup: {
    profile?: StoreProfile;
    entries: Record<string, DailyEntry>;
    products: Product[];
    khata: KhataRecord[];
    transactions?: SaleTransaction[];
  }) => {
    if (backup.profile) {
      saveStoreProfile(backup.profile);
      setStoreProfile(backup.profile);
    }
    setEntries(backup.entries);
    setProducts(backup.products);
    setKhataRecords(backup.khata);
    if (backup.transactions) {
      setTransactions(backup.transactions);
    }
    showToast('Database restored successfully from backup!');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-body selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onResetData={handleResetData}
        onPrint={() => window.print()}
        lowStockCount={lowStockCount}
        pendingKhataCount={pendingKhataCount}
        profile={storeProfile}
        onOpenStoreSettings={() => setIsStoreSettingsOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onRestoreData={handleRestoreData}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col items-center justify-start pb-20 md:pb-12">
        {/* Device Wrapper: Switch between Desktop Full View and Mobile Phone Frame */}
        {isMobilePreview ? (
          /* Realistic Smartphone Showcase Frame */
          <div className="my-6 w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 mr-2 border border-slate-700"></div>
              <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Screen Inner */}
            <div className="bg-[#F8FAFC] rounded-[34px] overflow-hidden min-h-[780px] max-h-[820px] overflow-y-auto relative flex flex-col">
              <div className="flex-1 pb-20">
                {activeTab === 'counter' && (
                  <CounterView
                    products={products}
                    profile={storeProfile}
                    transactions={transactions}
                    language={language}
                    onCompleteSale={handleCompleteCounterSale}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onVoidTransaction={handleVoidTransaction}
                  />
                )}
                {activeTab === 'stock' && (
                  <StockLedgerView
                    products={products}
                    profile={storeProfile}
                    onUpdateStock={handleUpdateStock}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}
                {activeTab === 'khata' && (
                  <KhataView
                    khataRecords={khataRecords}
                    profile={storeProfile}
                    onAddKhata={(rec) => setKhataRecords(addKhataRecord(rec))}
                    onSettleKhata={handleSettleKhata}
                  />
                )}
                {activeTab === 'entry' && (
                  <DailyEntryView
                    currentEntry={currentEditingEntry}
                    onSave={handleSaveEntry}
                    onGoToCalendar={() => setActiveTab('calendar')}
                  />
                )}
                {activeTab === 'calendar' && (
                  <CalendarView
                    entries={entries}
                    stats={stats}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onEditEntry={(d) => {
                      setSelectedDate(d);
                      setActiveTab('entry');
                    }}
                    onDeleteEntry={handleDeleteEntry}
                    onShareWhatsApp={(entry) => setReceiptEntry(entry)}
                    onDownloadPDF={() => window.print()}
                  />
                )}
                {activeTab === 'analytics' && (
                  <AnalyticsView stats={stats} entries={entries} />
                )}
                {activeTab === 'architecture' && (
                  <FlowchartView language={language} />
                )}
              </div>

              {/* Mobile Phone Mock Bottom Nav */}
              <div className="absolute bottom-0 left-0 right-0">
                <BottomNav
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  lowStockCount={lowStockCount}
                  language={language}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Full Screen Responsive Layout (Supports desktop command center & native mobile) */
          <div className="w-full">
            {activeTab === 'counter' && (
              <CounterView
                products={products}
                profile={storeProfile}
                transactions={transactions}
                language={language}
                onCompleteSale={handleCompleteCounterSale}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onVoidTransaction={handleVoidTransaction}
              />
            )}
            {activeTab === 'stock' && (
              <StockLedgerView
                products={products}
                profile={storeProfile}
                onUpdateStock={handleUpdateStock}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
            {activeTab === 'khata' && (
              <KhataView
                khataRecords={khataRecords}
                profile={storeProfile}
                onAddKhata={(rec) => setKhataRecords(addKhataRecord(rec))}
                onSettleKhata={handleSettleKhata}
              />
            )}
            {activeTab === 'entry' && (
              <DailyEntryView
                currentEntry={currentEditingEntry}
                onSave={handleSaveEntry}
                onGoToCalendar={() => setActiveTab('calendar')}
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarView
                entries={entries}
                stats={stats}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onEditEntry={(d) => {
                  setSelectedDate(d);
                  setActiveTab('entry');
                }}
                onDeleteEntry={handleDeleteEntry}
                onShareWhatsApp={(entry) => setReceiptEntry(entry)}
                onDownloadPDF={() => window.print()}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsView stats={stats} entries={entries} />
            )}
            {activeTab === 'architecture' && (
              <FlowchartView language={language} />
            )}
          </div>
        )}
      </main>

      {/* Persistent Native Mobile Bottom Navigation (Shown when screen < 1024px and not in mock preview) */}
      {!isMobilePreview && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
          language={language}
        />
      )}

      {/* Receipt & Bill Modal */}
      <ReceiptModal
        isOpen={Boolean(receiptEntry)}
        onClose={() => setReceiptEntry(null)}
        entry={receiptEntry}
        profile={storeProfile}
      />

      {/* Store Settings & Profile Drawer */}
      <StoreSettingsModal
        isOpen={isStoreSettingsOpen}
        onClose={() => setIsStoreSettingsOpen(false)}
        profile={storeProfile}
        language={language}
        onSaveProfile={handleSaveStoreProfile}
        onApplyPresetCatalog={handleApplyPresetCatalog}
      />

      {/* Supabase Multi-Device Cloud Sync & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        profile={storeProfile}
        entries={entries}
        products={products}
        khata={khataRecords}
        onCloudSyncSuccess={handleCloudSyncSuccess}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold border border-slate-700 animate-slide-up flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
