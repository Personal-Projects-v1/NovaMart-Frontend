import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Account" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">My Account</h1>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
