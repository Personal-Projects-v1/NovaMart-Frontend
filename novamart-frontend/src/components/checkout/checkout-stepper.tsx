import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = ["Information", "Shipping", "Delivery", "Payment", "Review"] as const;

export function CheckoutStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center">
      {CHECKOUT_STEPS.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                i < currentStep ? "bg-success text-white" : i === currentStep ? "bg-brand text-white" : "bg-surface text-muted"
              )}
            >
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <span className={cn("hidden text-xs font-medium sm:block", i === currentStep ? "text-foreground" : "text-muted")}>{step}</span>
          </div>
          {i < CHECKOUT_STEPS.length - 1 && <div className={cn("mx-2 h-0.5 flex-1", i < currentStep ? "bg-success" : "bg-border")} />}
        </div>
      ))}
    </div>
  );
}
