type Props = {
  label: string;
  className?: string;
  title?: string;
};

export default function Pill({ label, className = "", title }: Props) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-mono tracking-wide bg-white/[0.05] text-fg-1 border border-line ${className}`}
    >
      {label}
    </span>
  );
}