import type {
  Address,
  AppNotification,
  Collection,
  Coupon,
  FlashDeal,
  Order,
  Store,
  User,
} from "@/types";
import { products } from "./products";

export const mockUser: User = {
  id: "u-1",
  firstName: "Happy",
  lastName: "C.",
  email: "cyizhappy@gmail.com",
  phone: "+250 788 123 456",
  role: "customer",
  createdAt: new Date(Date.now() - 240 * 86400000).toISOString(),
};

export const addresses: Address[] = [
  {
    id: "addr-1",
    fullName: "Happy C.",
    phone: "+250 788 123 456",
    email: "cyizhappy@gmail.com",
    country: "Rwanda",
    province: "Kigali City",
    city: "Kigali",
    district: "Gasabo",
    street: "KG 7 Ave, House 12",
    postalCode: "00000",
    isDefault: true,
    label: "Home",
  },
  {
    id: "addr-2",
    fullName: "Happy C.",
    phone: "+250 788 999 222",
    country: "Rwanda",
    province: "Kigali City",
    city: "Kigali",
    district: "Kicukiro",
    street: "KK 15 Rd, Office 4",
    isDefault: false,
    label: "Office",
  },
];

export const coupons: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), description: "10% off your first order" },
  { code: "STUDENT15", type: "percent", value: 15, minSubtotal: 100, expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(), description: "15% off orders over $100 with student verification" },
  { code: "FLASH20", type: "fixed", value: 20, minSubtotal: 150, expiresAt: new Date(Date.now() - 1 * 86400000).toISOString(), description: "$20 off flash sale orders over $150 (expired)" },
];

export const flashDeals: FlashDeal[] = products.slice(0, 6).map((p, i) => ({
  id: `deal-${p.id}`,
  productId: p.id,
  endsAt: new Date(Date.now() + (6 - i) * 3600 * 1000 + 1800 * 1000).toISOString(),
  claimedPercent: 30 + i * 10,
  dealPrice: Math.round(p.price * 0.75),
}));

export const notifications: AppNotification[] = [
  { id: "n-1", type: "order", title: "Your order has shipped", body: "Order VX-483920 is on its way and should arrive in 3-5 days.", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false, href: "/account/orders" },
  { id: "n-2", type: "price-drop", title: "Price drop on your wishlist item", body: "SoundWave Pro Wireless Earbuds just dropped to $179.", createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), read: false, href: "/wishlist" },
  { id: "n-3", type: "promotion", title: "Weekend flash sale is live", body: "Up to 40% off audio and gaming gear, for 48 hours only.", createdAt: new Date(Date.now() - 26 * 3600000).toISOString(), read: true, href: "/deals" },
  { id: "n-4", type: "stock", title: "Back in stock", body: "Nebula 27 Gaming Monitor is back in stock.", createdAt: new Date(Date.now() - 50 * 3600000).toISOString(), read: true, href: "/wishlist" },
  { id: "n-5", type: "security", title: "New sign-in detected", body: "We noticed a new sign-in to your account from Kigali, Rwanda.", createdAt: new Date(Date.now() - 96 * 3600000).toISOString(), read: true, href: "/account/security" },
];

export const collections: Collection[] = [
  { id: "col-1", slug: "gaming-setup", title: "Gaming Setup", description: "Everything you need to build a battlestation that wins.", image: "https://picsum.photos/seed/collection-gaming/700/500", productIds: products.filter((p) => p.categoryId === "c-gaming").map((p) => p.id) },
  { id: "col-2", slug: "student-essentials", title: "Student Essentials", description: "Affordable tech to get through exams and projects.", image: "https://picsum.photos/seed/collection-student/700/500", productIds: products.filter((p) => p.price < 200).slice(0, 6).map((p) => p.id) },
  { id: "col-3", slug: "work-from-home", title: "Work From Home", description: "Upgrade your home office for maximum productivity.", image: "https://picsum.photos/seed/collection-wfh/700/500", productIds: products.filter((p) => p.tags.includes("work-from-home") || p.categoryId === "c-computers").slice(0, 6).map((p) => p.id) },
  { id: "col-4", slug: "creator-gear", title: "Creator Gear", description: "Cameras, gimbals and displays for content creators.", image: "https://picsum.photos/seed/collection-creator/700/500", productIds: products.filter((p) => p.categoryId === "c-cameras" || p.tags.includes("creator")).map((p) => p.id) },
  { id: "col-5", slug: "travel-tech", title: "Travel Tech", description: "Compact essentials that keep you powered on the road.", image: "https://picsum.photos/seed/collection-travel/700/500", productIds: products.filter((p) => p.categoryId === "c-accessories").slice(0, 6).map((p) => p.id) },
  { id: "col-6", slug: "smart-home-starter", title: "Smart Home Starter Kit", description: "Turn your house into a connected smart home.", image: "https://picsum.photos/seed/collection-smarthome/700/500", productIds: products.filter((p) => p.categoryId === "c-smart-home").map((p) => p.id) },
];

export const stores: Store[] = [
  { id: "st-1", name: "NovaMart Kigali Heights", city: "Kigali", country: "Rwanda", address: "KG 7 Ave, Kigali Heights, Ground Floor", hours: "Mon-Sat: 9am - 8pm, Sun: 11am - 6pm", services: ["In-store pickup", "Repairs", "Trade-in"], lat: -1.9536, lng: 30.0916 },
  { id: "st-2", name: "NovaMart Manhattan", city: "New York", country: "United States", address: "5th Avenue, New York, NY", hours: "Mon-Sun: 10am - 9pm", services: ["In-store pickup", "Genius Bar", "Trade-in"], lat: 40.758, lng: -73.9855 },
  { id: "st-3", name: "NovaMart Oxford Street", city: "London", country: "United Kingdom", address: "Oxford Street, London", hours: "Mon-Sat: 9am - 8pm, Sun: 12pm - 6pm", services: ["In-store pickup", "Repairs"], lat: 51.5154, lng: -0.1415 },
  { id: "st-4", name: "NovaMart Dubai Mall", city: "Dubai", country: "UAE", address: "The Dubai Mall, Level 1", hours: "Daily: 10am - 11pm", services: ["In-store pickup", "Repairs", "Trade-in"], lat: 25.1975, lng: 55.2796 },
];

function buildOrder(index: number, status: Order["status"]): Order {
  const items = products.slice(index * 2, index * 2 + 2).map((p, i) => ({
    id: `oi-${index}-${i}`,
    productId: p.id,
    name: p.name,
    image: p.thumbnail,
    price: p.price,
    quantity: 1 + (i % 2),
    selectedVariants: {},
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const discount = index % 3 === 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const createdAt = new Date(Date.now() - (index + 1) * 5 * 86400000).toISOString();

  const allSteps: { status: Order["timeline"][number]["status"]; label: string }[] = [
    { status: "placed", label: "Order placed" },
    { status: "payment-confirmed", label: "Payment confirmed" },
    { status: "processing", label: "Processing" },
    { status: "packed", label: "Packed" },
    { status: "shipped", label: "Shipped" },
    { status: "out-for-delivery", label: "Out for delivery" },
    { status: "delivered", label: "Delivered" },
  ];
  const statusOrder = allSteps.map((s) => s.status);
  const cutoff = status === "cancelled" || status === "returned" ? 2 : statusOrder.indexOf(status);

  return {
    id: `order-${index}`,
    orderNumber: `VX-${480000 + index}`,
    createdAt,
    status,
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total: Math.round((subtotal - discount + shipping + tax) * 100) / 100,
    shippingAddress: addresses[0],
    paymentMethod: index % 2 === 0 ? "Visa •••• 4242" : "Mobile Money",
    shippingMethod: index % 3 === 0 ? "Express (2-3 days)" : "Standard (5-7 days)",
    trackingNumber: status === "shipped" || status === "out-for-delivery" || status === "delivered" ? `1Z999AA1${index}0123456` : undefined,
    timeline: allSteps.map((s, i) => ({
      status: s.status,
      label: s.label,
      timestamp: new Date(new Date(createdAt).getTime() + i * 86400000).toISOString(),
      done: i <= cutoff,
    })),
  };
}

export const orders: Order[] = [
  buildOrder(0, "delivered"),
  buildOrder(1, "shipped"),
  buildOrder(2, "processing"),
  buildOrder(3, "out-for-delivery"),
  buildOrder(4, "cancelled"),
  buildOrder(5, "delivered"),
];

export const orderById = (id: string) => orders.find((o) => o.id === id || o.orderNumber === id);
