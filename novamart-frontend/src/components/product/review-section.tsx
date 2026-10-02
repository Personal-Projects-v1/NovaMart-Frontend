"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BadgeCheck, ThumbsUp, Star } from "lucide-react";
import { Rating } from "@/components/common/rating";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/states";
import { relativeTime } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { createReview, markReviewHelpful } from "@/services/api/product.service";
import { errorMessage } from "@/services/api/client";
import type { Review } from "@/types";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title is too short").max(80),
  body: z.string().min(10, "Please write at least 10 characters"),
});
type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewSection({ reviews, productId }: { reviews: Review[]; productId: string }) {
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [sort, setSort] = useState<"recent" | "helpful">("recent");
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", body: "" },
  });
  const currentRating = watch("rating");

  const avg = localReviews.length ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => r.rating === star).length,
  }));

  const filtered = localReviews
    .filter((r) => (filterStars ? r.rating === filterStars : true))
    .sort((a, b) => (sort === "recent" ? +new Date(b.createdAt) - +new Date(a.createdAt) : b.helpfulCount - a.helpfulCount));

  async function onSubmit(values: ReviewFormValues) {
    setSubmitting(true);
    try {
      const created = await createReview(productId, values);
      setLocalReviews([created, ...localReviews]);
      toast.success("Thanks! Your review has been submitted.");
      reset({ rating: 0, title: "", body: "" });
      setShowForm(false);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function vote(reviewId: string) {
    if (voted.has(reviewId)) return;
    setVoted(new Set(voted).add(reviewId));
    setLocalReviews((list) => list.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)));
    try {
      await markReviewHelpful(reviewId);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-[240px_1fr]">
        <div>
          <p className="text-4xl font-extrabold">{avg.toFixed(1)}</p>
          <Rating value={avg} count={localReviews.length} className="mt-1" />
          <div className="mt-4 space-y-1.5">
            {distribution.map(({ star, count }) => (
              <button
                key={star}
                onClick={() => setFilterStars(filterStars === star ? null : star)}
                className="flex w-full items-center gap-2 text-xs"
              >
                <span className="w-8 text-muted">{star}★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${localReviews.length ? (count / localReviews.length) * 100 : 0}%` }} />
                </span>
                <span className="w-6 text-right text-muted">{count}</span>
              </button>
            ))}
          </div>
          <Button className="mt-5 w-full" variant="outline" onClick={() => setShowForm((v) => !v)}>
            Write a Review
          </Button>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <select value={sort} onChange={(e) => setSort(e.target.value as "recent" | "helpful")} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
            </select>
            {filterStars && (
              <button onClick={() => setFilterStars(null)} className="text-xs text-brand hover:underline">
                Clear filter ({filterStars}★)
              </button>
            )}
          </div>

          {showForm && !isAuthenticated && (
            <p className="mb-6 rounded-2xl border border-border p-4 text-sm text-muted">
              Please <Link href={`/login?next=${encodeURIComponent(typeof window === "undefined" ? "/" : window.location.pathname)}`} className="font-semibold text-brand hover:underline">sign in</Link> to write a review.
            </p>
          )}
          {showForm && isAuthenticated && (
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 rounded-2xl border border-border p-4">
              <p className="mb-2 text-sm font-semibold">Your rating</p>
              <div className="mb-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setValue("rating", star, { shouldValidate: true })}>
                    <Star size={22} className={star <= currentRating ? "fill-amber-400 text-amber-400" : "text-border"} />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mb-2 text-xs text-brand">{errors.rating.message}</p>}
              <input {...register("title")} placeholder="Review title" className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand" />
              {errors.title && <p className="mb-2 text-xs text-brand">{errors.title.message}</p>}
              <textarea {...register("body")} placeholder="Share your thoughts about this product" rows={3} className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand" />
              {errors.body && <p className="mb-2 text-xs text-brand">{errors.body.message}</p>}
              <Button type="submit" size="sm" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</Button>
            </form>
          )}

          {filtered.length === 0 ? (
            <EmptyState title="No reviews yet" description="Be the first to share your experience with this product." />
          ) : (
            <div className="flex flex-col gap-5">
              {filtered.map((review) => (
                <div key={review.id} className="border-b border-border pb-5 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-bold">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{review.userName}</p>
                        <p className="text-xs text-muted">{relativeTime(review.createdAt)}</p>
                      </div>
                    </div>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs font-medium text-success">
                        <BadgeCheck size={13} /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <Rating value={review.rating} showCount={false} className="my-2" />
                  <p className="text-sm font-semibold">{review.title}</p>
                  <p className="mt-1 text-sm text-muted">{review.body}</p>
                  <button onClick={() => vote(review.id)} disabled={voted.has(review.id)} className="mt-2 flex items-center gap-1.5 text-xs text-muted hover:text-brand disabled:text-brand">
                    <ThumbsUp size={12} /> Helpful ({review.helpfulCount})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
