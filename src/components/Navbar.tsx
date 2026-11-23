import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Utensils, MapPin, Info } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F0]/95 backdrop-blur-md shadow-md py-3'
          : 'bg-[#FAF7F0] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#143826] text-[#dfa62c] flex items-center justify-center font-serif font-bold text-xl shadow-sm border border-[#dfa62c]/30 group-hover:scale-105 transition-transform">
              LM
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#143826] leading-none group-hover:text-[#b83b26] transition-colors">
                {settings.brandName.split(' ')[0]}{' '}
                <span className="font-normal italic text-[#b83b26]">
                  {settings.brandName.split(' ').slice(1).join(' ') || 'Mataram'}
                </span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-500 mt-0.5">
                Pandanaran · Semarang
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a
              href="#menu"
              className="text-[#143826] hover:text-[#b83b26] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#b83b26] after:transition-all"
            >
              Menu
            </a>
            <a
              href="#tentang"
              className="text-[#143826] hover:text-[#b83b26] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#b83b26] after:transition-all"
            >
              Tentang Kami
            </a>
            <a
              href="#lokasi"
              className="text-[#143826] hover:text-[#b83b26] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#b83b26] after:transition-all"
            >
              Lokasi
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Hidden admin trigger */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="p-2 text-gray-400 hover:text-[#143826] hover:bg-gray-100 rounded-full transition-colors text-xs flex items-center gap-1"
            >
              <Lock className="w-4 h-4 opacity-70" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`flex items-center gap-2 bg-[#143826] text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:bg-[#0e2b1d] transition-all transform active:scale-95 ${
                cartBump ? 'scale-110 shadow-lg bg-[#b83b26]' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#dfa62c]" />
              <span>Pesanan</span>
              <span className="bg-[#dfa62c] text-[#0e2b1d] font-bold text-xs px-2 py-0.5 rounded-full ml-1 min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
