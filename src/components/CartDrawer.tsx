import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, SiteSettings, OrderRecord } from '../types';
import { formatRupiah, formatPhoneNumber } from '../utils/formatters';
import { saveOrder } from '../lib/supabase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: SiteSettings;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onShowToast
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'Ambil di Toko' | 'Delivery (GoSend / Grab / Kurir)'>('Ambil di Toko');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate WhatsApp message template
  const generateWhatsAppMessage = () => {
    const lines = [
      `Halo Lunpia Mataram Pandanaran,`,
      `Saya *${customerName || '(Nama Pemesan)'}* ingin memesan:`,
      ``,
      `📋 *Rincian Pesanan:*`
    ];

    items.forEach((item, index) => {
      lines.push(`${index + 1}. *${item.name}* (${item.variant})`);
      lines.push(`   ${item.quantity}x @ ${formatRupiah(item.price)} = *${formatRupiah(item.price * item.quantity)}*`);
    });

    lines.push(``);
    lines.push(`💰 *Total Harga:* *${formatRupiah(totalPrice)}*`);
    lines.push(`📍 *Metode:* ${fulfillmentType}`);
    if (customerPhone) {
      lines.push(`📞 *No. Kontak:* ${customerPhone}`);
    }
    if (notes) {
      lines.push(`📝 *Catatan Tambahan:* ${notes}`);
    }
    lines.push(``);
    lines.push(`Mohon konfirmasi ketersediaan dan rincian pembayarannya. Terima kasih! 🙏`);

    return lines.join('\n');
  };

  const handleCheckoutWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customerName.trim()) {
      alert('Silakan masukkan nama Anda terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    // Save order record to Supabase / Local database
    const newOrder: OrderRecord = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '-',
      items: [...items],
      totalPrice,
      fulfillmentType,
      addressOrNotes: notes.trim(),
      status: 'Menunggu',
      createdAt: new Date().toISOString()
    };

    try {
      await saveOrder(newOrder);
    } catch (e) {
      console.warn('Order saved locally:', e);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }

    // Target WhatsApp number: 081901661459 -> 6281901661459
    const targetWa = formatPhoneNumber(settings.storeWhatsapp || '081901661459');
    const encodedMessage = encodeURIComponent(generateWhatsAppMessage());
    const waUrl = `https://wa.me/${targetWa}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    onShowToast('Pesanan berhasil dibuat & diarahkan ke WhatsApp!');
    setIsSubmitting(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 bg-[#FAF7F0] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#143826] text-[#dfa62c] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#143826]">Keranjang Pesanan</h3>
                <p className="text-xs text-gray-500">{totalQty} item dipilih</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List / Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-base text-gray-800">Keranjang masih kosong</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Pilih varian lunpia basah atau goreng favorit Anda di katalog menu kami.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#143826] text-white text-xs font-semibold"
                >
                  Lihat Menu
                </button>
              </div>
            ) : (
              <>
                {/* List items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-gray-200 bg-[#FAF7F0]/50 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <span className="inline-block text-[11px] font-medium text-[#143826] bg-[#143826]/10 px-2 py-0.5 rounded mt-0.5">
                          {item.variant}
                        </span>
                        <p className="text-xs font-bold text-[#b83b26] mt-1">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-800 min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Form */}
                <form id="checkout-form" onSubmit={handleCheckoutWhatsApp} className="pt-4 border-t border-gray-200 space-y-3.5">
                  <h4 className="font-serif font-bold text-sm text-[#143826]">
                    Informasi Pemesan
                  </h4>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Nomor WhatsApp Anda
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Metode Pengambilan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('Ambil di Toko')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          fulfillmentType === 'Ambil di Toko'
                            ? 'bg-[#143826] text-white border-[#143826] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Ambil di Toko
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('Delivery (GoSend / Grab / Kurir)')}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                          fulfillmentType === 'Delivery (GoSend / Grab / Kurir)'
                            ? 'bg-[#143826] text-white border-[#143826] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Delivery / Kurir
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {fulfillmentType === 'Ambil di Toko'
                        ? 'Catatan Tambahan (opsional)'
                        : 'Alamat Pengiriman & Catatan'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        fulfillmentType === 'Ambil di Toko'
                          ? 'Misal: Saus manis diperbanyak, acar dipisah.'
                          : 'Tuliskan alamat lengkap pengiriman di Semarang & catatan.'
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#143826]/20 focus:border-[#143826]"
                    />
                  </div>

                  {/* Template Chat Preview */}
                  <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#dfa62c]/30 text-xs text-gray-600">
                    <p className="font-semibold text-[#143826] mb-1 flex items-center gap-1">
                      <span>Preview Format Chat WhatsApp:</span>
                    </p>
                    <p className="text-[11px] italic font-mono text-gray-500 whitespace-pre-line line-clamp-3">
                      {generateWhatsAppMessage()}
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Area: Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-gray-200 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Harga ({totalQty} item):</span>
                <span className="font-serif font-bold text-xl text-[#b83b26]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Pesan Sekarang via WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-gray-400">
                Pemesanan langsung terhubung ke WhatsApp Toko: {settings.storeWhatsapp || '081901661459'}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
