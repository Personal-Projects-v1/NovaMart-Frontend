import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { productById } from "@/mocks/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
