export type CapCategory =
  | 'Baseball Caps'
  | 'Snapback Caps'
  | 'Bucket Hats'
  | 'Dad Hats'
  | 'Trucker Caps'
  | 'Premium Embroidered Caps'
  | 'Limited Edition Caps'
  | 'Streetwear Collection'
  | 'Sports Collection';

export interface ProductSpecs {
  material: string;
  crown: string;
  closure: string;
  visor: string;
  origin: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: CapCategory;
  description: string;
  image: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  specs: ProductSpecs;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id (productId + color)
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  selectedColor: string;
  quantity: number;
  maxStock: number;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  address: string;
  city?: string;
  postalCode?: string;
  contactNumber: string;
  role: 'user' | 'admin';
  avatar?: string;
  memberSince: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  color: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'gcash' | 'maya' | 'card';
export type PaymentStatus = 'paid' | 'pending';

export interface TrackingStep {
  status: string;
  timestamp: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
  notes?: string;
}

export interface DiscountCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 100 for ₱100
  minSpend: number;
  description: string;
  active: boolean;
}

export interface CategoryInfo {
  id: string;
  name: CapCategory;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}
