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
import { ActiveTab, DailyEntry, Product, KhataRecord, CartItem } from './types';
import {
  loadEntries,
  saveEntry,
  deleteEntry,
  loadProducts,
  saveProduct,
  updateStockQuantity,
  decrementStockOnSale,
  loadKhata,
  addKhataRecord,
  settleKhataRecord,
  resetToSeedData,
  calculateMonthlyStats,
} from './utils/storage';

export const App: React.FC = () => {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [khataRecords, setKhataRecords] = useState<KhataRecord[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('counter');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-26');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [receiptEntry, setReceiptEntry] = useState<DailyEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setEntries(loadEntries());
    setProducts(loadProducts());
    setKhataRecords(loadKhata());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
    if (window.confirm('Reset all records back to demo dataset (September ledger, stock, khata)?')) {
      const reset = resetToSeedData();
      setEntries(reset.entries);
      setProducts(reset.products);
      setKhataRecords(reset.khata);
      setSelectedDate('2026-09-26');
      showToast('Reset to demo dataset successfully');
    }
  };

  // 3-Tap Counter Sale Completion: decrements stock & updates daily sales
  const handleCompleteCounterSale = (
    total: number,
    mode: 'CASH' | 'UPI' | 'KHATA',
    cart: CartItem[],
    customerName?: string,
    customerPhone?: string
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
      showToast(`Sale recorded & added to ${customerName || 'Customer'} Khata!`);
    } else {
      showToast(`Recorded ₹${total} sale via ${mode}!`);
    }
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
    entries: Record<string, DailyEntry>;
    products: Product[];
    khata: KhataRecord[];
  }) => {
    setEntries(backup.entries);
    setProducts(backup.products);
    setKhataRecords(backup.khata);
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
        onResetData={handleResetData}
        onPrint={() => window.print()}
        lowStockCount={lowStockCount}
        pendingKhataCount={pendingKhataCount}
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
                    onCompleteSale={handleCompleteCounterSale}
                  />
                )}
                {activeTab === 'stock' && (
                  <StockLedgerView
                    products={products}
                    onUpdateStock={handleUpdateStock}
                    onAddProduct={handleAddProduct}
                  />
                )}
                {activeTab === 'khata' && (
                  <KhataView
                    khataRecords={khataRecords}
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
              </div>

              {/* Mobile Phone Mock Bottom Nav */}
              <div className="absolute bottom-0 left-0 right-0">
                <BottomNav
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  lowStockCount={lowStockCount}
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
                onCompleteSale={handleCompleteCounterSale}
              />
            )}
            {activeTab === 'stock' && (
              <StockLedgerView
                products={products}
                onUpdateStock={handleUpdateStock}
                onAddProduct={handleAddProduct}
              />
            )}
            {activeTab === 'khata' && (
              <KhataView
                khataRecords={khataRecords}
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
          </div>
        )}
      </main>

      {/* Persistent Native Mobile Bottom Navigation (Shown when screen < 1024px and not in mock preview) */}
      {!isMobilePreview && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
        />
      )}

      {/* Receipt & Bill Modal */}
      <ReceiptModal
        isOpen={Boolean(receiptEntry)}
        onClose={() => setReceiptEntry(null)}
        entry={receiptEntry}
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
