import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Utensils, Lock } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#0e2b1d] text-white border-t border-[#1c4d35]">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1c4d35] text-[#dfa62c] flex items-center justify-center font-serif font-bold text-xl border border-[#dfa62c]/40">
                LM
              </div>
              <span className="font-serif font-bold text-xl text-white">
                {settings.brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              Menghadirkan kehangatan cita rasa legendaris khas Semarang dengan resep warisan turun temurun sejak 1988.
            </p>
            <div className="text-xs text-[#fae29c] font-medium pt-1">
              {settings.footerNote || 'Dibuat hangat dengan resep dan cerita dari Semarang'}
            </div>
          </div>

          {/* Kontak Toko */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#dfa62c] uppercase tracking-wider text-xs">
              Kontak Kami
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Telepon Toko</span>
                  <a href={`tel:${settings.storePhone.replace(/[^0-9]/g, '')}`} className="hover:text-white transition-colors">
                    {settings.storePhone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">WhatsApp Pesanan</span>
                  <a
                    href={`https://wa.me/62${settings.storeWhatsapp.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {settings.storeWhatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[11px]">Jam Operasional</span>
                  <span>{settings.openingHours}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Lokasi & Alamat */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#dfa62c] uppercase tracking-wider text-xs">
              Alamat Toko
            </h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-[#dfa62c] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {settings.address}
              </p>
            </div>
            <a
              href={settings.gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#dfa62c] hover:underline pt-1"
            >
              <span>Petunjuk Arah Google Maps &rarr;</span>
            </a>
          </div>

          {/* Delivery & Online Order */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#dfa62c] uppercase tracking-wider text-xs">
              Pemesanan Online
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Tersedia juga di aplikasi Gojek / GoFood untuk pengantaran cepat ke seluruh area Semarang dan sekitarnya.
            </p>
            <a
              href={settings.gofoodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#c24128] hover:bg-[#a1331d] text-white font-semibold text-xs transition-colors shadow"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Buka di GoFood</span>
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1c4d35] bg-[#091d13] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Lunpia Mataram Pandanaran Semarang. Hak cipta dilindungi.</p>
          
          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            <span className="text-gray-600">·</span>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a>
            <span className="text-gray-600">·</span>
            <a href="#lokasi" className="hover:text-white transition-colors">Lokasi</a>
            <span className="text-gray-600">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-gray-500 hover:text-[#dfa62c] transition-colors flex items-center gap-1 underline"
            >
              <Lock className="w-3 h-3" />
              <span>Kelola Website (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
