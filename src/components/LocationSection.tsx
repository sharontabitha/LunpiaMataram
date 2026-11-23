import React from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types';

interface LocationSectionProps {
  settings: SiteSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  return (
    <section id="lokasi" className="py-16 sm:py-24 bg-[#FAF7F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#b83b26]">
            KUNJUNGI GERAI KAMI
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#143826] tracking-tight">
            Lokasi Lunpia Mataram
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            Berada tepat di pusat sentra oleh-oleh Pandanaran, kota Semarang. Sangat mudah dijangkau dan siap menyambut Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Information Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#143826] text-[#dfa62c] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#143826]">Alamat Lengkap Toko</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {settings.address || 'Jl. Pandanaran No.29A, Randusari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50244'}
                  </p>
                  <p className="text-xs text-[#b83b26] font-semibold mt-1">
                    (Dekat pusat oleh-oleh Pandanaran & Simpang Lima)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f0eae0] text-[#143826] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#143826]">Jam Operasional</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {settings.openingHours || '08.00 - 21.00 WIB'}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">Buka setiap hari (Senin - Minggu)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f0eae0] text-[#143826] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#143826]">Telepon & WhatsApp</h3>
                  <p className="text-sm text-gray-600 mt-0.5 font-medium">
                    Telp: {settings.storePhone || '(024) 8451001'}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    WA: {settings.storeWhatsapp || '081901661459'}
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <a
                href={settings.gmapsUrl || 'https://maps.app.goo.gl/jZQnXTnf7QqiUVQR9'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#143826] hover:bg-[#0e2b1d] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md group"
              >
                <Navigation className="w-4 h-4 text-[#dfa62c] group-hover:scale-110 transition-transform" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={settings.gofoodUrl || 'https://gofood.co.id/jakarta/restaurant/37081343-6ea5-4e23-bcc1-09c41eaaac86?as=gmaps'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#c24128] hover:bg-[#9e2f1d] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <span>Pesan Cepat via GoFood</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-gray-200 shadow-lg min-h-[380px] bg-gray-100 relative group">
            <iframe
              title="Peta Lokasi Lunpia Mataram Pandanaran"
              src={
                settings.gmapsEmbedUrl ||
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2185672804533!2d110.40871267499709!3d-6.983508993017441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4eb905ef03%3A0x7d6a7ef642a4fb8f!2sJl.%20Pandanaran%20No.29A%2C%20Randusari%2C%20Kec.%20Semarang%20Sel.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050244!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
              }
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow text-xs font-semibold text-gray-700 pointer-events-none">
              Pusat Kota Semarang
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
