import { products } from "@/mocks/products";

export default function AdminInventoryPage() {
  const sorted = [...products].sort((a, b) => a.stock - b.stock);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Inventory</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Stock</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted">{p.sku}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock <= 10 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {p.stock === 0 ? "Out of stock" : p.stock <= 10 ? "Low stock" : "In stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
