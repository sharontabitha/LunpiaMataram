import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  Utensils,
  Layout,
  FileText,
  Phone,
  ShoppingBag,
  LogOut,
  Database,
  Copy,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { MenuItem, SiteSettings, OrderRecord } from '../types';
import { formatRupiah } from '../utils/formatters';
import {
  saveMenuItem,
  deleteMenuItem,
  updateSiteSettings,
  fetchOrders,
  updateOrderStatus,
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  isSupabaseReady
} from '../lib/supabase';
import { ImageUploader } from './ImageUploader';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  siteSettings: SiteSettings;
  onRefreshData: () => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  siteSettings,
  onRefreshData,
  onShowToast
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'menu' | 'hero' | 'about' | 'footer' | 'orders' | 'supabase'>('menu');

  // Edit Forms State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [dbConnected, setDbConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrders();
      // Refresh koneksi status setiap kali admin modal dibuka
      const cfg = getStoredSupabaseConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseAnonKey(cfg.anonKey);
      setDbConnected(isSupabaseReady());
    }
  }, [isOpen, isAuthenticated]);

  const loadOrders = async () => {
    const list = await fetchOrders();
    setOrders(list);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      onShowToast('Login Admin Berhasil!');
    } else {
      setAuthError('Username atau password tidak dikenali.');
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const result = await updateSiteSettings(settingsForm);
    setIsSaving(false);
    if (!result.ok) {
      onShowToast(`❌ Gagal menyimpan: ${result.error}`);
      return;
    }
    await onRefreshData();
    onShowToast('✅ Pengaturan berhasil disimpan & tersinkron ke semua perangkat!');
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    const result = await saveMenuItem(editingItem);
    setIsSaving(false);
    if (!result.ok) {
      onShowToast(`❌ Gagal menyimpan menu: ${result.error}`);
      return;
    }
    await onRefreshData();
    setEditingItem(null);
    setIsAddingItem(false);
    onShowToast('✅ Menu berhasil disimpan & tersinkron!');
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
      const result = await deleteMenuItem(id);
      if (!result.ok) {
        onShowToast(`❌ Gagal hapus: ${result.error}`);
        return;
      }
      await onRefreshData();
      onShowToast(`🗑️ Menu "${name}" berhasil dihapus.`);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updated = { ...item, available: !item.available };
    const result = await saveMenuItem(updated);
    if (!result.ok) {
      onShowToast(`❌ Gagal ubah stok: ${result.error}`);
      return;
    }
    await onRefreshData();
    onShowToast(`Status stok "${item.name}" diubah → ${updated.available ? 'Tersedia' : 'Stok Habis'}`);
  };

  const handleSaveSupabaseConfig = async () => {
    saveStoredSupabaseConfig({ url: supabaseUrl.trim(), anonKey: supabaseAnonKey.trim() });
    onShowToast('Konfigurasi disimpan. Menghubungkan ulang...');
    await onRefreshData();
    setDbConnected(isSupabaseReady());
    if (isSupabaseReady()) {
      onShowToast('✅ Supabase berhasil terhubung! Semua perangkat kini sinkron.');
    } else {
      onShowToast('❌ Koneksi gagal. Periksa URL dan Anon Key Anda.');
    }
  };

  const copySqlSchema = () => {
    const sql = `-- Jalankan di SQL Editor Supabase:
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current', brand_name TEXT, logo_url TEXT,
  hero_badge TEXT, hero_title_html TEXT, hero_subtitle TEXT, hero_opening_hours TEXT,
  hero_image TEXT, highlights JSONB, about_title TEXT, about_subtitle TEXT,
  about_story TEXT, about_quote TEXT, about_image1 TEXT, about_image2 TEXT,
  store_phone TEXT, store_whatsapp TEXT, gofood_url TEXT, opening_hours TEXT,
  address TEXT, gmaps_url TEXT, gmaps_embed_url TEXT, footer_note TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT DEFAULT 'Satuan',
  badge TEXT, description TEXT, price NUMERIC DEFAULT 0, image TEXT,
  available BOOLEAN DEFAULT TRUE, allowed_options JSONB, order_index INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, customer_name TEXT, customer_phone TEXT,
  items JSONB, total_price NUMERIC, fulfillment_type TEXT,
  address_or_notes TEXT, status TEXT DEFAULT 'Menunggu',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON site_settings FOR ALL USING (true);
CREATE POLICY "public_all" ON menu_items FOR ALL USING (true);
CREATE POLICY "public_all" ON orders FOR ALL USING (true);

-- Aktifkan Realtime (jalankan di Dashboard > Database > Replication)
-- Tambahkan tabel site_settings dan menu_items ke Publication "supabase_realtime"
`;
    navigator.clipboard.writeText(sql);
    onShowToast('Skrip SQL disalin ke clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header Bar */}
        <div className="bg-[#143826] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#dfa62c] text-[#143826] flex items-center justify-center font-bold font-serif text-sm">
              LM
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Portal Admin · Lunpia Mataram
              </h3>
              <p className="text-[11px] text-gray-300">
                Panel Manajemen Konten & Katalog Tersembunyi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs bg-red-800/60 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F0] border border-gray-200 flex items-center justify-center mx-auto text-[#143826]">
                <Utensils className="w-8 h-8 text-[#dfa62c]" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#143826]">Login Admin</h2>
              <p className="text-xs text-gray-500">
                Halaman ini khusus pengelola Lunpia Mataram Pandanaran.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#143826] hover:bg-[#0e2b1d] text-white font-semibold text-sm transition-all shadow-md"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#FAF7F0] border-r border-gray-200 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Utensils className="w-4 h-4 text-[#dfa62c]" />
                <span>Kelola Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layout className="w-4 h-4 text-[#dfa62c]" />
                <span>Header & Hero</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4 text-[#dfa62c]" />
                <span>Tentang Kami</span>
              </button>

              <button
                onClick={() => setActiveTab('footer')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'footer'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Phone className="w-4 h-4 text-[#dfa62c]" />
                <span>Footer & Kontak</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  loadOrders();
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#dfa62c]" />
                <span>Log Pesanan ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'supabase'
                    ? 'bg-[#143826] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Database className="w-4 h-4 text-[#dfa62c]" />
                <span>Supabase Backend</span>
                {dbConnected
                  ? <span className="w-2 h-2 rounded-full bg-emerald-400 ml-auto flex-shrink-0"></span>
                  : <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse ml-auto flex-shrink-0"></span>}
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              
              {/* TAB 1: MENU CRUD */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-xl text-[#143826]">
                        Kelola Menu Lunpia & Paket
                      </h4>
                      <p className="text-xs text-gray-500">
                        Tambah, edit harga, foto, deskripsi, dan ubah status stok menu.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingItem({
                          id: 'item-' + Date.now(),
                          name: '',
                          category: 'Satuan',
                          badge: 'SATUAN',
                          description: '',
                          price: 18000,
                          image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
                          available: true,
                          allowedOptions: ['Basah', 'Goreng'],
                          orderIndex: menuItems.length + 1
                        });
                        setIsAddingItem(true);
                      }}
                      className="px-4 py-2 bg-[#143826] hover:bg-[#0e2b1d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-[#dfa62c]" />
                      <span>Tambah Menu Baru</span>
                    </button>
                  </div>

                  {/* Menu Table / Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex gap-3 items-center justify-between bg-white shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {item.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                item.available
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                              onClick={() => handleToggleAvailability(item)}
                              title="Klik untuk ubah status ketersediaan"
                            >
                              {item.available ? 'Tersedia' : 'Stok Habis'}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-sm text-[#143826] mt-1 truncate">
                            {item.name}
                          </h5>
                          <p className="text-xs font-bold text-[#b83b26]">
                            {formatRupiah(item.price)}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            Penyajian: {item.allowedOptions.join(', ')}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsAddingItem(false);
                            }}
                            className="p-2 text-gray-600 hover:text-[#143826] hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit/Add Modal */}
                  {editingItem && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="font-serif font-bold text-lg text-[#143826]">
                            {isAddingItem ? 'Tambah Menu Baru' : 'Edit Menu'}
                          </h4>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        <form onSubmit={handleSaveMenuItem} className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">
                              Nama Menu
                            </label>
                            <input
                              type="text"
                              required
                              value={editingItem.name}
                              onChange={(e) =>
                                setEditingItem({ ...editingItem, name: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">
                                Kategori
                              </label>
                              <input
                                type="text"
                                required
                                value={editingItem.category}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    category: e.target.value,
                                    badge: e.target.value.toUpperCase()
                                  })
                                }
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                                placeholder="Satuan / Paket Besek"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">
                                Harga (Rp)
                              </label>
                              <input
                                type="number"
                                required
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    price: Number(e.target.value)
                                  })
                                }
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">
                              Deskripsi
                            </label>
                            <textarea
                              rows={2}
                              value={editingItem.description}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  description: e.target.value
                                })
                              }
                              className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                          </div>

                          <ImageUploader
                            label="Foto Produk"
                            currentUrl={editingItem.image}
                            onUrlChange={(url) => setEditingItem({ ...editingItem, image: url })}
                            folderPath="menu"
                            required
                          />

                          <div className="grid grid-cols-2 gap-3 items-center">
                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">
                                Opsi Penyajian (Pisahkan koma)
                              </label>
                              <input
                                type="text"
                                value={editingItem.allowedOptions.join(', ')}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    allowedOptions: e.target.value
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                  })
                                }
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                                placeholder="Basah, Goreng"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-gray-700 block mb-1">
                                Status Stok
                              </label>
                              <select
                                value={editingItem.available ? '1' : '0'}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    available: e.target.value === '1'
                                  })
                                }
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                              >
                                <option value="1">Tersedia</option>
                                <option value="0">Stok Habis</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-3">
                            <button
                              type="button"
                              onClick={() => setEditingItem(null)}
                              className="px-4 py-2 border rounded-xl text-xs font-medium text-gray-600"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-[#143826] text-white rounded-xl text-xs font-semibold shadow"
                            >
                              Simpan Menu
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HERO & HEADER */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#143826]">
                      Pengaturan Header & Hero Banner
                    </h4>
                    <p className="text-xs text-gray-500">
                      Sesuaikan tulisan tagline, judul utama, foto hero dan jam operasional di banner utama.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Nama Usaha / Brand
                      </label>
                      <input
                        type="text"
                        value={settingsForm.brandName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Badge Tagline Atas
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroBadge}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroBadge: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Judul Utama (HTML diizinkan)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.heroTitleHtml}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            heroTitleHtml: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Deskripsi / Subtitle Hero
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroSubtitle}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            heroSubtitle: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Jam Buka di Banner
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroOpeningHours}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              heroOpeningHours: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>

                      <ImageUploader
                        label="Foto Utama Hero"
                        currentUrl={settingsForm.heroImage}
                        onUrlChange={(url) => setSettingsForm({ ...settingsForm, heroImage: url })}
                        folderPath="hero"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2.5 bg-[#143826] hover:bg-[#0e2b1d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md"
                      >
                        <Save className="w-4 h-4 text-[#dfa62c]" />
                        <span>Simpan Perubahan Header & Hero</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TENTANG KAMI */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#143826]">
                      Pengaturan Halaman Tentang Kami
                    </h4>
                    <p className="text-xs text-gray-500">
                      Ubah cerita sejarah, filosofi resep warisan, quote, dan dokumentasi foto.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Judul Utama Tentang Kami
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutTitle}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, aboutTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Sub-judul / Tagline
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutSubtitle}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            aboutSubtitle: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Cerita & Narasi Lengkap
                      </label>
                      <textarea
                        rows={7}
                        value={settingsForm.aboutStory}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, aboutStory: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Kutipan Filosofi (Quote)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutQuote}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, aboutQuote: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <ImageUploader
                        label="Foto Dokumentasi 1"
                        currentUrl={settingsForm.aboutImage1}
                        onUrlChange={(url) => setSettingsForm({ ...settingsForm, aboutImage1: url })}
                        folderPath="about"
                      />
                      <ImageUploader
                        label="Foto Dokumentasi 2"
                        currentUrl={settingsForm.aboutImage2}
                        onUrlChange={(url) => setSettingsForm({ ...settingsForm, aboutImage2: url })}
                        folderPath="about"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2.5 bg-[#143826] hover:bg-[#0e2b1d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md"
                      >
                        <Save className="w-4 h-4 text-[#dfa62c]" />
                        <span>Simpan Perubahan Tentang Kami</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FOOTER, KONTAK & LOKASI */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#143826]">
                      Pengaturan Footer, Kontak & Lokasi
                    </h4>
                    <p className="text-xs text-gray-500">
                      Atur nomor kontak toko, WhatsApp tujuan checkout, link GoFood, jam buka, dan peta Google Maps.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Telepon Kontak Toko
                        </label>
                        <input
                          type="text"
                          value={settingsForm.storePhone}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              storePhone: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          placeholder="(024) 8451001"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          WhatsApp Pesanan (Target Checkout)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.storeWhatsapp}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              storeWhatsapp: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          placeholder="081901661459"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Jam Operasional
                        </label>
                        <input
                          type="text"
                          value={settingsForm.openingHours}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              openingHours: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          placeholder="08.00 - 21.00 WIB"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Tautan GoFood / Gojek
                        </label>
                        <input
                          type="url"
                          value={settingsForm.gofoodUrl}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              gofoodUrl: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Alamat Lengkap Toko
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.address}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, address: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Tautan Google Maps URL
                        </label>
                        <input
                          type="url"
                          value={settingsForm.gmapsUrl}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, gmapsUrl: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Google Maps Embed Iframe URL
                        </label>
                        <input
                          type="url"
                          value={settingsForm.gmapsEmbedUrl}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              gmapsEmbedUrl: e.target.value
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Catatan Footer
                      </label>
                      <input
                        type="text"
                        value={settingsForm.footerNote}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            footerNote: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2.5 bg-[#143826] hover:bg-[#0e2b1d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md"
                      >
                        <Save className="w-4 h-4 text-[#dfa62c]" />
                        <span>Simpan Perubahan Kontak & Footer</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ORDERS LOG */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-xl text-[#143826]">
                        Riwayat Pesanan Pengguna
                      </h4>
                      <p className="text-xs text-gray-500">
                        Daftar pesanan masuk yang dibuat pengguna dari keranjang.
                      </p>
                    </div>

                    <button
                      onClick={loadOrders}
                      className="px-3.5 py-1.5 border rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Segarkan
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 border border-dashed rounded-2xl">
                      Belum ada pesanan yang tercatat. Lakukan pemesanan dari keranjang untuk mencoba.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 rounded-2xl border border-gray-200 bg-[#FAF7F0]/40 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                            <div>
                              <span className="font-mono font-bold text-xs text-[#143826]">
                                #{order.id}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(order.createdAt).toLocaleString('id-ID')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#b83b26]">
                                {formatRupiah(order.totalPrice)}
                              </span>
                              <select
                                value={order.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as OrderRecord['status'];
                                  await updateOrderStatus(order.id, newStatus);
                                  await loadOrders();
                                  onShowToast(`Status #${order.id} diubah ke ${newStatus}`);
                                }}
                                className="text-xs border rounded-lg px-2 py-1 bg-white font-semibold text-gray-700"
                              >
                                <option value="Menunggu">Menunggu</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                              </select>
                            </div>
                          </div>

                          <div className="text-xs text-gray-700 space-y-1">
                            <p>
                              <strong className="text-gray-900">Pemesan:</strong> {order.customerName} ({order.customerPhone})
                            </p>
                            <p>
                              <strong className="text-gray-900">Metode:</strong> {order.fulfillmentType}
                            </p>
                            {order.addressOrNotes && (
                              <p>
                                <strong className="text-gray-900">Catatan/Alamat:</strong> {order.addressOrNotes}
                              </p>
                            )}
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-xs space-y-1">
                            <span className="font-semibold text-gray-600 block text-[11px]">Item Pesanan:</span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-gray-800">
                                <span>• {it.name} ({it.variant}) x{it.quantity}</span>
                                <span className="font-medium">{formatRupiah(it.price * it.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SUPABASE BACKEND */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-bold text-xl text-[#143826]">Integrasi Backend Supabase</h4>
                    <p className="text-xs text-gray-500">Hubungkan website langsung ke database cloud Supabase untuk sinkronisasi realtime multi-perangkat.</p>
                  </div>

                  {/* Status indicator */}
                  <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 ${dbConnected ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div>
                      <span className="text-xs text-gray-500 block">Status Koneksi Database:</span>
                      <span className={`font-semibold text-sm flex items-center gap-1.5 mt-0.5 ${dbConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dbConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {dbConnected ? 'Tersambung ke Supabase ✓' : 'Belum terhubung — data hanya lokal di perangkat ini'}
                      </span>
                    </div>
                    <button
                      onClick={copySqlSchema}
                      className="px-3.5 py-2 bg-[#dfa62c] text-[#0e2b1d] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#c99527] flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Salin Schema SQL</span>
                    </button>
                  </div>

                  {/* Credentials form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Supabase Project URL</label>
                      <input
                        type="url"
                        placeholder="https://xyzcompany.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Supabase Anon / Public Key <span className="font-normal text-gray-400">(format eyJ... atau sb_publishable_...)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="eyJhbGciOiJIUzI1Ni... atau sb_publishable_..."
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveSupabaseConfig}
                        className="px-6 py-2.5 bg-[#143826] hover:bg-[#0e2b1d] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md"
                      >
                        <Save className="w-4 h-4 text-[#dfa62c]" />
                        <span>Simpan &amp; Hubungkan Supabase</span>
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
                      <p className="font-bold text-gray-800">Petunjuk Menyiapkan Supabase:</p>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">supabase.com</a> dan buat project baru.</li>
                        <li>Masuk ke menu <strong>SQL Editor</strong>, klik <strong>New Query</strong>.</li>
                        <li>Klik tombol <strong>"Salin Schema SQL"</strong> di atas lalu tempel dan tekan Run di Supabase.</li>
                        <li>Aktifkan Realtime: <strong>Dashboard → Database → Replication</strong> → tambahkan tabel <code className="bg-gray-200 px-1 rounded">site_settings</code> dan <code className="bg-gray-200 px-1 rounded">menu_items</code>.</li>
                        <li>Buka <strong>Project Settings → API</strong>, salin <strong>Project URL</strong> dan <strong>anon/public API key</strong> ke form di atas, lalu klik Simpan.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
