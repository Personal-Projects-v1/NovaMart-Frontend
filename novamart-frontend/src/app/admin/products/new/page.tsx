import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
