type Props = {
  index: string;
  label: string;
  title: string;
  description?: string;
  level?: 1 | 2;
};

/** Editorial section header: coordinate index + overline, big display title,
 *  then the description drifting to the opposite column on wide screens for an
 *  asymmetric, magazine-like composition. The background field stays neutral —
 *  accent appears only in the thin index coordinate. */
export default function SectionHeader({
  index,
  label,
  title,
  description,
  level = 2,
}: Props) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
      <div className="max-w-2xl">
        <div className="section-label mb-4">
          <span className="text-accent/90">{index}</span>
          <span>{label}</span>
        </div>
        <Heading className="font-display text-h2 md:text-h1 tracking-tight text-fg-0">
          {title}
        </Heading>
      </div>
      {description && (
        <p className="lg:max-w-[340px] lg:pb-1 text-fg-2 text-[13.5px] leading-relaxed lg:text-right border-l lg:border-l-0 border-line pl-4 lg:pl-0">
          {description}
        </p>
      )}
    </div>
  );
}