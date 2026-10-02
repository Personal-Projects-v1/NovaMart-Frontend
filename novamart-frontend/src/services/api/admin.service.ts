import type { Brand, Category, Coupon, Order, PaginatedResult, ProductWithRelations, Review } from "@/types";
import { apiRequest } from "./client";

// ----- shapes only the back office sees ------------------------------------------------------------

export interface Trend {
  value: number;
  /** % change of the last 30 days vs the 30 before; null when there is no earlier data. */
  changePercent: number | null;
}

export interface Dashboard {
  revenue: Trend;
  orders: Trend;
  customers: Trend;
  averageOrderValue: number;
  recentOrders: Order[];
  lowStock: { id: string; name: string; stock: number }[];
  popular: { id: string; name: string; reviewCount: number }[];
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; revenue: number }[];
}

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  enabled: boolean;
  emailVerified: boolean;
  orderCount: number;
  totalSpent: number;
}

export interface AdminCoupon extends Coupon {
  id: string;
  active: boolean;
  usageLimit: number | null;
  usedCount: number;
  expired: boolean;
}

export interface AdminFlashDeal {
  id: string;
  productId: string;
  productName: string;
  endsAt: string;
  claimedPercent: number;
  dealPrice: number;
  active: boolean;
  ended: boolean;
}

export interface ProductInput {
  name: string;
  slug?: string;
  sku?: string;
  brandId: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  shortDescription?: string;
  description?: string;
  images?: string[];
  thumbnail?: string;
  tags?: string[];
  active?: boolean;
  featured?: boolean;
}

export interface BrandInput { name: string; slug?: string; logo?: string; description?: string; featured?: boolean }
export interface CategoryInput { name: string; slug?: string; description?: string; image?: string; icon?: string; parentId?: string | null }
export interface CouponInput {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  expiresAt: string;
  description?: string;
  usageLimit?: number;
  active?: boolean;
}

const page = (p: number, size: number, extra: Record<string, string | number | undefined> = {}) => ({ page: p, pageSize: size, ...extra });

// ----- dashboard ---------------------------------------------------------------------------------

export const getDashboard = () => apiRequest<Dashboard>("/admin/dashboard");

// ----- products & inventory ----------------------------------------------------------------------

export const adminListProducts = (q: string | undefined, p = 1, size = 20, sort?: string) =>
  apiRequest<PaginatedResult<ProductWithRelations>>("/admin/products", { params: page(p, size, { q, sort }) });

export const adminGetProduct = (id: string) => apiRequest<ProductWithRelations>(`/admin/products/${id}`);

export const adminCreateProduct = (input: ProductInput) =>
  apiRequest<ProductWithRelations>("/admin/products", { method: "POST", body: input });

export const adminUpdateProduct = (id: string, input: ProductInput) =>
  apiRequest<ProductWithRelations>(`/admin/products/${id}`, { method: "PUT", body: input });

export const adminSetStock = (id: string, stock: number) =>
  apiRequest<ProductWithRelations>(`/admin/products/${id}/stock`, { method: "PATCH", body: { stock } });

export const adminDeleteProduct = (id: string) => apiRequest<void>(`/admin/products/${id}`, { method: "DELETE" });

// ----- brands & categories -----------------------------------------------------------------------

export const adminListBrands = () => apiRequest<Brand[]>("/admin/brands");
export const adminCreateBrand = (b: BrandInput) => apiRequest<Brand>("/admin/brands", { method: "POST", body: b });
export const adminUpdateBrand = (id: string, b: BrandInput) => apiRequest<Brand>(`/admin/brands/${id}`, { method: "PUT", body: b });
export const adminDeleteBrand = (id: string) => apiRequest<void>(`/admin/brands/${id}`, { method: "DELETE" });

export const adminListCategories = () => apiRequest<Category[]>("/admin/categories");
export const adminCreateCategory = (c: CategoryInput) => apiRequest<Category>("/admin/categories", { method: "POST", body: c });
export const adminUpdateCategory = (id: string, c: CategoryInput) => apiRequest<Category>(`/admin/categories/${id}`, { method: "PUT", body: c });
export const adminDeleteCategory = (id: string) => apiRequest<void>(`/admin/categories/${id}`, { method: "DELETE" });

// ----- orders & customers ------------------------------------------------------------------------

export const adminListOrders = (status: string | undefined, q: string | undefined, p = 1, size = 20) =>
  apiRequest<PaginatedResult<Order>>("/admin/orders", { params: page(p, size, { status, q }) });

export const adminGetOrder = (id: string) => apiRequest<Order>(`/admin/orders/${id}`);

export const adminUpdateOrderStatus = (id: string, status: string, trackingNumber?: string) =>
  apiRequest<Order>(`/admin/orders/${id}/status`, { method: "PATCH", body: { status, trackingNumber } });

export const adminListCustomers = (q: string | undefined, p = 1, size = 20) =>
  apiRequest<PaginatedResult<CustomerSummary>>("/admin/customers", { params: page(p, size, { q }) });

export const adminGetCustomer = (id: string) => apiRequest<{ customer: CustomerSummary; orders: Order[] }>(`/admin/customers/${id}`);

export const adminSetCustomerEnabled = (id: string, enabled: boolean) =>
  apiRequest<CustomerSummary>(`/admin/customers/${id}/enabled`, { method: "PATCH", body: { enabled } });

// ----- coupons & promotions ----------------------------------------------------------------------

export const adminListCoupons = () => apiRequest<AdminCoupon[]>("/admin/coupons");
export const adminCreateCoupon = (c: CouponInput) => apiRequest<AdminCoupon>("/admin/coupons", { method: "POST", body: c });
export const adminDeleteCoupon = (id: string) => apiRequest<void>(`/admin/coupons/${id}`, { method: "DELETE" });

export const adminListPromotions = () => apiRequest<AdminFlashDeal[]>("/admin/promotions");
export const adminCreatePromotion = (p: { productId: string; endsAt: string; dealPrice: number }) =>
  apiRequest<AdminFlashDeal>("/admin/promotions", { method: "POST", body: p });
export const adminDeletePromotion = (id: string) => apiRequest<void>(`/admin/promotions/${id}`, { method: "DELETE" });

// ----- review moderation -------------------------------------------------------------------------

export const adminListReviews = (status: string | undefined, p = 1, size = 20) =>
  apiRequest<PaginatedResult<Review>>("/admin/reviews", { params: page(p, size, { status }) });

export const adminSetReviewStatus = (id: string, status: "approved" | "pending" | "hidden") =>
  apiRequest<Review>(`/admin/reviews/${id}/status`, { method: "PATCH", body: { status } });

export const adminDeleteReview = (id: string) => apiRequest<void>(`/admin/reviews/${id}`, { method: "DELETE" });
