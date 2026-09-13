import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "c-phones", slug: "phones", name: "Phones", description: "Flagship and budget smartphones from every major brand.", image: "https://picsum.photos/seed/cat-phones/600/700", icon: "Smartphone", parentId: null, productCount: 24 },
  { id: "c-computers", slug: "computers", name: "Computers", description: "Laptops, desktops and workstations for work and play.", image: "https://picsum.photos/seed/cat-computers/600/700", icon: "Laptop", parentId: null, productCount: 26 },
  { id: "c-audio", slug: "audio", name: "Audio", description: "Headphones, earbuds and speakers tuned for every genre.", image: "https://picsum.photos/seed/cat-audio/600/700", icon: "Headphones", parentId: null, productCount: 20 },
  { id: "c-smart-home", slug: "smart-home", name: "Smart Home", description: "Connected devices that make your home smarter and safer.", image: "https://picsum.photos/seed/cat-smarthome/600/700", icon: "Home", parentId: null, productCount: 14 },
  { id: "c-gaming", slug: "gaming", name: "Gaming", description: "Consoles, peripherals and gear for competitive play.", image: "https://picsum.photos/seed/cat-gaming/600/700", icon: "Gamepad2", parentId: null, productCount: 18 },
  { id: "c-wearables", slug: "wearables", name: "Wearables", description: "Smartwatches and fitness trackers that keep up with you.", image: "https://picsum.photos/seed/cat-wearables/600/700", icon: "Watch", parentId: null, productCount: 12 },
  { id: "c-cameras", slug: "cameras", name: "Cameras", description: "Mirrorless, action and drone cameras for every creator.", image: "https://picsum.photos/seed/cat-cameras/600/700", icon: "Camera", parentId: null, productCount: 10 },
  { id: "c-accessories", slug: "accessories", name: "Accessories", description: "Chargers, cases, cables and everyday essentials.", image: "https://picsum.photos/seed/cat-accessories/600/700", icon: "Cable", parentId: null, productCount: 22 },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
