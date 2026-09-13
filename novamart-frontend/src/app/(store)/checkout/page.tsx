"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/states";
import { addressSchema, customerInfoSchema, type AddressValues, type CustomerInfoValues } from "@/schemas/checkout.schema";
import { useCartStore } from "@/store/cart.store";
import { productById } from "@/mocks/products";
import { addresses as savedAddresses } from "@/mocks/misc";
import { placeOrder, validateCoupon } from "@/services/api/order.service";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

type PaymentMethod = "card" | "mobile-money" | "paypal" | "bank";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const [step, setStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoValues | null>(null);
  const [address, setAddress] = useState<AddressValues | null>(null);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(savedAddresses[0]?.id ?? null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "pickup">("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [placing, setPlacing] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; value: number; type: "percent" | "fixed" } | null>(null);

  const lines = items
    .map((item) => ({ item, product: productById(item.productId) }))
    .filter((l): l is { item: typeof items[number]; product: NonNullable<ReturnType<typeof productById>> } => !!l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0);
  const discount = coupon ? (coupon.type === "percent" ? Math.round(subtotal * (coupon.value / 100) * 100) / 100 : coupon.value) : 0;
  const shipping = shippingMethod === "pickup" ? 0 : shippingMethod === "express" ? 19.99 : subtotal > 200 ? 0 : 9.99;
  const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  const infoForm = useForm<CustomerInfoValues>({ resolver: zodResolver(customerInfoSchema), defaultValues: { email: "", firstName: "", lastName: "", phone: "" } });
  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: "", phone: "", country: "Rwanda", province: "", city: "", district: "", street: "", postalCode: "" },
  });

  const resolvedAddress = useMemo(() => {
    if (useNewAddress) return address;
    return savedAddresses.find((a) => a.id === savedAddressId) ?? null;
  }, [useNewAddress, address, savedAddressId]);

  if (lines.length === 0 && step === 0) {
    return (
      <div className="container-shell py-12">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add items to your cart before checking out." action={<Link href="/shop"><Button>Shop Now</Button></Link>} />
      </div>
    );
  }

  async function handlePlaceOrder() {
    if (!resolvedAddress) {
      toast.error("Please select or add a shipping address.");
      return;
    }
    setPlacing(true);
    try {
      const order = await placeOrder({
        items,
        address: ("id" in resolvedAddress ? resolvedAddress : { ...resolvedAddress, id: "addr-new" }) as import("@/types").Address,
        shippingMethod,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        tax,
        total,
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?order=${order.orderNumber}`);
    } catch {
      toast.error("Something went wrong placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container-shell py-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
      <CheckoutStepper currentStep={step} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-white p-5 sm:p-7">
          {step === 0 && (
            <form
              onSubmit={infoForm.handleSubmit((values) => {
                setCustomerInfo(values);
                setStep(1);
              })}
              className="flex flex-col gap-4"
            >
              <h2 className="text-lg font-bold">Customer Information</h2>
              <p className="text-sm text-muted">You can check out as a guest or create an account after your purchase.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" error={infoForm.formState.errors.firstName?.message}>
                  <input {...infoForm.register("firstName")} className="input" />
                </Field>
                <Field label="Last Name" error={infoForm.formState.errors.lastName?.message}>
                  <input {...infoForm.register("lastName")} className="input" />
                </Field>
              </div>
              <Field label="Email" error={infoForm.formState.errors.email?.message}>
                <input type="email" {...infoForm.register("email")} className="input" />
              </Field>
              <Field label="Phone" error={infoForm.formState.errors.phone?.message}>
                <input {...infoForm.register("phone")} className="input" />
              </Field>
              <Button type="submit" size="lg" className="mt-2 self-start">Continue to Shipping</Button>
            </form>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold">Shipping Address</h2>
              {!useNewAddress && (
                <div className="flex flex-col gap-2">
                  {savedAddresses.map((addr) => (
                    <label key={addr.id} className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-border p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                      <span className="flex gap-2">
                        <input type="radio" name="saved-address" checked={savedAddressId === addr.id} onChange={() => setSavedAddressId(addr.id)} className="mt-1 accent-brand" />
                        <span className="text-sm">
                          <span className="font-semibold">{addr.label} — {addr.fullName}</span>
                          <br />
                          {addr.street}, {addr.city}, {addr.country}
                          <br />
                          {addr.phone}
                        </span>
                      </span>
                      {addr.isDefault && <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold">Default</span>}
                    </label>
                  ))}
                  <button onClick={() => setUseNewAddress(true)} className="self-start text-sm font-semibold text-brand hover:underline">+ Add a new address</button>
                </div>
              )}

              {useNewAddress && (
                <form
                  onSubmit={addressForm.handleSubmit((values) => {
                    setAddress(values);
                    setStep(2);
                  })}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" error={addressForm.formState.errors.fullName?.message}><input {...addressForm.register("fullName")} className="input" /></Field>
                    <Field label="Phone" error={addressForm.formState.errors.phone?.message}><input {...addressForm.register("phone")} className="input" /></Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Country" error={addressForm.formState.errors.country?.message}><input {...addressForm.register("country")} className="input" /></Field>
                    <Field label="Province/State" error={addressForm.formState.errors.province?.message}><input {...addressForm.register("province")} className="input" /></Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City" error={addressForm.formState.errors.city?.message}><input {...addressForm.register("city")} className="input" /></Field>
                    <Field label="District" error={addressForm.formState.errors.district?.message}><input {...addressForm.register("district")} className="input" /></Field>
                  </div>
                  <Field label="Street Address" error={addressForm.formState.errors.street?.message}><input {...addressForm.register("street")} className="input" /></Field>
                  <Field label="Postal Code (optional)"><input {...addressForm.register("postalCode")} className="input" /></Field>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setUseNewAddress(false)}>Use Saved Address</Button>
                    <Button type="submit">Save & Continue</Button>
                  </div>
                </form>
              )}

              {!useNewAddress && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)} disabled={!savedAddressId}>Continue to Delivery</Button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold">Delivery Method</h2>
              {[
                { value: "standard" as const, label: "Standard Shipping", detail: "5-7 business days", price: subtotal > 200 ? 0 : 9.99 },
                { value: "express" as const, label: "Express Shipping", detail: "2-3 business days", price: 19.99 },
                { value: "pickup" as const, label: "Store Pickup", detail: "Voltrix Kigali Heights — ready in 24 hours", price: 0 },
              ].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" checked={shippingMethod === opt.value} onChange={() => setShippingMethod(opt.value)} className="accent-brand" />
                    <span>
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className="block text-xs text-muted">{opt.detail}</span>
                    </span>
                  </span>
                  <span className="text-sm font-bold">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                </label>
              ))}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold">Payment</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "card" as const, label: "Credit / Debit Card", icon: CreditCard },
                  { value: "mobile-money" as const, label: "Mobile Money", icon: Smartphone },
                  { value: "paypal" as const, label: "PayPal", icon: Wallet },
                  { value: "bank" as const, label: "Bank Transfer", icon: Landmark },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    className={cn("flex items-center gap-3 rounded-xl border p-4 text-left", paymentMethod === opt.value ? "border-brand bg-brand-soft" : "border-border")}
                  >
                    <opt.icon size={18} className={paymentMethod === opt.value ? "text-brand" : "text-muted"} />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="grid gap-4 rounded-xl bg-surface p-4 sm:grid-cols-2">
                  <Field label="Card Number"><input placeholder="4242 4242 4242 4242" className="input" /></Field>
                  <Field label="Name on Card"><input placeholder="Jane Doe" className="input" /></Field>
                  <Field label="Expiry (MM/YY)"><input placeholder="09/28" className="input" /></Field>
                  <Field label="CVV"><input placeholder="123" className="input" /></Field>
                </div>
              )}
              {paymentMethod === "mobile-money" && (
                <div className="rounded-xl bg-surface p-4">
                  <Field label="Mobile Money Number"><input placeholder="+250 78X XXX XXX" className="input" /></Field>
                </div>
              )}
              {(paymentMethod === "paypal" || paymentMethod === "bank") && (
                <p className="rounded-xl bg-surface p-4 text-sm text-muted">
                  You&apos;ll be redirected to complete your {paymentMethod === "paypal" ? "PayPal" : "bank transfer"} payment after reviewing your order. This is a simulated flow for demonstration purposes.
                </p>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-bold">Review Your Order</h2>
              <div>
                <h3 className="mb-2 text-sm font-bold">Items</h3>
                <div className="flex flex-col gap-3">
                  {lines.map(({ item, product }) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image src={product.thumbnail} alt={product.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted">Qty {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {resolvedAddress && (
                <div>
                  <h3 className="mb-1 text-sm font-bold">Shipping to</h3>
                  <p className="text-sm text-muted">
                    {resolvedAddress.fullName}, {resolvedAddress.street}, {resolvedAddress.city}, {resolvedAddress.country}
                  </p>
                </div>
              )}
              <div>
                <h3 className="mb-1 text-sm font-bold">Payment Method</h3>
                <p className="text-sm text-muted capitalize">{paymentMethod.replace("-", " ")}</p>
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Have a coupon code?"
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value;
                      const result = await validateCoupon(value, subtotal);
                      if (result.coupon) {
                        setCoupon(result.coupon);
                        toast.success("Coupon applied");
                      } else toast.error(result.error ?? "Invalid coupon");
                    }
                  }}
                  className="input flex-1"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handlePlaceOrder} disabled={placing}>{placing ? "Placing order..." : "Place Order"}</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-white p-5">
          <h2 className="mb-4 text-base font-bold">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {lines.map(({ item, product }) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image src={product.thumbnail} alt={product.name} fill sizes="48px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-white">{item.quantity}</span>
                </div>
                <span className="line-clamp-1 flex-1">{product.name}</span>
                <span className="font-semibold">{formatPrice(product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs text-brand">{error}</span>}
    </label>
  );
}
