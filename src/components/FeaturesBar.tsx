import React from 'react';
import { SiteSettings } from '../types';

interface FeaturesBarProps {
  settings: SiteSettings;
}

export const FeaturesBar: React.FC<FeaturesBarProps> = ({ settings }) => {
  const highlights = settings.highlights || [
    {
      number: '01',
      title: 'Resep Warisan',
      desc: 'Racikan autentik yang dijaga lintas generasi sejak 1988.'
    },
    {
      number: '02',
      title: 'Dibuat Setiap Hari',
      desc: 'Selalu segar, hangat, dan siap dinikmati kapan saja.'
    },
    {
      number: '03',
      title: 'Oleh-oleh Semarang',
      desc: 'Dikemas rapi dalam besek bambu khas untuk perjalanan dan keluarga.'
    }
  ];

  return (
    <section className="bg-[#dfa62c] text-[#0e2b1d] py-8 sm:py-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#0e2b1d]/15">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}
            >
              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#0e2b1d]/80 leading-none">
                {item.number}
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg text-[#0e2b1d] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#0e2b1d]/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
