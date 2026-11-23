import React, { useState, useEffect } from 'react';
import { MenuItem, SiteSettings, CartItem } from './types';
import { initialMenuItems, initialSiteSettings } from './data/initialData';
import { fetchMenuItems, fetchSiteSettings } from './lib/supabase';
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

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Load data on start
  const loadData = async () => {
    try {
      const [settings, items] = await Promise.all([
        fetchSiteSettings(),
        fetchMenuItems()
      ]);
      setSiteSettings(settings);
      setMenuItems(items);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Cart actions
  const handleAddToCart = (item: MenuItem, variant: string) => {
    const cartItemId = `${item.id}-${variant}`;

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === cartItemId);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            variant,
            quantity: 1
          }
        ];
      }
    });

    showToast(`${item.name} (${variant}) ditambahkan ke pesanan!`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((ci) => (ci.id === id ? { ...ci, quantity: newQty } : ci))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-gray-800 font-sans selection:bg-[#dfa62c] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        settings={siteSettings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection settings={siteSettings} />

        {/* 2. Three Value Highlights Bar */}
        <FeaturesBar settings={siteSettings} />

        {/* 3. Catalog Menu Section */}
        <MenuSection items={menuItems} onAddToCart={handleAddToCart} />

        {/* 4. Tentang Kami (Story & Philosophy) */}
        <AboutSection settings={siteSettings} />

        {/* 5. Lokasi & Google Maps */}
        <LocationSection settings={siteSettings} />
      </main>

      {/* Footer */}
      <Footer
        settings={siteSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Cart Drawer */}
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

      {/* Hidden Admin Modal & Dashboard */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        siteSettings={siteSettings}
        onRefreshData={loadData}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default App;
