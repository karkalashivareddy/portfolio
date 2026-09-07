/** Continuity connector between home scenes. Replaces hard border seams with a
 *  hairline that fades at the edges and a mono field reference — the background
 *  field is continuous, sections are *readings* of it. Static & decorative. */
export default function SceneDivider({
  mark,
  gap = "py-16 md:py-24",
}: {
  mark?: string;
  gap?: string;
}) {
  return (
    <div className={`${gap} px-5 sm:px-8`} aria-hidden>
      <div className="mx-auto flex max-w-[1280px] items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {mark && (
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-fg-2/60">
            {mark}
          </span>
        )}
        <span className="h-px w-8 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
    </div>
  );
}