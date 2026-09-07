"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import MasterWorldCanvas from "../world/MasterWorldCanvas";

const experiments = [
  ["01", "3D core", "A single computational nucleus with depth, orbitals, discipline nodes and pointer light."],
  ["02", "camera", "The master world eases through chapters as native scroll changes camera distance and scene grammar."],
  ["03", "particles", "Particles orbit in the hero, stream through coding, connect around work, then converge at contact."],
  ["04", "image scroll", "The project stage is ready for real imagery: scale, clip and architecture layers without invented screenshots."],
  ["05", "typography", "Split words carry the arrival scene; outlined type and offset lines provide hierarchy without UI chrome."],
  ["06", "magnetic UI", "Buttons and links use small intentional translations through the existing cursor interaction layer."],
  ["07", "architecture", "PharmaStock becomes a living React → API → database system, not a card with a tech stack."],
  ["08", "palette", "Chapter palettes move from electric violet to lime, coral, warm editorial, magenta and amber."],
  ["09", "constellation", "Real repository names become spatial anchors; stars and forks are never fabricated."],
  ["10", "reduced motion", "The canvas stays readable and still when the system asks for less motion."],
  ["11", "depth planes", "Background atmosphere, canvas world, architecture, image plane, typography and controls stay separate."],
  ["12", "contact collision", "Every path eases toward a warm point, then the page leaves the visitor with one clear action."],
] as const;

export default function VisualLab() {
  const labRef = useRef<HTMLElement>(null);
  return <main ref={labRef} className="visual-lab-page"><div className="visual-lab-world"><MasterWorldCanvas quiet /></div><div className="visual-lab-wrap"><div className="visual-lab-head"><div><p className="x2-kicker">PORTFOLIO X² / VISUAL LAB</p><h1>Small instruments<br /><em>for one larger world.</em></h1></div><p>Independent prototypes for the interaction language behind the portfolio. The experiments are intentionally labeled so technique never gets confused with content.</p></div><section className="visual-lab-core"><div><span>01 / MASTER WORLD</span><h2>Scroll this page.<br /><em>Watch the field change.</em></h2><p>Core → signal → architecture → map → constellation → contact. The canvas is decorative; the story remains in HTML.</p></div><div className="visual-lab-core-frame"><MasterWorldCanvas /></div></section><section className="visual-lab-grid">{experiments.map(([index, title, description]) => <article key={index} className={`visual-lab-card lab-${index}`}><span>{index}</span><h2>{title}</h2><p>{description}</p>{title === "image scroll" && <div className="lab-image-mock"><i /><b /><strong>SCROLL / DEPTH / MASK</strong></div>}{title === "typography" && <div className="lab-type-mock">MOVE<br /><em>WITH</em><br />PURPOSE.</div>}{title === "magnetic UI" && <button type="button" className="lab-magnetic-mock">APPROACH <ArrowUpRight size={15} /></button>}{title === "architecture" && <div className="lab-arch-mock"><i>REACT</i><b>API</b><i>DATA</i></div>}</article>)}</section><footer className="visual-lab-footer"><Link href="/">Return to the world <ArrowUpRight size={14} /></Link><span>Experimental route / no fabricated project imagery</span></footer></div></main>;
}
