import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { timeline } from "../../data/timeline";

export const metadata: Metadata = {
  title: "Journey",
  description: "The engineering trajectory behind Karkala Shiva Reddy's projects, coursework and practice.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return <main className="world-route-page world-route-journey-page"><div className="world-shell"><div className="world-route-intro"><p className="world-kicker"><span>07</span> / JOURNEY / ENGINEERING TRAJECTORY</p><h1>The work<br /><i>keeps moving.</i></h1><p>A factual trajectory through public repositories, coursework and coding practice. The dates describe what was built or learned, not a claim of professional experience.</p></div><section className="world-journey-route"><div className="world-journey-route-line" />{timeline.map((entry, index) => <article key={entry.title} className={`world-journey-route-node journey-route-${index + 1}`}><span>{entry.date}</span><i /><h2>{entry.title}</h2><p>{entry.detail}</p><small>{entry.kind} · {entry.source}</small></article>)}</section><Link href="/" className="world-text-action">Return to the world <ArrowUpRight size={16} /></Link></div></main>;
}
