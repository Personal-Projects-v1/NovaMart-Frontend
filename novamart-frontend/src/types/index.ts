export type ID = string;

export interface Money {
  amount: number;
  currency: "USD";
}

export interface Brand {
  id: ID;
  slug: string;
  name: string;
  logo?: string | null;
  description: string;
  productCount: number;
  featured?: boolean;
}

export interface Category {
  id: ID;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  parentId?: ID | null;
  productCount: number;
}

export type ProductBadge =
  | "new"
  | "sale"
  | "bestseller"
  | "limited"
  | "exclusive"
  | "free-shipping";

export interface ProductVariantOption {
  id: ID;
  label: string;
  value: string;
  swatch?: string;
  priceDelta?: number;
  inStock: boolean;
}

export interface ProductVariantGroup {
  id: ID;
  name: string; // e.g. "Color", "Storage"
  options: ProductVariantOption[];
}

export interface ProductSpecGroup {
  title: string;
  specs: { label: string; value: string }[];
}

export interface Product {
  id: ID;
  slug: string;
  sku: string;
  name: string;
  brandId: ID;
  categoryId: ID;
  images: string[];
  thumbnail: string;
  price: number;
  compareAtPrice?: number;
  currency: "USD";
  rating: number;
  reviewCount: number;
  stock: number;
  badges: ProductBadge[];
  shortDescription: string;
  description: string;
  variants: ProductVariantGroup[];
  specGroups: ProductSpecGroup[];
  tags: string[];
  createdAt: string;
  featured?: boolean;
  bestSeller?: boolean;
  freeShipping?: boolean;
  warrantyMonths: number;
  colorSwatches?: string[];
  /** Only meaningful in admin views; the storefront API returns active products only. */
  active?: boolean;
}

export interface ProductWithRelations extends Product {
  brand: Brand;
  category: Category;
}

export interface CartItem {
  id: ID;
  productId: ID;
  quantity: number;
  selectedVariants: Record<string, string>;
  addedAt: string;
}

export interface WishlistItem {
  productId: ID;
  addedAt: string;
}

export interface CompareItem {
  productId: ID;
  addedAt: string;
}

export interface Address {
  id: ID;
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  province: string;
  city: string;
  district?: string;
  street: string;
  postalCode?: string;
  isDefault?: boolean;
  label?: string;
}

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem {
  id: ID;
  productId: ID;
  productSlug?: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface OrderTimelineEntry {
  status: OrderStatus | "placed" | "payment-confirmed";
  label: string;
  timestamp: string;
  done: boolean;
}

export interface Order {
  id: ID;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  shippingMethod: string;
  timeline: OrderTimelineEntry[];
  trackingNumber?: string;
  couponCode?: string | null;
  contactEmail?: string | null;
  customerId?: string | null;
}

export interface Review {
  id: ID;
  productId: ID;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  /** approved | pending | hidden (admin moderation) */
  status?: string;
  productName?: string;
  productSlug?: string;
  productImage?: string;
}

export interface ProductQuestion {
  id: ID;
  productId: ID;
  question: string;
  askedBy: string;
  askedAt: string;
  answers: {
    id: ID;
    body: string;
    answeredBy: string;
    isStore: boolean;
    answeredAt: string;
    helpfulCount: number;
  }[];
}

export type UserRole = "guest" | "customer" | "admin";

export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  birthday?: string | null;
  gender?: string | null;
  preferences?: CommunicationPreferences;
}

export interface CommunicationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  priceDrops: boolean;
  newsletter: boolean;
}

export interface UserSession {
  id: ID;
  device: string;
  ipAddress?: string | null;
  createdAt: string;
}

export type NotificationType =
  | "order"
  | "price-drop"
  | "promotion"
  | "stock"
  | "security";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  expiresAt: string;
  description: string;
}

export interface Collection {
  id: ID;
  slug: string;
  title: string;
  description: string;
  image: string;
  productIds: ID[];
  /** Present on the detail endpoint only. */
  products?: ProductWithRelations[];
}

export interface Store {
  id: ID;
  name: string;
  city: string;
  country: string;
  address: string;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
}

export interface FlashDeal {
  id: ID;
  productId: ID;
  endsAt: string;
  claimedPercent: number;
  dealPrice: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ProductFilters {
  categorySlugs?: string[];
  brandSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  colors?: string[];
  sort?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
