import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  external?: boolean;
  size?: "md" | "lg";
  className?: string;
  arrow?: boolean;
  magnetic?: boolean;
  cursor?: string;
};

export default function Button({
  children,
  href,
  onClick,
  variant = "ghost",
  external,
  size = "md",
  className = "",
  arrow = true,
  magnetic,
  cursor,
}: Props) {
  const base =
    "group inline-flex items-center gap-2 font-medium rounded-[12px] transition-all duration-300 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const sizes = size === "lg" ? "px-6 py-3 text-[15px]" : "px-4 py-2.5 text-sm";
  const variants =
    variant === "primary"
      ? "bg-accent text-ink hover:bg-accent-soft hover:-translate-y-0.5 shadow-accent"
      : "border border-line text-fg-0 hover:border-line-strong hover:text-white hover:-translate-y-0.5 bg-white/[0.02]";

  const cls = `${base} ${sizes} ${variants} ${className}`;
  const extraProps = {
    ...(magnetic ? { "data-magnetic": "true" } : {}),
    ...(cursor ? { "data-cursor": cursor } : {}),
  };

  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...extraProps}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...extraProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} {...extraProps}>
      {inner}
    </button>
  );
}