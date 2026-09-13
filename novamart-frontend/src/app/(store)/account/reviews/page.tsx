import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/common/states";
import { Rating } from "@/components/common/rating";
import { reviews } from "@/mocks/reviews";
import { productById } from "@/mocks/products";
import { relativeTime } from "@/lib/utils";

export default function MyReviewsPage() {
  const myReviews = reviews.filter((r) => r.userName === "Aline U.").slice(0, 4);

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">My Reviews</h2>
      {myReviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Reviews you write will show up here." />
      ) : (
        <div className="flex flex-col gap-4">
          {myReviews.map((review) => {
            const product = productById(review.productId);
            if (!product) return null;
            return (
              <div key={review.id} className="flex gap-4 rounded-2xl border border-border p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image src={product.thumbnail} alt={product.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${product.slug}`} className="text-sm font-semibold hover:text-brand">{product.name}</Link>
                  <Rating value={review.rating} showCount={false} className="my-1" />
                  <p className="text-sm font-semibold">{review.title}</p>
                  <p className="text-sm text-muted">{review.body}</p>
                  <p className="mt-1 text-xs text-muted">{relativeTime(review.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
