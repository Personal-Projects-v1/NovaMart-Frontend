export const SITE_NAME = "Voltrix";
export const SITE_TAGLINE = "Power Your Everyday";
export const SITE_DESCRIPTION =
  "Voltrix is a premium electronics marketplace for phones, laptops, audio, gaming, wearables and smart home tech.";

export const SUPPORT_EMAIL = "support@voltrix.shop";
export const SUPPORT_PHONE = "+250 788 000 111";

export const REGIONS = [
  { code: "RW", label: "Rwanda", flag: "🇷🇼" },
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", label: "UAE", flag: "🇦🇪" },
] as const;

export const CURRENCIES = [
  { code: "RWF", label: "Rwandan Franc", symbol: "FRw", rate: 1350 },
  { code: "USD", label: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", label: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", label: "British Pound", symbol: "£", rate: 0.79 },
] as const;

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Deals", href: "/deals" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Shop", href: "/shop" },
  { label: "Support", href: "/support" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "Phones", href: "/category/phones" },
    { label: "Computers", href: "/category/computers" },
    { label: "Audio", href: "/category/audio" },
    { label: "Gaming", href: "/category/gaming" },
    { label: "Accessories", href: "/category/accessories" },
  ],
  service: [
    { label: "Contact Us", href: "/contact" },
    { label: "Help Center", href: "/support" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Warranty", href: "/warranty" },
  ],
  company: [
    { label: "About Voltrix", href: "/about" },
    { label: "Careers", href: "/about#careers" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  account: [
    { label: "My Profile", href: "/account/profile" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Track Order", href: "/track-order" },
  ],
} as const;

export const TRUST_BADGES = [
  { title: "Secure Payments", desc: "100% safe & encrypted checkout", icon: "ShieldCheck" },
  { title: "Authentic Products", desc: "Sourced from certified vendors", icon: "BadgeCheck" },
  { title: "Fast Shipping", desc: "Delivery across RW, US, UK & UAE", icon: "Truck" },
  { title: "Easy Returns", desc: "30-day hassle-free returns", icon: "RefreshCcw" },
  { title: "24/7 Support", desc: "Real humans, real fast", icon: "Headphones" },
  { title: "2-Year Warranty", desc: "On all eligible devices", icon: "ShieldPlus" },
] as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
