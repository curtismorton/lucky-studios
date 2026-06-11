import Link from "next/link";
import type { ReactNode } from "react";

type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: "tally" | "ghost";
  external?: boolean;
  className?: string;
};

/**
 * The only two buttons on the site.
 * Tally: hard-edged red block, like a record button.
 * Ghost: hairline frame that fills on hover.
 */
export default function Cta({
  href,
  children,
  variant = "tally",
  external,
  className = "",
}: CtaProps) {
  const base =
    "group inline-flex min-h-[52px] items-center justify-center gap-3 px-7 py-3.5 tc-label !text-xs transition-colors duration-200";
  const styles =
    variant === "tally"
      ? "bg-tally text-ink hover:bg-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tally"
      : "border border-bone/25 text-bone hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone";

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} className={`${base} ${styles} ${className}`} {...externalProps}>
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
