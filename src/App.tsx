import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MenuItem, SiteSettings, CartItem } from './types';
import { initialMenuItems, initialSiteSettings } from './data/initialData';
import {
  fetchMenuItems,
  fetchSiteSettings,
  isSupabaseReady,
  subscribeToChanges,
  unsubscribe
} from './lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesBar } from './components/FeaturesBar';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { Toast } from './components/Toast';

const LOCAL_STORAGE_CART_KEY = 'lunpia_mataram_cart';

export const App: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // ─── Simpan cart ke localStorage ─────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // ─── Load data dari Supabase ──────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    const settings = await fetchSiteSettings();
    setSiteSettings(settings);
  }, []);

  const loadMenu = useCallback(async () => {
    const items = await fetchMenuItems();
    setMenuItems(items);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadSettings(), loadMenu()]);
    setIsLoading(false);
    setSupabaseConnected(isSupabaseReady());
  }, [loadSettings, loadMenu]);

  // ─── Mount: load data + pasang Realtime subscription ─────────────────
  useEffect(() => {
    loadData();

    // Pasang realtime listener agar halaman user lain ikut update otomatis
    const channel = subscribeToChanges(
      () => loadMenu(),      // triggered saat ada perubahan menu_items
      () => loadSettings()   // triggered saat ada perubahan site_settings
    );
    realtimeChannelRef.current = channel;

    return () => {
      unsubscribe(realtimeChannelRef.current);
    };
  }, []);

  // ─── Pasang ulang realtime setelah config Supabase diganti admin ──────
  const handleAfterAdminSave = useCallback(async () => {
    // Reconnect realtime channel dengan credentials baru
    unsubscribe(realtimeChannelRef.current);
    await loadData();
    const channel = subscribeToChanges(() => loadMenu(), () => loadSettings());
    realtimeChannelRef.current = channel;
    setSupabaseConnected(isSupabaseReady());
  }, [loadData, loadMenu, loadSettings]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // ─── Cart actions ─────────────────────────────────────────────────────
  const handleAddToCart = (item: MenuItem, variant: string) => {
    const cartItemId = `${item.id}-${variant}`;
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === cartItemId);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prevCart,
        { id: cartItemId, menuItemId: item.id, name: item.name, price: item.price, image: item.image, variant, quantity: 1 }
      ];
    });
    showToast(`${item.name} (${variant}) ditambahkan ke pesanan!`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) { handleRemoveItem(id); return; }
    setCart((prev) => prev.map((ci) => ci.id === id ? { ...ci, quantity: newQty } : ci));
  };

  const handleRemoveItem = (id: string) => setCart((prev) => prev.filter((ci) => ci.id !== id));
  const handleClearCart = () => setCart([]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-gray-800 font-sans selection:bg-[#dfa62c] selection:text-white">
      {/* Supabase status banner — tampil kalau belum terhubung (hanya info kecil) */}
      {!isLoading && !supabaseConnected && (
        <div className="bg-amber-500 text-white text-xs text-center py-1.5 px-4 font-medium z-50 relative">
          ⚠️ Supabase belum terhubung — data hanya tampil lokal di perangkat ini. Login admin dan buka tab &ldquo;Supabase Backend&rdquo; untuk menghubungkan.
        </div>
      )}

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F0] flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#143826] text-[#dfa62c] flex items-center justify-center font-serif font-bold text-2xl animate-pulse shadow-xl">
            LM
          </div>
          <p className="text-sm text-[#143826] font-medium">Memuat data terbaru…</p>
        </div>
      )}

      <Navbar
        settings={siteSettings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        <HeroSection settings={siteSettings} />
        <FeaturesBar settings={siteSettings} />
        <MenuSection items={menuItems} onAddToCart={handleAddToCart} />
        <AboutSection settings={siteSettings} />
        <LocationSection settings={siteSettings} />
      </main>

      <Footer settings={siteSettings} onOpenAdmin={() => setIsAdminOpen(true)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        settings={siteSettings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onShowToast={showToast}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        siteSettings={siteSettings}
        onRefreshData={handleAfterAdminSave}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default App;
