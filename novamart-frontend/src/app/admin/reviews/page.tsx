"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { Rating } from "@/components/common/rating";
import { reviews as initialReviews } from "@/mocks/reviews";
import { productById } from "@/mocks/products";
import { relativeTime } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews.slice(0, 20));

  function remove(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review removed");
  }
  function approve(id: string) {
    toast.success("Review approved");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Reviews ({reviews.length})</h1>
      <div className="flex flex-col gap-2">
        {reviews.map((review) => {
          const product = productById(review.productId);
          return (
            <div key={review.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold">{product?.name}</p>
                <Rating value={review.rating} showCount={false} size={12} className="my-1" />
                <p className="text-sm">{review.title}</p>
                <p className="text-sm text-muted">{review.body}</p>
                <p className="mt-1 text-xs text-muted">{review.userName} · {relativeTime(review.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(review.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-success hover:bg-surface"><Check size={14} /></button>
                <button onClick={() => remove(review.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-brand hover:bg-surface"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
