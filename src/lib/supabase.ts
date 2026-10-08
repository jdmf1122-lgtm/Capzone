import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  CategoryInfo,
  Order,
  Review,
  DiscountCode,
  User,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_DISCOUNTS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_ORDERS
} from '../data/initialData';

// Storage keys for custom live configuration via Admin UI
const STORAGE_SUPABASE_URL = 'capzone_supabase_url';
const STORAGE_SUPABASE_KEY = 'capzone_supabase_anon_key';

/**
 * Retrieves the active Supabase URL and Anon Key.
 * Checks localStorage first (configured via Admin UI), then import.meta.env.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = '';
  let anonKey = '';

  try {
    url = localStorage.getItem(STORAGE_SUPABASE_URL) || '';
    anonKey = localStorage.getItem(STORAGE_SUPABASE_KEY) || '';
  } catch {
    // Ignore localStorage read errors in SSR/strict modes
  }

  if (!url) {
    url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  }
  if (!anonKey) {
    anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
}

/**
 * Checks if Supabase credentials are valid and configured (not dummy placeholders).
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (url.includes('your-project-id') || anonKey.includes('your-anon-key')) return false;
  return true;
}

/**
 * Save custom Supabase credentials from the Admin UI.
 */
export function setSupabaseCredentials(url: string, anonKey: string) {
  try {
    if (url) localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
    else localStorage.removeItem(STORAGE_SUPABASE_URL);

    if (anonKey) localStorage.setItem(STORAGE_SUPABASE_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_SUPABASE_KEY);
  } catch (e) {
    console.error('Failed to save Supabase credentials', e);
  }
  // Reset cached client instance
  clientInstance = null;
}

/**
 * Clear custom Supabase credentials and revert to .env
 */
export function clearSupabaseCredentials() {
  try {
    localStorage.removeItem(STORAGE_SUPABASE_URL);
    localStorage.removeItem(STORAGE_SUPABASE_KEY);
  } catch (e) {
    console.error('Failed to clear Supabase credentials', e);
  }
  clientInstance = null;
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns a Supabase client instance, or null if credentials are not configured.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    const { url, anonKey } = getSupabaseCredentials();
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  return clientInstance;
}

// ==========================================
// TEST CONNECTION & DIAGNOSTICS
// ==========================================

export interface ConnectionTestResult {
  connected: boolean;
  message: string;
  url?: string;
  tables?: {
    products: boolean | number;
    orders: boolean | number;
    categories: boolean | number;
    reviews: boolean | number;
    discounts: boolean | number;
    users: boolean | number;
  };
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const client = getSupabase();
  const { url } = getSupabaseCredentials();

  if (!client) {
    return {
      connected: false,
      message: 'Supabase URL o Anon Key ay hindi pa nai-configure.',
      url
    };
  }

  try {
    // Quick probe on products table
    const { count: productCount, error: prodErr } = await client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (prodErr) {
      if (
        prodErr.message.includes('relation "products" does not exist') ||
        prodErr.message.includes('Could not find the table') ||
        prodErr.code === '42P01' ||
        prodErr.code === 'PGRST205'
      ) {
        return {
          connected: true,
          message: 'Connected to Supabase, but you need to run the SQL Schema in the Supabase SQL Editor first to create the tables.',
          url
        };
      }
      return {
        connected: false,
        message: `Supabase error: ${prodErr.message}`,
        url
      };
    }

    // Probe remaining tables
    const [ordersRes, catsRes, reviewsRes, discRes, usersRes] = await Promise.all([
      client.from('orders').select('*', { count: 'exact', head: true }),
      client.from('categories').select('*', { count: 'exact', head: true }),
      client.from('reviews').select('*', { count: 'exact', head: true }),
      client.from('discounts').select('*', { count: 'exact', head: true }),
      client.from('users').select('*', { count: 'exact', head: true })
    ]);

    return {
      connected: true,
      message: 'Successfully connected to the Supabase database!',
      url,
      tables: {
        products: productCount ?? 0,
        orders: ordersRes.count ?? 0,
        categories: catsRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        discounts: discRes.count ?? 0,
        users: usersRes.count ?? 0
      }
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to connect: ${err?.message || 'Network / CORS error'}`,
      url
    };
  }
}

// ==========================================
// DATA MAPPER HELPERS (Postgres snake_case <-> App camelCase)
// ==========================================

export function mapDbProductToProduct(row: any): Product {
  const defaultProduct = INITIAL_PRODUCTS.find((p) => p.id === row.id);
  const resolvedImage =
    (!row.image || row.image.includes('unsplash.com') || row.image.includes('/@fs/')) && defaultProduct
      ? defaultProduct.image
      : row.image;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description || '',
    image: resolvedImage,
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : (defaultProduct?.gallery || []),
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    stock: Number(row.stock || 0),
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 0),
    colors: Array.isArray(row.colors) ? row.colors : [],
    isFeatured: Boolean(row.is_featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isBestSeller: Boolean(row.is_best_seller),
    isLimited: Boolean(row.is_limited),
    specs: row.specs || {
      material: '100% Premium Twill',
      crown: 'Structured Crown',
      closure: 'Adjustable',
      visor: 'Curved Visor',
      origin: 'Roxas, Oriental Mindoro'
    },
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export function mapProductToDbProduct(p: Product): any {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    image: p.image,
    gallery: p.gallery || [],
    price: p.price,
    original_price: p.originalPrice || null,
    stock: p.stock,
    rating: p.rating,
    review_count: p.reviewCount,
    colors: p.colors || [],
    is_featured: Boolean(p.isFeatured),
    is_new_arrival: Boolean(p.isNewArrival),
    is_best_seller: Boolean(p.isBestSeller),
    is_limited: Boolean(p.isLimited),
    specs: p.specs
  };
}

export function mapDbCategoryToCategory(row: any): CategoryInfo {
  const defaultCategory = INITIAL_CATEGORIES.find((c) => c.id === row.id || c.slug === row.slug);
  const resolvedImage =
    (!row.image || row.image.includes('unsplash.com') || row.image.includes('/@fs/')) && defaultCategory
      ? defaultCategory.image
      : row.image;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: resolvedImage || '',
    itemCount: Number(row.item_count || 0)
  };
}

export function mapCategoryToDbCategory(c: CategoryInfo): any {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    item_count: c.itemCount
  };
}

export function mapDbOrderToOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.user_id || 'usr-guest',
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    contactNumber: row.contact_number || '',
    shippingAddress: row.shipping_address || '',
    city: row.city || 'Roxas, Oriental Mindoro',
    postalCode: row.postal_code || '5212',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    discountAmount: Number(row.discount_amount || 0),
    discountCode: row.discount_code || undefined,
    shippingFee: Number(row.shipping_fee || 0),
    totalAmount: Number(row.total_amount || 0),
    orderStatus: row.order_status as OrderStatus,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    createdAt: row.created_at || new Date().toISOString(),
    trackingNumber: row.tracking_number || '',
    carrier: row.carrier || 'CapZone Mindoro Express Fleet',
    estimatedDelivery: row.estimated_delivery || '3-4 Business Days',
    trackingHistory: Array.isArray(row.tracking_history) ? row.tracking_history : [],
    notes: row.notes || undefined
  };
}

export function mapOrderToDbOrder(o: Order): any {
  return {
    id: o.id,
    user_id: o.userId,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    contact_number: o.contactNumber,
    shipping_address: o.shippingAddress,
    city: o.city,
    postal_code: o.postalCode,
    items: o.items,
    subtotal: o.subtotal,
    discount_amount: o.discountAmount,
    discount_code: o.discountCode || null,
    shipping_fee: o.shippingFee,
    total_amount: o.totalAmount,
    order_status: o.orderStatus,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    tracking_number: o.trackingNumber,
    carrier: o.carrier,
    estimated_delivery: o.estimatedDelivery,
    tracking_history: o.trackingHistory,
    notes: o.notes || null
  };
}

export function mapDbReviewToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userName: row.user_name,
    userEmail: row.user_email,
    rating: Number(row.rating),
    comment: row.comment,
    date: row.date,
    verifiedPurchase: Boolean(row.verified_purchase)
  };
}

export function mapReviewToDbReview(r: Review): any {
  return {
    id: r.id,
    product_id: r.productId,
    user_name: r.userName,
    user_email: r.userEmail,
    rating: r.rating,
    comment: r.comment,
    date: r.date,
    verified_purchase: r.verifiedPurchase
  };
}

export function mapDbDiscountToDiscount(row: any): DiscountCode {
  return {
    code: row.code,
    discountType: row.discount_type,
    value: Number(row.value),
    minSpend: Number(row.min_spend || 0),
    description: row.description || '',
    active: Boolean(row.active)
  };
}

export function mapDiscountToDbDiscount(d: DiscountCode): any {
  return {
    code: d.code,
    discount_type: d.discountType,
    value: d.value,
    min_spend: d.minSpend,
    description: d.description,
    active: d.active
  };
}

export function mapDbUserToUser(row: any): User {
  return {
    id: row.id,
    fullname: row.fullname,
    email: row.email,
    password: row.password,
    address: row.address || '',
    city: row.city || 'Roxas, Oriental Mindoro',
    postalCode: row.postal_code || '5212',
    contactNumber: row.contact_number || '',
    role: row.role || 'user',
    avatar: row.avatar || undefined,
    memberSince: row.member_since || 'January 2026'
  };
}

export function mapUserToDbUser(u: User): any {
  return {
    id: u.id,
    fullname: u.fullname,
    email: u.email,
    password: u.password,
    address: u.address,
    city: u.city,
    postal_code: u.postalCode,
    contact_number: u.contactNumber,
    role: u.role,
    avatar: u.avatar || null,
    member_since: u.memberSince
  };
}

// ==========================================
// CRUD OPERATIONS
// ==========================================

// PRODUCTS
export async function fetchProductsFromDb(): Promise<Product[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbProductToProduct);
  } catch (e) {
    console.warn('Supabase fetchProducts failed, falling back:', e);
    return null;
  }
}

export async function upsertProductInDb(product: Product): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapProductToDbProduct(product);
    const { error } = await client.from('products').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert product in Supabase:', e);
    return false;
  }
}

export async function deleteProductInDb(productId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('products').delete().eq('id', productId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete product in Supabase:', e);
    return false;
  }
}

/**
 * Uploads a product photo to Supabase Storage bucket ('product-images').
 * Returns the public CDN URL on success, or null if storage is not configured/fails.
 */
export async function uploadProductImageToStorage(
  fileOrBlob: Blob | File,
  filename?: string
): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const ext = fileOrBlob.type.includes('png') ? 'png' : fileOrBlob.type.includes('webp') ? 'webp' : 'jpg';
    const safeBase = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) : 'cap';
    const filePath = `caps/${safeBase}_${Date.now()}.${ext}`;

    const { error: uploadError } = await client.storage
      .from('product-images')
      .upload(filePath, fileOrBlob, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload skipped/failed:', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = client.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Storage upload encountered an error:', err);
    return null;
  }
}

// CATEGORIES
export async function fetchCategoriesFromDb(): Promise<CategoryInfo[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('categories').select('*').order('name');
    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbCategoryToCategory);
  } catch (e) {
    console.warn('Supabase fetchCategories failed:', e);
    return null;
  }
}

export async function upsertCategoryInDb(cat: CategoryInfo): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapCategoryToDbCategory(cat);
    const { error } = await client.from('categories').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert category in Supabase:', e);
    return false;
  }
}

export async function deleteCategoryInDb(catId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('categories').delete().eq('id', catId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete category in Supabase:', e);
    return false;
  }
}

// ORDERS
export async function fetchOrdersFromDb(): Promise<Order[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbOrderToOrder);
  } catch (e) {
    console.warn('Supabase fetchOrders failed:', e);
    return null;
  }
}

export async function insertOrderInDb(order: Order): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapOrderToDbOrder(order);
    const { error } = await client.from('orders').insert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to insert order in Supabase:', e);
    return false;
  }
}

export async function updateOrderStatusInDb(orderId: string, status: OrderStatus, trackingHistory: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('orders')
      .update({
        order_status: status,
        tracking_history: trackingHistory
      })
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to update order status in Supabase:', e);
    return false;
  }
}

// REVIEWS
export async function fetchReviewsFromDb(): Promise<Review[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbReviewToReview);
  } catch (e) {
    console.warn('Supabase fetchReviews failed:', e);
    return null;
  }
}

export async function insertReviewInDb(review: Review): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapReviewToDbReview(review);
    const { error } = await client.from('reviews').insert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to insert review in Supabase:', e);
    return false;
  }
}

// DISCOUNTS
export async function fetchDiscountsFromDb(): Promise<DiscountCode[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('discounts').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbDiscountToDiscount);
  } catch (e) {
    console.warn('Supabase fetchDiscounts failed:', e);
    return null;
  }
}

export async function upsertDiscountInDb(discount: DiscountCode): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapDiscountToDbDiscount(discount);
    const { error } = await client.from('discounts').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert discount in Supabase:', e);
    return false;
  }
}

export async function deleteDiscountInDb(code: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('discounts').delete().eq('code', code);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to delete discount in Supabase:', e);
    return false;
  }
}

// USERS
export async function fetchUsersFromDb(): Promise<User[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('users').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map(mapDbUserToUser);
  } catch (e) {
    console.warn('Supabase fetchUsers failed:', e);
    return null;
  }
}

export async function upsertUserInDb(user: User): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = mapUserToDbUser(user);
    const { error } = await client.from('users').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Failed to upsert user in Supabase:', e);
    return false;
  }
}

// ==========================================
// SEED DATABASE WITH INITIAL DATA
// ==========================================

export async function seedInitialDataToSupabase(): Promise<{
  success: boolean;
  message: string;
  counts?: {
    products: number;
    categories: number;
    discounts: number;
    reviews: number;
    users: number;
    orders: number;
  };
}> {
  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Supabase client is not configured.' };
  }

  try {
    // 1. Seed categories
    const catPayloads = INITIAL_CATEGORIES.map(mapCategoryToDbCategory);
    const { error: catErr } = await client.from('categories').upsert(catPayloads, { onConflict: 'id' });
    if (catErr) throw new Error(`Categories seed failed: ${catErr.message}`);

    // 2. Seed products
    const prodPayloads = INITIAL_PRODUCTS.map(mapProductToDbProduct);
    const { error: prodErr } = await client.from('products').upsert(prodPayloads, { onConflict: 'id' });
    if (prodErr) throw new Error(`Products seed failed: ${prodErr.message}`);

    // 3. Seed discounts
    const discPayloads = INITIAL_DISCOUNTS.map(mapDiscountToDbDiscount);
    const { error: discErr } = await client.from('discounts').upsert(discPayloads, { onConflict: 'code' });
    if (discErr) throw new Error(`Discounts seed failed: ${discErr.message}`);

    // 4. Seed users
    const userPayloads = INITIAL_USERS.map(mapUserToDbUser);
    const { error: userErr } = await client.from('users').upsert(userPayloads, { onConflict: 'id' });
    if (userErr) throw new Error(`Users seed failed: ${userErr.message}`);

    // 5. Seed reviews
    const revPayloads = INITIAL_REVIEWS.map(mapReviewToDbReview);
    const { error: revErr } = await client.from('reviews').upsert(revPayloads, { onConflict: 'id' });
    if (revErr) throw new Error(`Reviews seed failed: ${revErr.message}`);

    // 6. Seed orders
    const ordPayloads = INITIAL_ORDERS.map(mapOrderToDbOrder);
    const { error: ordErr } = await client.from('orders').upsert(ordPayloads, { onConflict: 'id' });
    if (ordErr) throw new Error(`Orders seed failed: ${ordErr.message}`);

    return {
      success: true,
      message: 'All initial data (products, categories, discounts, reviews, orders, users) was successfully uploaded to Supabase!',
      counts: {
        products: prodPayloads.length,
        categories: catPayloads.length,
        discounts: discPayloads.length,
        reviews: revPayloads.length,
        users: userPayloads.length,
        orders: ordPayloads.length
      }
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Error occurred during database seeding.'
    };
  }
}
