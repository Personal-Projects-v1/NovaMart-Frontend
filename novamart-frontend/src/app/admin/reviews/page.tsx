"use client";

import { useState } from "react";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Rating } from "@/components/common/rating";
import { Pagination } from "@/components/common/pagination";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminDeleteReview, adminListReviews, adminSetReviewStatus } from "@/services/api/admin.service";
import { errorMessage } from "@/services/api/client";
import { relativeTime } from "@/lib/utils";

const FILTERS = [{ value: "", label: "All" }, { value: "approved", label: "Approved" }, { value: "hidden", label: "Hidden" }];

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "reviews", status, page],
    queryFn: () => adminListReviews(status || undefined, page, 10),
    placeholderData: keepPreviousData,
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    void queryClient.invalidateQueries({ queryKey: ["products"] }); // ratings may have changed
  };
  const setReviewStatus = useMutation({
    mutationFn: ({ id, next }: { id: string; next: "approved" | "hidden" }) => adminSetReviewStatus(id, next),
    onSuccess: (_r, v) => { refresh(); toast.success(v.next === "approved" ? "Review approved" : "Review hidden"); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: adminDeleteReview,
    onSuccess: () => { refresh(); toast.success("Review removed"); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Reviews {data ? `(${data.total})` : ""}</h1>
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => { setStatus(f.value); setPage(1); }} className={`rounded-full px-4 py-2 text-sm font-medium ${status === f.value ? "bg-foreground text-white" : "bg-white"}`}>{f.label}</button>
        ))}
      </div>
      {isError ? <ErrorState onRetry={() => refetch()} /> : (
        <div className="flex flex-col gap-2">
          {isLoading && [0, 1, 2].map((i) => <SkeletonLine key={i} className="h-24 w-full" />)}
          {data?.items.map((review) => (
            <div key={review.id} className={`flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4 ${review.status === "hidden" ? "opacity-60" : ""}`}>
              <div className="flex-1">
                <p className="text-sm font-semibold">{review.productName} {review.status === "hidden" && <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs">Hidden</span>}</p>
                <Rating value={review.rating} showCount={false} size={12} className="my-1" />
                <p className="text-sm">{review.title}</p>
                <p className="text-sm text-muted">{review.body}</p>
                <p className="mt-1 text-xs text-muted">{review.userName} · {relativeTime(review.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {review.status === "hidden" ? (
                  <button aria-label="Approve" title="Approve" onClick={() => setReviewStatus.mutate({ id: review.id, next: "approved" })} className="flex h-8 w-8 items-center justify-center rounded-lg text-success hover:bg-surface"><Check size={14} /></button>
                ) : (
                  <button aria-label="Hide" title="Hide from the store" onClick={() => setReviewStatus.mutate({ id: review.id, next: "hidden" })} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface"><EyeOff size={14} /></button>
                )}
                <button aria-label="Delete" title="Delete" onClick={() => { if (window.confirm("Delete this review permanently?")) remove.mutate(review.id); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-brand hover:bg-surface"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {data && data.items.length === 0 && <p className="p-6 text-center text-sm text-muted">No reviews here.</p>}
        </div>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
}
