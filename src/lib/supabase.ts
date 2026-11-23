import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { MenuItem, SiteSettings, OrderRecord } from '../types';
import { initialMenuItems, initialSiteSettings } from '../data/initialData';

// LocalStorage keys — hanya untuk cart & offline fallback jangka pendek
const LOCAL_STORAGE_ORDERS_KEY = 'lunpia_orders';
const LOCAL_STORAGE_SUPABASE_CONFIG_KEY = 'lunpia_supabase_config';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// ─── KONFIGURASI SUPABASE ────────────────────────────────────────────────────

// Default Supabase Project Credentials (agar HP, tablet, dan perangkat user lain langsung tersambung otomatis)
const DEFAULT_SUPABASE_URL = 'https://xasrmlojmpyuczucakqf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_svB5t9Hi4-TlWUoNbEmZOA_VPQit2MO';

function isValidAnonKey(key: string): boolean {
  if (!key || key.startsWith('http')) return false;
  return key.startsWith('eyJ') || key.startsWith('sb_') || key.length > 20;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  // Prioritas 1: environment variables (.env) yang valid
  const envUrl = normalizeUrl((import.meta.env.VITE_SUPABASE_URL || '').trim());
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey && isValidAnonKey(envKey)) {
    return { url: envUrl, anonKey: envKey };
  }

  // Prioritas 2: localStorage (jika admin mengisi manual di browser)
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SUPABASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SupabaseConfig;
      if (parsed.url && parsed.anonKey && isValidAnonKey(parsed.anonKey)) {
        return {
          url: normalizeUrl(parsed.url),
          anonKey: parsed.anonKey.trim()
        };
      } else {
        // Hapus konfigurasi lama yang rusak jika ada
        localStorage.removeItem(LOCAL_STORAGE_SUPABASE_CONFIG_KEY);
      }
    }
  } catch (e) {
    console.error('Error reading supabase config from storage', e);
  }

  // Prioritas 3: Default Project Credentials (otomatis dipakai untuk HP, tablet, dan hosting seperti Vercel/Netlify)
  return {
    url: envUrl || DEFAULT_SUPABASE_URL,
    anonKey: (envKey && isValidAnonKey(envKey)) ? envKey : DEFAULT_SUPABASE_ANON_KEY
  };
}

function normalizeUrl(url: string): string {
  // Hapus trailing /rest/v1/ dan slash berlebih
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

/** Simpan konfigurasi baru dan reset client agar dibuat ulang */
export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(
    LOCAL_STORAGE_SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: normalizeUrl(config.url), anonKey: config.anonKey.trim() })
  );
  // Reset client agar pakai credentials baru
  activeSupabaseClient = null;
}

// ─── CLIENT SINGLETON ────────────────────────────────────────────────────────

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !isValidAnonKey(config.anonKey)) {
    return null;
  }
  try {
    if (!activeSupabaseClient) {
      activeSupabaseClient = createClient(config.url, config.anonKey, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
    }
    return activeSupabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/** Cek apakah Supabase terkonfigurasi dengan benar */
export function isSupabaseReady(): boolean {
  return getSupabaseClient() !== null;
}

// ─── HELPER MAPPER ───────────────────────────────────────────────────────────

function mapRowToSettings(data: Record<string, unknown>): SiteSettings {
  return {
    brandName:        (data.brand_name as string)         || initialSiteSettings.brandName,
    logoUrl:          (data.logo_url as string)            || '',
    heroBadge:        (data.hero_badge as string)          || initialSiteSettings.heroBadge,
    heroTitleHtml:    (data.hero_title_html as string)     || initialSiteSettings.heroTitleHtml,
    heroSubtitle:     (data.hero_subtitle as string)       || initialSiteSettings.heroSubtitle,
    heroOpeningHours: (data.hero_opening_hours as string)  || initialSiteSettings.heroOpeningHours,
    heroImage:        (data.hero_image as string)          || initialSiteSettings.heroImage,
    highlights:       (data.highlights as SiteSettings['highlights']) || initialSiteSettings.highlights,
    aboutTitle:       (data.about_title as string)         || initialSiteSettings.aboutTitle,
    aboutSubtitle:    (data.about_subtitle as string)      || initialSiteSettings.aboutSubtitle,
    aboutStory:       (data.about_story as string)         || initialSiteSettings.aboutStory,
    aboutQuote:       (data.about_quote as string)         || initialSiteSettings.aboutQuote,
    aboutImage1:      (data.about_image1 as string)        || initialSiteSettings.aboutImage1,
    aboutImage2:      (data.about_image2 as string)        || initialSiteSettings.aboutImage2,
    storePhone:       (data.store_phone as string)         || initialSiteSettings.storePhone,
    storeWhatsapp:    (data.store_whatsapp as string)      || initialSiteSettings.storeWhatsapp,
    gofoodUrl:        (data.gofood_url as string)          || initialSiteSettings.gofoodUrl,
    openingHours:     (data.opening_hours as string)       || initialSiteSettings.openingHours,
    address:          (data.address as string)             || initialSiteSettings.address,
    gmapsUrl:         (data.gmaps_url as string)           || initialSiteSettings.gmapsUrl,
    gmapsEmbedUrl:    (data.gmaps_embed_url as string)     || initialSiteSettings.gmapsEmbedUrl,
    footerNote:       (data.footer_note as string)         || initialSiteSettings.footerNote
  };
}

function mapRowToMenuItem(item: Record<string, unknown>): MenuItem {
  return {
    id:             item.id as string,
    name:           item.name as string,
    category:       item.category as string,
    badge:          item.badge as string | undefined,
    description:    item.description as string,
    price:          Number(item.price),
    image:          item.image as string,
    available:      item.available !== false,
    allowedOptions: Array.isArray(item.allowed_options)
      ? item.allowed_options as string[]
      : ['Basah', 'Goreng'],
    orderIndex:     item.order_index as number | undefined
  };
}

// ─── 1. SITE SETTINGS ────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const client = getSupabaseClient();

  if (client) {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!error && data) {
      return mapRowToSettings(data);
    }

    if (error) {
      console.error('[Supabase] fetchSiteSettings error:', error.message);
    }
  }

  // Offline fallback: data default
  console.warn('[Supabase] Tidak terhubung — menggunakan data default lokal.');
  return initialSiteSettings;
}

export async function updateSiteSettings(settings: SiteSettings): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return { ok: false, error: 'Supabase belum terhubung. Masukkan URL dan Anon Key yang benar di tab Supabase Backend.' };
  }

  const payload = {
    id:                 'current',
    brand_name:         settings.brandName,
    logo_url:           settings.logoUrl || null,
    hero_badge:         settings.heroBadge,
    hero_title_html:    settings.heroTitleHtml,
    hero_subtitle:      settings.heroSubtitle,
    hero_opening_hours: settings.heroOpeningHours,
    hero_image:         settings.heroImage,
    highlights:         settings.highlights,
    about_title:        settings.aboutTitle,
    about_subtitle:     settings.aboutSubtitle,
    about_story:        settings.aboutStory,
    about_quote:        settings.aboutQuote,
    about_image1:       settings.aboutImage1,
    about_image2:       settings.aboutImage2,
    store_phone:        settings.storePhone,
    store_whatsapp:     settings.storeWhatsapp,
    gofood_url:         settings.gofoodUrl,
    opening_hours:      settings.openingHours,
    address:            settings.address,
    gmaps_url:          settings.gmapsUrl,
    gmaps_embed_url:    settings.gmapsEmbedUrl,
    footer_note:        settings.footerNote,
    updated_at:         new Date().toISOString()
  };

  const { error } = await client.from('site_settings').upsert(payload);

  if (error) {
    console.error('[Supabase] updateSiteSettings error:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

// ─── 2. MENU ITEMS ───────────────────────────────────────────────────────────

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const client = getSupabaseClient();

  if (client) {
    const { data, error } = await client
      .from('menu_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapRowToMenuItem);
    }

    if (error) {
      console.error('[Supabase] fetchMenuItems error:', error.message);
    }
  }

  // Offline fallback: data seed default
  console.warn('[Supabase] Tidak terhubung — menggunakan menu default lokal.');
  return initialMenuItems;
}

export async function saveMenuItem(item: MenuItem): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return { ok: false, error: 'Supabase belum terhubung.' };
  }

  const payload = {
    id:              item.id,
    name:            item.name,
    category:        item.category,
    badge:           item.badge || item.category.toUpperCase(),
    description:     item.description,
    price:           item.price,
    image:           item.image,
    available:       item.available,
    allowed_options: item.allowedOptions,
    order_index:     item.orderIndex || 0,
    updated_at:      new Date().toISOString()
  };

  const { error } = await client.from('menu_items').upsert(payload);

  if (error) {
    console.error('[Supabase] saveMenuItem error:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function deleteMenuItem(id: string): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return { ok: false, error: 'Supabase belum terhubung.' };
  }

  const { error } = await client.from('menu_items').delete().eq('id', id);

  if (error) {
    console.error('[Supabase] deleteMenuItem error:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

// ─── 3. ORDERS ───────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<OrderRecord[]> {
  const client = getSupabaseClient();

  if (client) {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d) => ({
        id:              d.id,
        customerName:    d.customer_name,
        customerPhone:   d.customer_phone,
        items:           d.items,
        totalPrice:      Number(d.total_price),
        fulfillmentType: d.fulfillment_type,
        addressOrNotes:  d.address_or_notes,
        status:          d.status,
        createdAt:       d.created_at
      }));
    }

    if (error) {
      console.error('[Supabase] fetchOrders error:', error.message);
    }
  }

  // Fallback: pesanan lokal (sesi ini saja)
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (local) return JSON.parse(local);
  } catch {}
  return [];
}

export async function saveOrder(order: OrderRecord): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    const { error } = await client.from('orders').insert({
      id:               order.id,
      customer_name:    order.customerName,
      customer_phone:   order.customerPhone,
      items:            order.items,
      total_price:      order.totalPrice,
      fulfillment_type: order.fulfillmentType,
      address_or_notes: order.addressOrNotes,
      status:           order.status,
      created_at:       order.createdAt
    });

    if (error) {
      console.error('[Supabase] saveOrder error:', error.message);
      // Simpan lokal sebagai fallback agar pesanan tidak hilang
      _appendOrderLocal(order);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }

  // Tanpa Supabase: simpan lokal
  _appendOrderLocal(order);
  return { ok: true };
}

function _appendOrderLocal(order: OrderRecord) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]') as OrderRecord[];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify([order, ...existing]));
  } catch {}
}

export async function updateOrderStatus(orderId: string, status: OrderRecord['status']): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return { ok: false, error: 'Supabase belum terhubung.' };
  }

  const { error } = await client.from('orders').update({ status }).eq('id', orderId);

  if (error) {
    console.error('[Supabase] updateOrderStatus error:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

// ─── 4. REALTIME SUBSCRIPTIONS ───────────────────────────────────────────────

export type RealtimeCallback = () => void;

export function subscribeToChanges(onMenuChange: RealtimeCallback, onSettingsChange: RealtimeCallback): RealtimeChannel | null {
  const client = getSupabaseClient();
  if (!client) return null;

  const channel = client
    .channel('lunpia-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'menu_items' },
      () => {
        console.log('[Realtime] menu_items changed — refreshing...');
        onMenuChange();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_settings' },
      () => {
        console.log('[Realtime] site_settings changed — refreshing...');
        onSettingsChange();
      }
    )
    .subscribe((status) => {
      console.log('[Realtime] subscription status:', status);
    });

  return channel;
}

export function unsubscribe(channel: RealtimeChannel | null) {
  if (channel) {
    const client = getSupabaseClient();
    client?.removeChannel(channel);
  }
}
