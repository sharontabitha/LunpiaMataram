export interface MenuItem {
  id: string;
  name: string;
  category: 'Satuan' | 'Paket Besek' | string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  badge?: string;
  allowedOptions: string[]; // e.g. ['Basah', 'Goreng']
  orderIndex?: number;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. `${menuItemId}-${variant}`)
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
  notes?: string;
}

export interface FeatureHighlight {
  number: string;
  title: string;
  desc: string;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  logoUrl?: string;
  heroBadge: string;
  heroTitleHtml: string; // "Cita rasa Semarang, <span class='italic font-serif'>hangat di setiap gigitan.</span>"
  heroSubtitle: string;
  heroOpeningHours: string;
  heroImage: string;
  
  // Highlight bar
  highlights: FeatureHighlight[];

  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory: string;
  aboutQuote: string;
  aboutImage1: string;
  aboutImage2: string;

  // Contact & Footer
  storePhone: string;
  storeWhatsapp: string;
  gofoodUrl: string;
  openingHours: string;
  address: string;
  gmapsUrl: string;
  gmapsEmbedUrl: string;
  footerNote: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalPrice: number;
  fulfillmentType: 'Ambil di Toko' | 'Delivery (GoSend / Grab / Kurir)';
  addressOrNotes: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
}
