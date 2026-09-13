import { Breadcrumbs } from "./breadcrumbs";

export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <div className="prose-sm max-w-2xl space-y-4 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}
