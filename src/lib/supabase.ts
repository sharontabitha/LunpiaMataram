import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MenuItem, SiteSettings, OrderRecord } from '../types';
import { initialMenuItems, initialSiteSettings } from '../data/initialData';

const LOCAL_STORAGE_SETTINGS_KEY = 'lunpia_site_settings';
const LOCAL_STORAGE_MENU_KEY = 'lunpia_menu_items';
const LOCAL_STORAGE_ORDERS_KEY = 'lunpia_orders';
const LOCAL_STORAGE_SUPABASE_CONFIG_KEY = 'lunpia_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  let envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  let envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Normalize url in case user added /rest/v1/ or trailing slash
  envUrl = envUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SUPABASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: (parsed.url || envUrl).replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''),
        anonKey: parsed.anonKey || envKey
      };
    }
  } catch (e) {
    console.error('Error reading supabase config from storage', e);
  }

  return {
    url: envUrl,
    anonKey: envKey
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(LOCAL_STORAGE_SUPABASE_CONFIG_KEY, JSON.stringify(config));
}

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  try {
    if (!activeSupabaseClient) {
      activeSupabaseClient = createClient(config.url, config.anonKey);
    }
    return activeSupabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// ----------------------------------------------------
// 1. SITE SETTINGS API
// ----------------------------------------------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .single();

      if (!error && data) {
        return {
          brandName: data.brand_name || initialSiteSettings.brandName,
          logoUrl: data.logo_url || '',
          heroBadge: data.hero_badge || initialSiteSettings.heroBadge,
          heroTitleHtml: data.hero_title_html || initialSiteSettings.heroTitleHtml,
          heroSubtitle: data.hero_subtitle || initialSiteSettings.heroSubtitle,
          heroOpeningHours: data.hero_opening_hours || initialSiteSettings.heroOpeningHours,
          heroImage: data.hero_image || initialSiteSettings.heroImage,
          highlights: data.highlights || initialSiteSettings.highlights,
          aboutTitle: data.about_title || initialSiteSettings.aboutTitle,
          aboutSubtitle: data.about_subtitle || initialSiteSettings.aboutSubtitle,
          aboutStory: data.about_story || initialSiteSettings.aboutStory,
          aboutQuote: data.about_quote || initialSiteSettings.aboutQuote,
          aboutImage1: data.about_image1 || initialSiteSettings.aboutImage1,
          aboutImage2: data.about_image2 || initialSiteSettings.aboutImage2,
          storePhone: data.store_phone || initialSiteSettings.storePhone,
          storeWhatsapp: data.store_whatsapp || initialSiteSettings.storeWhatsapp,
          gofoodUrl: data.gofood_url || initialSiteSettings.gofoodUrl,
          openingHours: data.opening_hours || initialSiteSettings.openingHours,
          address: data.address || initialSiteSettings.address,
          gmapsUrl: data.gmaps_url || initialSiteSettings.gmapsUrl,
          gmapsEmbedUrl: data.gmaps_embed_url || initialSiteSettings.gmapsEmbedUrl,
          footerNote: data.footer_note || initialSiteSettings.footerNote
        };
      }
    } catch (e) {
      console.warn('Falling back to local storage for site settings:', e);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (local) {
      return { ...initialSiteSettings, ...JSON.parse(local) };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }

  return initialSiteSettings;
}

export async function updateSiteSettings(settings: SiteSettings): Promise<boolean> {
  // Always update local storage first
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));

  const client = getSupabaseClient();
  if (client) {
    try {
      const payload = {
        id: 'current',
        brand_name: settings.brandName,
        logo_url: settings.logoUrl || null,
        hero_badge: settings.heroBadge,
        hero_title_html: settings.heroTitleHtml,
        hero_subtitle: settings.heroSubtitle,
        hero_opening_hours: settings.heroOpeningHours,
        hero_image: settings.heroImage,
        highlights: settings.highlights,
        about_title: settings.aboutTitle,
        about_subtitle: settings.aboutSubtitle,
        about_story: settings.aboutStory,
        about_quote: settings.aboutQuote,
        about_image1: settings.aboutImage1,
        about_image2: settings.aboutImage2,
        store_phone: settings.storePhone,
        store_whatsapp: settings.storeWhatsapp,
        gofood_url: settings.gofoodUrl,
        opening_hours: settings.openingHours,
        address: settings.address,
        gmaps_url: settings.gmapsUrl,
        gmaps_embed_url: settings.gmapsEmbedUrl,
        footer_note: settings.footerNote,
        updated_at: new Date().toISOString()
      };

      const { error } = await client.from('site_settings').upsert(payload);
      if (error) {
        console.error('Supabase update site_settings error:', error);
      }
    } catch (err) {
      console.error('Error syncing settings to Supabase:', err);
    }
  }

  return true;
}

// ----------------------------------------------------
// 2. MENU ITEMS API
// ----------------------------------------------------
export async function fetchMenuItems(): Promise<MenuItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('menu_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          badge: item.badge,
          description: item.description,
          price: Number(item.price),
          image: item.image,
          available: item.available !== false,
          allowedOptions: Array.isArray(item.allowed_options) ? item.allowed_options : ['Basah', 'Goreng'],
          orderIndex: item.order_index
        }));
      }
    } catch (e) {
      console.warn('Falling back to local storage for menu items:', e);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading menu items from localStorage:', e);
  }

  // Default seed data
  localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(initialMenuItems));
  return initialMenuItems;
}

export async function saveMenuItem(item: MenuItem): Promise<boolean> {
  const currentItems = await fetchMenuItems();
  const existingIdx = currentItems.findIndex((i) => i.id === item.id);
  let updatedList: MenuItem[];
  if (existingIdx >= 0) {
    updatedList = [...currentItems];
    updatedList[existingIdx] = item;
  } else {
    updatedList = [...currentItems, item];
  }

  localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(updatedList));

  const client = getSupabaseClient();
  if (client) {
    try {
      const payload = {
        id: item.id,
        name: item.name,
        category: item.category,
        badge: item.badge || item.category.toUpperCase(),
        description: item.description,
        price: item.price,
        image: item.image,
        available: item.available,
        allowed_options: item.allowedOptions,
        order_index: item.orderIndex || 0,
        updated_at: new Date().toISOString()
      };
      await client.from('menu_items').upsert(payload);
    } catch (err) {
      console.error('Supabase save menu error:', err);
    }
  }

  return true;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const currentItems = await fetchMenuItems();
  const filtered = currentItems.filter((i) => i.id !== id);
  localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(filtered));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('menu_items').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete menu error:', err);
    }
  }

  return true;
}

// ----------------------------------------------------
// 3. ORDERS API
// ----------------------------------------------------
export async function fetchOrders(): Promise<OrderRecord[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          items: d.items,
          totalPrice: Number(d.total_price),
          fulfillmentType: d.fulfillment_type,
          addressOrNotes: d.address_or_notes,
          status: d.status,
          createdAt: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Orders fetch error from Supabase:', e);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error reading orders from localStorage', e);
  }
  return [];
}

export async function saveOrder(order: OrderRecord): Promise<boolean> {
  const orders = await fetchOrders();
  const updated = [order, ...orders];
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        items: order.items,
        total_price: order.totalPrice,
        fulfillment_type: order.fulfillmentType,
        address_or_notes: order.addressOrNotes,
        status: order.status,
        created_at: order.createdAt
      });
    } catch (err) {
      console.error('Failed to log order to Supabase:', err);
    }
  }
  return true;
}

export async function updateOrderStatus(orderId: string, status: OrderRecord['status']): Promise<boolean> {
  const orders = await fetchOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('orders').update({ status }).eq('id', orderId);
    } catch (err) {
      console.error('Failed to update status in Supabase:', err);
    }
  }
  return true;
}
