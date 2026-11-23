import React, { useState } from 'react';
import { Search, Plus, Check, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, variant: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Menu');
  // Store selected variant per menu item id
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Extract categories dynamically
  const categories = ['Semua Menu', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua Menu' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectVariant = (itemId: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: option }));
  };

  const handleAdd = (item: MenuItem) => {
    if (!item.available) return;
    const defaultOption = item.allowedOptions[0] || 'Basah';
    const variant = selectedVariants[item.id] || defaultOption;
    onAddToCart(item, variant);

    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#b83b26]">
            PILIHAN KHAS KAMI
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#143826] tracking-tight">
            Mau yang mana hari ini?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            Pilih kemasan favorit, lalu tentukan lunpia basah atau goreng sebelum menambahkannya ke pesanan.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#143826] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826] transition-all placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-gray-800">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 mt-1">
              Coba kata kunci lain atau pilih kategori "Semua Menu".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const currentVariant = selectedVariants[item.id] || item.allowedOptions[0] || 'Basah';
              const isAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                    !item.available ? 'opacity-90' : ''
                  }`}
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          item.available ? 'group-hover:scale-105' : 'grayscale-[40%]'
                        }`}
                        loading="lazy"
                      />

                      {/* Top Left Badge */}
                      <span className="absolute top-3 left-3 bg-[#143826]/90 backdrop-blur-sm text-[#fae29c] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {item.badge || item.category}
                      </span>

                      {/* Out of Stock Overlay */}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-white text-[#b83b26] font-bold text-xs px-4 py-1.5 rounded-full shadow-lg border border-red-100">
                            Stok habis
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#143826] group-hover:text-[#b83b26] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
                          {item.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="font-bold text-[#b83b26] text-base">
                        {formatRupiah(item.price)}
                      </div>

                      {/* Variant Selection (Basah / Goreng) */}
                      <div className="pt-2 border-t border-gray-100 space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                          PILIH PENYAJIAN *
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {item.allowedOptions.map((opt) => {
                            const isSelected = currentVariant === opt;
                            return (
                              <button
                                key={opt}
                                disabled={!item.available}
                                onClick={() => handleSelectVariant(item.id, opt)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                                  !item.available
                                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-[#143826] text-white border-[#143826] shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="p-5 pt-0">
                    {item.available ? (
                      <button
                        onClick={() => handleAdd(item)}
                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#143826] text-white hover:bg-[#0e2b1d] active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Dimasukkan!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-[#dfa62c]" />
                            <span>+ Tambah ke Pesanan</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-gray-200 text-gray-500 cursor-not-allowed text-center"
                      >
                        Belum Tersedia
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
