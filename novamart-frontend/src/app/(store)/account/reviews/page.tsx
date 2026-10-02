"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { EmptyState, SkeletonLine } from "@/components/common/states";
import { Rating } from "@/components/common/rating";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteReview, listMyReviews } from "@/services/api/user.service";
import { errorMessage } from "@/services/api/client";
import { relativeTime } from "@/lib/utils";

export default function MyReviewsPage() {
  const queryClient = useQueryClient();
  const { data: myReviews = [], isLoading } = useQuery({ queryKey: ["me", "reviews"], queryFn: listMyReviews });
  const remove = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["me", "reviews"] }); toast.success("Review deleted"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">My Reviews</h2>
      {isLoading ? (
        <div className="flex flex-col gap-4">{[0, 1].map((i) => <SkeletonLine key={i} className="h-24 w-full" />)}</div>
      ) : myReviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Reviews you write will show up here." />
      ) : (
        <div className="flex flex-col gap-4">
          {myReviews.map((review) => {
            return (
              <div key={review.id} className="flex gap-4 rounded-2xl border border-border p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  {review.productImage && <Image src={review.productImage} alt={review.productName ?? ""} fill sizes="64px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <Link href={`/product/${review.productSlug}`} className="text-sm font-semibold hover:text-brand">{review.productName}</Link>
                  <Rating value={review.rating} showCount={false} className="my-1" />
                  <p className="text-sm font-semibold">{review.title}</p>
                  <p className="text-sm text-muted">{review.body}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-muted">
                    {relativeTime(review.createdAt)}
                    <button onClick={() => { if (window.confirm("Delete this review?")) remove.mutate(review.id); }} className="font-semibold hover:text-brand">Delete</button>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
