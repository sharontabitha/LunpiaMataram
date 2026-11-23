import React from 'react';
import { ArrowRight, Clock, Award, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card Container - matches dark green hero banner in reference image */}
        <div className="relative rounded-3xl bg-[#143826] text-white overflow-hidden shadow-2xl border border-[#23533a]">
          {/* Subtle Batik / Noise Overlay */}
          <div className="absolute inset-0 bg-batik-subtle opacity-40 pointer-events-none"></div>

          {/* Ambient Warm Golden Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#dfa62c]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#b83b26]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c4d35]/90 border border-[#dfa62c]/40 text-[#fae29c] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#dfa62c]" />
                <span>{settings.heroBadge || 'SEJAK 1988 · RESEP WARISAN SEMARANG'}</span>
              </div>

              {/* Title with Serif typography */}
              <h1
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
                dangerouslySetInnerHTML={{
                  __html: settings.heroTitleHtml || 'Cita rasa Semarang, <span class="italic font-serif text-[#dfa62c]">hangat di setiap gigitan.</span>'
                }}
              />

              {/* Subtitle */}
              <p className="text-gray-200 text-base sm:text-lg max-w-xl font-light leading-relaxed">
                {settings.heroSubtitle}
              </p>

              {/* Call to Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 bg-[#b83b26] hover:bg-[#9e2f1d] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-[#b83b26]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base group"
                >
                  <span>Lihat Pilihan Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0e2b1d]/70 border border-[#2c6144] text-xs sm:text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-[#dfa62c]" />
                  <span>{settings.heroOpeningHours || 'Buka setiap hari, 08.00–21.00'}</span>
                </div>
              </div>

              {/* Small Guarantee tag */}
              <div className="pt-4 flex items-center gap-6 text-xs text-gray-400 border-t border-[#23533a]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#dfa62c]" />
                  <span>100% Rebung Segar Pilihan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfa62c]"></span>
                  <span>Packaging Besek Higienis</span>
                </div>
              </div>

            </div>

            {/* Right Food Photo Column */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-[#23533a]/60 group">
                <img
                  src={settings.heroImage || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80'}
                  alt="Lunpia Mataram Semarang"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#fae29c]">Lunpia Basah & Goreng</p>
                    <p className="text-[11px] text-gray-300">Lengkap saus gurih manis, acar & cabai</p>
                  </div>
                  <span className="bg-[#b83b26] text-white px-2.5 py-1 rounded-md text-[11px] font-bold">
                    Autentik
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
