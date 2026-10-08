import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Review,
  CategoryInfo,
  DiscountCode,
  OrderStatus,
  PaymentMethod,
  TrackingStep
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_DISCOUNTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import {
  isSupabaseConfigured,
  fetchProductsFromDb,
  upsertProductInDb,
  deleteProductInDb,
  fetchCategoriesFromDb,
  upsertCategoryInDb,
  deleteCategoryInDb,
  fetchOrdersFromDb,
  insertOrderInDb,
  updateOrderStatusInDb,
  fetchReviewsFromDb,
  insertReviewInDb,
  fetchDiscountsFromDb,
  upsertDiscountInDb,
  deleteDiscountInDb,
  seedInitialDataToSupabase
} from '../lib/supabase';

export interface PendingAuthAction {
  type: 'addToCart' | 'buyNow';
  product: Product;
  colorName?: string;
  quantity: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  userId?: string;
}

interface ShopContextType {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  orderConfirmationId: string | null;
  setOrderConfirmationId: (id: string | null) => void;

  // Supabase Database Integration
  isSupabaseConnected: boolean;
  isSyncingWithDb: boolean;
  refreshFromDatabase: () => Promise<void>;
  syncAllWithSupabase: () => Promise<{ success: boolean; message: string }>;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: CategoryInfo[];
  addCategory: (cat: Omit<CategoryInfo, 'id'>) => void;
  editCategory: (id: string, updated: Partial<CategoryInfo>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, colorName?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Discounts
  discounts: DiscountCode[];
  appliedDiscount: DiscountCode | null;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  addDiscountCode: (discount: DiscountCode) => void;
  deleteDiscountCode: (code: string) => void;
  calculateDiscountAmount: (subtotal: number) => number;

  // Orders
  orders: Order[];
  createOrder: (payload: CreateOrderPayload) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByTracking: (trackingNumber: string) => Order | undefined;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => Review[];

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Direct checkout
  buyNow: (product: Product, colorName?: string, quantity?: number) => void;

  // Auth gating
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalReason: 'order' | 'cart' | 'checkout' | null;
  setAuthModalReason: (reason: 'order' | 'cart' | 'checkout' | null) => void;
  pendingAuthAction: PendingAuthAction | null;
  setPendingAuthAction: (action: PendingAuthAction | null) => void;
  executePendingAuthAction: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'capzone_products_v2',
  CART: 'capzone_cart_v2',
  WISHLIST: 'capzone_wishlist_v2',
  ORDERS: 'capzone_orders_v2',
  REVIEWS: 'capzone_reviews_v2',
  DISCOUNTS: 'capzone_discounts_v2',
  CATEGORIES: 'capzone_categories_v2'
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [orderConfirmationId, setOrderConfirmationId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Database State
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => isSupabaseConfigured());
  const [isSyncingWithDb, setIsSyncingWithDb] = useState<boolean>(false);

  // Auth Requirement Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<'order' | 'cart' | 'checkout' | null>(null);
  const [pendingAuthAction, setPendingAuthAction] = useState<PendingAuthAction | null>(null);

  // Toast Dispatcher
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!saved) return INITIAL_PRODUCTS;
      const parsed: Product[] = JSON.parse(saved);
      // Ensure real asset images are used even if browser previously cached old URLs
      return parsed.map((p) => {
        const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === p.id);
        if (initialMatch && (!p.image || p.image.includes('unsplash.com') || p.image.includes('/@fs/'))) {
          return {
            ...p,
            image: initialMatch.image,
            gallery: initialMatch.gallery
          };
        }
        return p;
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Categories State
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!saved) return INITIAL_CATEGORIES;
      const parsed: CategoryInfo[] = JSON.parse(saved);
      return parsed.map((c) => {
        const initialMatch = INITIAL_CATEGORIES.find((init) => init.id === c.id);
        if (initialMatch && (!c.image || c.image.includes('unsplash.com') || c.image.includes('/@fs/'))) {
          return {
            ...c,
            image: initialMatch.image
          };
        }
        return c;
      });
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['prod-001', 'prod-008'];
    } catch {
      return ['prod-001', 'prod-008'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Discounts State
  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
    } catch {
      return INITIAL_DISCOUNTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discounts));
    } catch (e) {
      console.error(e);
    }
  }, [discounts]);

  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  // Cart Computations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const calculateDiscountAmount = (subtotal: number): number => {
    if (!appliedDiscount) return 0;
    if (subtotal < appliedDiscount.minSpend) return 0;
    if (appliedDiscount.discountType === 'percentage') {
      return Math.round((subtotal * (appliedDiscount.value / 100)) * 100) / 100;
    }
    return Math.min(appliedDiscount.value, subtotal);
  };

  // ==========================================
  // SUPABASE DATABASE SYNC & HYDRATION
  // ==========================================
  const refreshFromDatabase = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsSyncingWithDb(true);
    try {
      const [dbProducts, dbCategories, dbOrders, dbReviews, dbDiscounts] = await Promise.all([
        fetchProductsFromDb(),
        fetchCategoriesFromDb(),
        fetchOrdersFromDb(),
        fetchReviewsFromDb(),
        fetchDiscountsFromDb()
      ]);

      let hasValidData = false;

      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        hasValidData = true;
      }
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
        hasValidData = true;
      }
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        hasValidData = true;
      }
      if (dbReviews && dbReviews.length > 0) {
        setReviews(dbReviews);
        hasValidData = true;
      }
      if (dbDiscounts && dbDiscounts.length > 0) {
        setDiscounts(dbDiscounts);
        hasValidData = true;
      }

      setIsSupabaseConnected(true);
      if (hasValidData) {
        console.info('Supabase database hydrated successfully.');
      }
    } catch (e) {
      console.warn('Error during Supabase hydration:', e);
    } finally {
      setIsSyncingWithDb(false);
    }
  };

  // Seed all initial data to Supabase with 1-click
  const syncAllWithSupabase = async () => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Please provide the Supabase Project URL and Anon Public Key first.'
      };
    }

    setIsSyncingWithDb(true);
    try {
      const res = await seedInitialDataToSupabase();
      if (res.success) {
        await refreshFromDatabase();
        setIsSupabaseConnected(true);
        showToast('Initial data successfully uploaded to Supabase!', 'success');
      }
      return res;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Database seeding failed.'
      };
    } finally {
      setIsSyncingWithDb(false);
    }
  };

  // Sync with Supabase on mount
  useEffect(() => {
    refreshFromDatabase();
  }, []);

  // Internal Cart Helper
  const addItemToCartInternal = (product: Product, colorName?: string, quantity: number = 1) => {
    const chosenColor = colorName || product.colors[0]?.name || 'Standard';
    const itemId = `${product.id}-${chosenColor.toLowerCase().replace(/\s+/g, '-')}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item));
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          selectedColor: chosenColor,
          quantity: Math.min(quantity, product.stock),
          maxStock: product.stock
        };
        return [...prev, newItem];
      }
    });
  };

  // Cart operations
  const addToCart = (product: Product, colorName?: string, quantity: number = 1) => {
    if (currentUser?.role === 'admin') {
      showToast('Admin View: Store administrators cannot purchase store products or add items to bag.', 'error');
      return;
    }

    if (!currentUser) {
      showToast('Please sign in or create an account before adding items to bag.', 'error');
      setPendingAuthAction({ type: 'addToCart', product, colorName, quantity });
      setAuthModalReason('cart');
      setIsAuthModalOpen(true);
      return;
    }

    addItemToCartInternal(product, colorName, quantity);
    const chosenColor = colorName || product.colors[0]?.name || 'Standard';
    showToast(`Added ${quantity}x "${product.name}" (${chosenColor}) to your bag.`, 'success');
    setIsCartOpen(true);
  };

  const buyNow = (product: Product, colorName?: string, quantity: number = 1) => {
    if (currentUser?.role === 'admin') {
      showToast('Admin View: Store administrators cannot purchase store products.', 'error');
      return;
    }

    if (!currentUser) {
      showToast('Please sign in or create an account before placing an order.', 'error');
      setPendingAuthAction({ type: 'buyNow', product, colorName, quantity });
      setAuthModalReason('order');
      setIsAuthModalOpen(true);
      return;
    }

    addItemToCartInternal(product, colorName, quantity);
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executePendingAuthAction = () => {
    if (currentUser?.role === 'admin') {
      showToast('Logged in as Administrator. Purchase action disabled for admin account.', 'info');
      setPendingAuthAction(null);
      setIsAuthModalOpen(false);
      setAuthModalReason(null);
      return;
    }

    if (pendingAuthAction) {
      const { type, product, colorName, quantity } = pendingAuthAction;
      addItemToCartInternal(product, colorName, quantity);
      if (type === 'buyNow') {
        setIsCartOpen(false);
        setCurrentPage('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Welcome! Proceeding to checkout for ${product.name}...`, 'success');
      } else {
        setIsCartOpen(true);
        showToast(`Added ${quantity}x "${product.name}" to your bag!`, 'success');
      }
      setPendingAuthAction(null);
    } else if (authModalReason === 'checkout') {
      setCurrentPage('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from bag.', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`Saved "${prod?.name || 'Item'}" to your wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Discount operations
  const applyDiscount = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = discounts.find((d) => d.code === cleanCode && d.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Requires minimum purchase of ₱${found.minSpend.toLocaleString()}.`
      };
    }
    setAppliedDiscount(found);
    showToast(`Promo code "${found.code}" applied!`, 'success');
    return { success: true, message: `Code applied: ${found.description}` };
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    showToast('Promotional voucher removed.', 'info');
  };

  const addDiscountCode = (discount: DiscountCode) => {
    setDiscounts((prev) => [...prev, discount]);
    if (isSupabaseConfigured()) {
      upsertDiscountInDb(discount).catch(console.warn);
    }
    showToast(`Created promo code ${discount.code}`, 'success');
  };

  const deleteDiscountCode = (code: string) => {
    setDiscounts((prev) => prev.filter((d) => d.code !== code));
    if (appliedDiscount?.code === code) {
      setAppliedDiscount(null);
    }
    if (isSupabaseConfigured()) {
      deleteDiscountInDb(code).catch(console.warn);
    }
    showToast(`Code ${code} deleted.`, 'info');
  };

  // Product management (Admin)
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [product, ...prev]);

    if (isSupabaseConfigured()) {
      upsertProductInDb(product).catch((err) =>
        console.warn('Failed to insert product to Supabase:', err)
      );
    }

    showToast(`Product "${product.name}" added to catalog!`, 'success');
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    let finalProduct: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          finalProduct = { ...p, ...updated };
          return finalProduct;
        }
        return p;
      })
    );

    if (isSupabaseConfigured() && finalProduct) {
      upsertProductInDb(finalProduct).catch((err) =>
        console.warn('Failed to update product in Supabase:', err)
      );
    }

    showToast('Product details updated successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured()) {
      deleteProductInDb(id).catch((err) =>
        console.warn('Failed to delete product in Supabase:', err)
      );
    }

    showToast('Product removed from store.', 'info');
  };

  // Categories management (Admin)
  const addCategory = (cat: Omit<CategoryInfo, 'id'>) => {
    const newCat: CategoryInfo = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);

    if (isSupabaseConfigured()) {
      upsertCategoryInDb(newCat).catch((err) =>
        console.warn('Failed to insert category to Supabase:', err)
      );
    }

    showToast(`Category "${cat.name}" created.`, 'success');
  };

  const editCategory = (id: string, updated: Partial<CategoryInfo>) => {
    let finalCategory: CategoryInfo | undefined;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          finalCategory = { ...c, ...updated };
          return finalCategory;
        }
        return c;
      })
    );

    if (isSupabaseConfigured() && finalCategory) {
      upsertCategoryInDb(finalCategory).catch(console.warn);
    }

    showToast('Category updated.', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (isSupabaseConfigured()) {
      deleteCategoryInDb(id).catch(console.warn);
    }

    showToast('Category removed.', 'info');
  };

  // Order operations
  const createOrder = (payload: CreateOrderPayload): Order => {
    if (currentUser?.role === 'admin') {
      showToast('Admin restriction: Store administrators cannot place customer orders.', 'error');
      throw new Error('Store administrators cannot place orders.');
    }

    if (!currentUser) {
      showToast('Please sign in or create an account before placing an order.', 'error');
      setAuthModalReason('order');
      setIsAuthModalOpen(true);
      throw new Error('Authentication required to place order.');
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `CZ-${Math.floor(100000 + Math.random() * 900000)}PH`;
    const discountAmount = calculateDiscountAmount(cartSubtotal);
    const shippingFee = cartSubtotal >= 1000 || appliedDiscount?.code === 'FREESHIP' ? 0 : 99;
    const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    const orderItems = cart.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      orderId,
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      price: item.price,
      color: item.selectedColor,
      quantity: item.quantity
    }));

    const initialTrackingSteps: TrackingStep[] = [
      {
        status: 'Order Placed',
        timestamp: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        location: 'CapZone Online Portal',
        description: `Order successfully recorded with ${payload.paymentMethod.toUpperCase()} payment method.`,
        completed: true
      },
      {
        status: 'Fulfillment & Packing',
        timestamp: 'Estimated: Same-Day / Next-Day',
        location: 'CapZone Headwear Studio, Rizal St., Brgy. Paclasan, Roxas, Oriental Mindoro',
        description: 'Cap structure inspected, brushed, wrapped in acid-free tissue paper and boxed in rigid CapZone cap box.',
        completed: false
      },
      {
        status: 'Dispatched to Courier',
        timestamp: 'Pending',
        location: 'CapZone Roxas Local Express Hub, Oriental Mindoro',
        description: 'Assigned to local motorcycle courier fleet for barangay delivery.',
        completed: false
      },
      {
        status: 'Out for Delivery',
        timestamp: 'Pending',
        location: payload.city,
        description: 'Local rider assigned to final delivery address.',
        completed: false
      },
      {
        status: 'Delivered',
        timestamp: 'Pending',
        location: payload.shippingAddress,
        description: 'Package handed over with signature.',
        completed: false
      }
    ];

    const newOrder: Order = {
      id: orderId,
      userId: payload.userId || currentUser?.id || 'usr-guest',
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      contactNumber: payload.contactNumber,
      shippingAddress: payload.shippingAddress,
      city: payload.city,
      postalCode: payload.postalCode,
      items: orderItems,
      subtotal: cartSubtotal,
      discountAmount,
      discountCode: appliedDiscount?.code,
      shippingFee,
      totalAmount,
      orderStatus: 'processing',
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: formattedDate,
      trackingNumber,
      carrier: 'CapZone Priority Logistics (J&T Express)',
      estimatedDelivery: '3-4 Business Days',
      trackingHistory: initialTrackingSteps,
      notes: payload.notes
    };

    // Update stock levels locally
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((c) => c.productId === prod.id);
        if (itemInCart) {
          const updatedStock = Math.max(0, prod.stock - itemInCart.quantity);
          // Sync stock to Supabase
          if (isSupabaseConfigured()) {
            upsertProductInDb({ ...prod, stock: updatedStock }).catch(console.warn);
          }
          return {
            ...prod,
            stock: updatedStock
          };
        }
        return prod;
      })
    );

    // Save order in state
    setOrders((prev) => [newOrder, ...prev]);

    // Save order in Supabase
    if (isSupabaseConfigured()) {
      insertOrderInDb(newOrder).catch((err) =>
        console.warn('Failed to insert order to Supabase:', err)
      );
    }

    clearCart();
    setOrderConfirmationId(newOrder.id);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${newOrder.id} placed successfully!`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // update step completion
          const updatedHistory = ord.trackingHistory.map((step, idx) => {
            if (status === 'shipped' && idx <= 2) return { ...step, completed: true };
            if (status === 'delivered') return { ...step, completed: true };
            if (status === 'processing' && idx <= 1) return { ...step, completed: true };
            return step;
          });

          updatedOrder = {
            ...ord,
            orderStatus: status,
            paymentStatus: status === 'delivered' ? 'paid' : ord.paymentStatus,
            trackingHistory: updatedHistory
          };
          return updatedOrder;
        }
        return ord;
      })
    );

    // Sync updated status to Supabase
    if (isSupabaseConfigured() && updatedOrder) {
      updateOrderStatusInDb(orderId, status, (updatedOrder as Order).trackingHistory).catch((err) =>
        console.warn('Failed to update order status in Supabase:', err)
      );
    }

    showToast(`Order ${orderId} updated to ${status.toUpperCase()}.`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.id.toLowerCase() === orderId.trim().toLowerCase()
    );
  };

  const getOrderByTracking = (trackingNumber: string) => {
    const clean = trackingNumber.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === clean ||
        o.id.toLowerCase() === clean
    );
  };

  // Review operations
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [newRev, ...prev]);

    // Sync review to Supabase
    if (isSupabaseConfigured()) {
      insertReviewInDb(newRev).catch((err) =>
        console.warn('Failed to insert review to Supabase:', err)
      );
    }

    // Update product rating & count
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const updatedProd = {
            ...p,
            rating: Math.round(avg * 10) / 10,
            reviewCount: prodReviews.length
          };
          if (isSupabaseConfigured()) {
            upsertProductInDb(updatedProd).catch(console.warn);
          }
          return updatedProd;
        }
        return p;
      })
    );

    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        orderConfirmationId,
        setOrderConfirmationId,
        isSupabaseConnected,
        isSyncingWithDb,
        refreshFromDatabase,
        syncAllWithSupabase,
        products,
        addProduct,
        editProduct,
        deleteProduct,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        cart,
        addToCart,
        buyNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        discounts,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        addDiscountCode,
        deleteDiscountCode,
        calculateDiscountAmount,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByTracking,
        reviews,
        addReview,
        getProductReviews,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalReason,
        setAuthModalReason,
        pendingAuthAction,
        setPendingAuthAction,
        executePendingAuthAction
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
