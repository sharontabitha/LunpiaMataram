import { MenuItem, SiteSettings } from '../types';

export const initialSiteSettings: SiteSettings = {
  brandName: 'Lunpia Mataram Pandanaran',
  logoUrl: '',
  heroBadge: 'SEJAK 1988 · RESEP WARISAN SEMARANG',
  heroTitleHtml: 'Cita rasa Semarang, <span class="italic font-serif text-[#dfa62c]">hangat di setiap gigitan.</span>',
  heroSubtitle: 'Lunpia autentik dengan rebung pilihan tanpa bau pesing, telur, dan udang segar. Diracik setiap hari dan disajikan hangat untuk Anda.',
  heroOpeningHours: 'Buka setiap hari, 08.00–21.00',
  heroImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
  
  highlights: [
    {
      number: '01',
      title: 'Resep Warisan',
      desc: 'Racikan autentik legendaris yang dijaga mutunya lintas generasi sejak 1988.'
    },
    {
      number: '02',
      title: 'Dibuat Setiap Hari',
      desc: 'Selalu segar dari wajan, hangat, harum, dan siap dinikmati kapan saja.'
    },
    {
      number: '03',
      title: 'Oleh-oleh Semarang',
      desc: 'Dikemas rapi dalam besek bambu tradisional khas untuk perjalanan & buah tangan.'
    }
  ],

  aboutTitle: 'Cerita di Balik Kelezatan Lunpia Mataram',
  aboutSubtitle: 'Tradisi Kuliner Semarang yang Melegenda',
  aboutStory: `Lunpia Mataram Pandanaran berawal dari dedikasi melestarikan kekayaan kuliner khas kota Semarang. Kami menggunakan rebung muda pilihan yang diproses secara teliti dengan teknik perendaman dan perebusan khusus, sehingga menghasilkan tekstur renyah dan gurih alami tanpa aroma tajam (tidak pesing).

Dipadukan dengan udang segar pilihan, telur ayam berkualitas, serta racikan rempah warisan leluhur. Disajikan lengkap bersama saus cokelat manis gurih yang kental, acar mentimun segar, cabai rawit hijau, dan daun bawang segar.

Setiap gulungan Lunpia Mataram dikerjakan dengan cinta dan ketelitian tinggi agar Anda mendapatkan kenikmatan kuliner Semarang yang sesungguhnya, baik dinikmati langsung selagi hangat maupun dijadikan oleh-oleh berharga untuk keluarga tercinta.`,
  aboutQuote: 'Kuliner bukan hanya tentang rasa, melainkan kenangan hangat keluarga dan warisan yang terus hidup.',
  aboutImage1: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  aboutImage2: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',

  storePhone: '(024) 8451001',
  storeWhatsapp: '081901661459',
  gofoodUrl: 'https://gofood.co.id/jakarta/restaurant/37081343-6ea5-4e23-bcc1-09c41eaaac86?as=gmaps',
  openingHours: '08.00 - 21.00 WIB',
  address: 'Jl. Pandanaran No.29A, Randusari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50244',
  gmapsUrl: 'https://maps.app.goo.gl/jZQnXTnf7QqiUVQR9',
  gmapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2185672804533!2d110.40871267499709!3d-6.983508993017441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4eb905ef03%3A0x7d6a7ef642a4fb8f!2sJl.%20Pandanaran%20No.29A%2C%20Randusari%2C%20Kec.%20Semarang%20Sel.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050244!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  footerNote: 'Dibuat hangat dengan resep dan cerita dari Semarang'
};

export const initialMenuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Lunpia Original',
    category: 'Satuan',
    badge: 'SATUAN',
    description: 'Rebung muda gurih, udang segar, dan racikan bumbu warisan khas Semarang.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    available: true,
    allowedOptions: ['Basah', 'Goreng'],
    orderIndex: 1
  },
  {
    id: 'item-2',
    name: 'Lunpia Spesial',
    category: 'Satuan',
    badge: 'SATUAN',
    description: 'Isian lebih melimpah dengan ekstra telur gurih dan udang pilihan berdaging tebal.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    available: true,
    allowedOptions: ['Basah', 'Goreng'],
    orderIndex: 2
  },
  {
    id: 'item-3',
    name: 'Besek Keluarga',
    category: 'Paket Besek',
    badge: 'PAKET BESEK',
    description: 'Isi 5 lunpia, lengkap dengan saus cokelat manis kental, acar, cabai rawit, dan daun bawang.',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
    available: true,
    allowedOptions: ['Basah', 'Goreng', 'Campur (Basah & Goreng)'],
    orderIndex: 3
  },
  {
    id: 'item-4',
    name: 'Besek Oleh-oleh',
    category: 'Paket Besek',
    badge: 'PAKET BESEK',
    description: 'Isi 10 lunpia dalam kemasan besek bambu tradisional yang higienis dan rapi, cocok untuk buah tangan keluarga.',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    available: false, // matches the "Stok habis" / "Belum Tersedia" in reference!
    allowedOptions: ['Basah', 'Goreng', 'Campur (Basah & Goreng)'],
    orderIndex: 4
  },
  {
    id: 'item-5',
    name: 'Besek Jumbo Sultan',
    category: 'Paket Besek',
    badge: 'PAKET BESEK',
    description: 'Isi 15 lunpia spesial dalam besek eksklusif berlapis daun pisang segar, lengkap dengan double saus & bumbu pendamping.',
    price: 245000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    available: true,
    allowedOptions: ['Basah', 'Goreng', 'Campur (Basah & Goreng)'],
    orderIndex: 5
  }
];
