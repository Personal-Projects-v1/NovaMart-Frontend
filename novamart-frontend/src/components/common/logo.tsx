import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/constants/site";

const SIZES = {
  sm: { mark: 28, text: "text-lg" },
  md: { mark: 34, text: "text-xl" },
  lg: { mark: 44, text: "text-2xl" },
} as const;

/**
 * NovaMart logo: the cart mark from /public/logo.png next to a two-tone wordmark.
 * `tone="light"` is for dark backgrounds (footer, admin sidebar).
 */
export function Logo({
  size = "md",
  tone = "dark",
  withText = true,
  href = "/",
  className,
}: {
  size?: keyof typeof SIZES;
  tone?: "dark" | "light";
  withText?: boolean;
  href?: string | null;
  className?: string;
}) {
  const { mark, text } = SIZES[size];
  const content = (
    <>
      <Image
        src={tone === "light" ? "/logo-white.png" : "/logo.png"}
        alt={withText ? "" : SITE_NAME}
        width={mark}
        height={Math.round(mark * 0.95)}
        priority
        className="shrink-0 transition-transform duration-300 group-hover/logo:-rotate-6 group-hover/logo:scale-105"
      />
      {withText && (
        <span className={cn("font-display font-extrabold tracking-tight", text, tone === "light" ? "text-white" : "text-foreground")}>
          Nova<span className={tone === "light" ? "text-white/70" : "text-brand"}>Mart</span>
        </span>
      )}
    </>
  );

  const classes = cn("group/logo inline-flex shrink-0 items-center gap-2", className);
  return href ? (
    <Link href={href} aria-label={`${SITE_NAME} home`} className={classes}>
      {content}
    </Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
