"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "@/components/admin/product-form";
import { ErrorState, SkeletonLine } from "@/components/common/states";
import { adminGetProduct } from "@/services/api/admin.service";
import { ApiError } from "@/services/api/client";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading, error, refetch } = useQuery({ queryKey: ["admin", "product", id], queryFn: () => adminGetProduct(id), retry: false });

  if (isLoading) return <SkeletonLine className="h-96 w-full" />;
  if (error instanceof ApiError && error.status === 404) notFound();
  if (error || !product) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
