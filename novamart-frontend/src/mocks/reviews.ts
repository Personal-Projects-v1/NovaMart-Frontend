import type { Review, ProductQuestion } from "@/types";
import { products } from "./products";

const names = ["Aline U.", "Jean P.", "Grace M.", "Eric N.", "Sarah K.", "David T.", "Linda F.", "Marc B.", "Fatima A.", "Chris O."];
const titles = [
  "Exceeded my expectations",
  "Great value for the price",
  "Works exactly as described",
  "Would buy again",
  "A few minor issues but overall solid",
  "Fast shipping, great packaging",
  "My new daily driver",
  "Impressive build quality",
];
const bodies = [
  "I've been using this for a few weeks now and it has held up really well. Battery life is better than I expected and the build quality feels premium.",
  "Setup was quick and the performance has been consistent. There are a couple of small quirks but nothing that affects daily use.",
  "Compared to my old device this is a massive upgrade. Highly recommend if you're on the fence.",
  "Delivery was fast and the packaging was secure. The product itself matches the photos and description closely.",
  "Solid purchase overall. Customer support was responsive when I had a question about the warranty.",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const reviews: Review[] = products.flatMap((p, pi) => {
  const rand = seededRandom(pi + 1);
  const count = 3 + Math.floor(rand() * 4);
  return Array.from({ length: count }).map((_, i) => {
    const rating = Math.max(3, Math.min(5, Math.round(p.rating + (rand() - 0.5) * 1.5)));
    return {
      id: `rev-${p.id}-${i}`,
      productId: p.id,
      userName: names[Math.floor(rand() * names.length)],
      rating,
      title: titles[Math.floor(rand() * titles.length)],
      body: bodies[Math.floor(rand() * bodies.length)],
      verifiedPurchase: rand() > 0.25,
      helpfulCount: Math.floor(rand() * 80),
      createdAt: new Date(Date.now() - Math.floor(rand() * 60) * 86400000).toISOString(),
    } satisfies Review;
  });
});

export const questions: ProductQuestion[] = products.slice(0, 14).map((p, i) => ({
  id: `q-${p.id}`,
  productId: p.id,
  question:
    i % 2 === 0
      ? "Does this work internationally / is it dual voltage?"
      : "What's included in the box besides the main unit?",
  askedBy: names[i % names.length],
  askedAt: new Date(Date.now() - (i + 3) * 86400000).toISOString(),
  answers: [
    {
      id: `a-${p.id}-1`,
      body:
        i % 2 === 0
          ? "Yes, it supports 100-240V input so it works worldwide with the right plug adapter."
          : "You'll receive the main unit, a USB-C cable, quick start guide and warranty card.",
      answeredBy: "NovaMart Support",
      isStore: true,
      answeredAt: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
      helpfulCount: 12 + i,
    },
  ],
}));

export const reviewsForProduct = (productId: string) => reviews.filter((r) => r.productId === productId);
export const questionsForProduct = (productId: string) => questions.filter((q) => q.productId === productId);
