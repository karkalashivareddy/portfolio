export default function Container({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  const max =
    size === "wide" ? "max-w-[1400px]" : size === "narrow" ? "max-w-[880px]" : "max-w-[1280px]";
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${max} ${className}`}>{children}</div>
  );
}