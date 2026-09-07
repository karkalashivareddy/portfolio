"use client";

/** Top hairline showing scroll progress. Under browsers supporting CSS
 *  scroll-timeline the visual is pure CSS (off-main-thread, free).
 *  The static state is a 0-width bar — content is authored readable. */
export default function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden />;
}