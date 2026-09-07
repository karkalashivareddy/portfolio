import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../../data/profile";

const notes: Record<string, string> = {
  "Spring Boot": "Next backend framework",
  Docker: "Containers and development environments",
  "Distributed systems": "Consistency and reliability",
  "System design": "Scaling patterns and trade-offs",
  Cloud: "Deployment fundamentals",
};

export const metadata: Metadata = {
  title: "Learning",
  description: "The current learning horizon for Karkala Shiva Reddy.",
  alternates: { canonical: "/learning" },
};

export default function LearningPage() {
  return <main className="world-route-page world-route-learning-page"><div className="world-shell"><div className="world-route-intro"><p className="world-kicker"><span>08</span> / LEARNING / CURRENT HORIZON</p><h1>Still becoming<br /><i>more useful.</i></h1><p>These are active goals, not claimed skills. Each stays here until a project, course or public artifact gives it enough evidence to move into the engineering map.</p></div><section className="world-learning-route">{profile.goals.map((goal, index) => <article key={goal} className="world-learning-route-node"><span>0{index + 1}</span><i /><h2>{goal}</h2><p>{notes[goal] ?? "On the roadmap — shipped work lands here."}</p></article>)}</section><Link href="/" className="world-text-action">Return to the world <ArrowUpRight size={16} /></Link></div></main>;
}
