import React from 'react';
import { SiteSettings } from '../types';
import { Quote, Sparkles, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="tentang" className="py-16 sm:py-24 bg-[#F2EDE1] scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Photos Grid */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                  <img
                    src={settings.aboutImage1 || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'}
                    alt="Pembuatan Lunpia Mataram"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#143826] text-white p-4 rounded-2xl shadow-md border border-[#2c6144]">
                  <span className="font-serif font-bold text-2xl text-[#dfa62c]">35+</span>
                  <p className="text-[11px] text-gray-300 font-medium">Tahun menjaga keaslian rasa Semarang</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="bg-[#dfa62c] text-[#0e2b1d] p-4 rounded-2xl shadow-md font-serif text-sm italic font-medium leading-relaxed">
                  "Rahasia kami ada pada rebung segar yang diolah teliti tanpa aroma tajam."
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                  <img
                    src={settings.aboutImage2 || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'}
                    alt="Racikan Bumbu Lunpia"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#dfa62c]/50 text-[#143826] text-xs font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#dfa62c]" />
              <span>{settings.aboutSubtitle || 'Tradisi Kuliner Semarang yang Melegenda'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#143826] leading-tight">
              {settings.aboutTitle || 'Cerita di Balik Kelezatan Lunpia Mataram'}
            </h2>

            <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {settings.aboutStory}
            </div>

            {/* Quote Box */}
            {settings.aboutQuote && (
              <div className="relative p-5 rounded-2xl bg-white border-l-4 border-[#b83b26] shadow-sm my-6">
                <Quote className="w-8 h-8 text-[#b83b26]/20 absolute right-4 top-4" />
                <p className="font-serif italic text-gray-800 text-sm sm:text-base relative z-10">
                  "{settings.aboutQuote}"
                </p>
              </div>
            )}

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#143826]">
                <CheckCircle className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <span>Rebung Muda Renyah Bebas Bau</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#143826]">
                <CheckCircle className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <span>Udang & Telur Segar Setiap Hari</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#143826]">
                <CheckCircle className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <span>Kulit Renyah Gurih Tidak Alot</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#143826]">
                <CheckCircle className="w-4 h-4 text-[#dfa62c] flex-shrink-0" />
                <span>Kemasan Besek Bambu Alami</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
