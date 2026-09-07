import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { engineeringGraph } from "../../data/engineeringGraph";

export const metadata: Metadata = {
  title: "Systems",
  description: "An engineering map connecting Java, DSA, backend, databases and Linux systems.",
  alternates: { canonical: "/systems" },
};

export default function SystemsPage() {
  return <main className="world-route-page world-route-systems-page"><div className="world-shell"><div className="world-route-intro"><p className="world-kicker"><span>04</span> / SYSTEMS / ENGINEERING MAP</p><h1>Context makes<br /><i>the skill useful.</i></h1><p>Java moves into DSA. C opens Linux processes. Backend work meets a real data model. This is a relationship map, not a wall of badges.</p></div><section className="world-systems-route"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>{engineeringGraph.edges.map((edge) => { const source = engineeringGraph.nodes.find((node) => node.id === edge.source); const target = engineeringGraph.nodes.find((node) => node.id === edge.target); if (!source || !target) return null; return <line key={`${edge.source}-${edge.target}`} x1={source.x * 100} y1={source.y * 100} x2={target.x * 100} y2={target.y * 100} />; })}</svg>{engineeringGraph.nodes.map((node) => <a key={node.id} href={node.links[0]?.href ?? "#"} target={node.links[0]?.external ? "_blank" : undefined} rel={node.links[0]?.external ? "noreferrer" : undefined} className={`world-system-route-node world-system-${node.id}`} style={{ "--system-color": node.color } as React.CSSProperties}><i /><strong>{node.label}</strong><small>{node.sub}</small></a>)}</section><div className="world-systems-route-note"><span>Hover or focus a node to inspect its context.</span><Link href="/#systems">Open the live map <ArrowUpRight size={14} /></Link></div></div></main>;
}
