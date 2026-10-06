import type { Project } from "../../lib/types";

function Dot({ className = "" }: { className?: string }) {
  return <span className={`case-dot ${className}`} aria-hidden="true" />;
}

function PharmaVisual() {
  return (
    <div className="case-visual case-visual-pharma" role="img" aria-label="PharmaStock system visualization showing the React client, Express API with server-side role checks, MongoDB replica-set transactions, and analytics">
      <div className="case-visual-topline"><span>SYSTEM VISUALIZATION</span><span>FLOW / 01</span></div>
      <div className="pharma-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="pharma-node pharma-node-core"><Dot /><strong>PHARMA<br />STOCK</strong><small>inventory system</small></div>
      <div className="pharma-node pharma-node-react"><Dot /><strong>REACT / VITE</strong><small>17-page SPA · RBAC</small></div>
      <div className="pharma-node pharma-node-api"><Dot /><strong>EXPRESS API</strong><small>JWT · server-side RBAC</small></div>
      <div className="pharma-node pharma-node-db"><Dot /><strong>MONGODB</strong><small>replica-set transactions</small></div>
      <div className="pharma-node pharma-node-analytics"><Dot /><strong>RECHARTS</strong><small>alerts + derived data</small></div>
      <svg className="case-connectors" viewBox="0 0 800 480" fill="none" aria-hidden="true">
        <path d="M185 108 C280 154 294 192 350 224" />
        <path d="M185 372 C278 327 302 289 350 254" />
        <path d="M450 244 C528 202 563 148 616 110" />
        <path d="M448 266 C522 302 568 340 618 370" />
      </svg>
      <div className="case-visual-foot"><span>FEFO ALLOCATION</span><span>AUDIT TRAIL IN THE SAME TRANSACTION</span></div>
    </div>
  );
}

function CommandVisual() {
  return (
    <div className="case-visual case-visual-command" role="img" aria-label="CAPS process lifecycle: the browser posts structured argv, a Fastify gateway spawns the C engine, which forks, execs the verified binary, samples /proc for the tracked child, and waits">
      <div className="case-visual-topline"><span>REAL PROCESS LIFECYCLE</span><span>C11 / POSIX</span></div>
      <div className="terminal-command"><span>$</span> caps --monitor --json /usr/bin/echo &quot;Hello CAPS&quot;</div>
      <div className="process-track">
        <div className="process-node process-parent"><small>01 / GATEWAY</small><strong>FASTIFY</strong><em>validate argv</em></div>
        <div className="process-arrow">fork()</div>
        <div className="process-split"><div className="process-node"><small>02 / CAPS ENGINE</small><strong>execvp()</strong><em>verified abs path</em></div><div className="process-node process-program"><small>03 / TARGET</small><strong>RUNNING</strong><em>/proc sampled</em></div></div>
        <div className="process-arrow process-arrow-back">waitpid()</div>
        <div className="process-node process-parent process-sync"><small>04 / GATEWAY</small><strong>SYNCHRONIZED</strong><em>WIFEXITED / WIFSIGNALED</em></div>
      </div>
      <div className="case-visual-foot"><span>IMPLEMENTED AND TESTED</span><span>ONE TRACKED CHILD</span></div>
    </div>
  );
}

function HospitalVisual() {
  const beds = ["AVAILABLE", "OCCUPIED", "AVAILABLE", "STATUS", "OCCUPIED", "AVAILABLE", "STATUS", "OCCUPIED"];
  return (
    <div className="case-visual case-visual-hospital" role="img" aria-label="Generated hospital bed system visualization showing bed states connected to a REST API and MySQL">
      <div className="case-visual-topline"><span>GENERATED SYSTEM VISUALIZATION</span><span>BED STATUS / LIVE VIEW</span></div>
      <div className="hospital-layout"><div className="bed-field">{beds.map((bed, index) => <div key={`${bed}-${index}`} className={`bed-unit bed-${bed.toLowerCase()}`}><span>BED {String(index + 1).padStart(2, "0")}</span><strong>{bed}</strong></div>)}</div><div className="hospital-spine"><span>REST API</span><i /><span>EXPRESS</span><i /><span>MYSQL</span></div></div>
      <div className="case-visual-foot"><span>REACT + VANILLA CLIENTS</span><span>CRUD /api/beds</span></div>
    </div>
  );
}

function DsaVisual() {
  return (
    <div className="case-visual case-visual-dsa" role="img" aria-label="Generated data structures visualization showing AVL insertion, a range scan, and Prim's minimum spanning tree">
      <div className="case-visual-topline"><span>GENERATED ALGORITHM VISUALIZATION</span><span>JAVA / DSA</span></div>
      <div className="dsa-map"><div className="dsa-tree"><span>AVL</span><i /><b /><i /><b /><b /></div><div className="dsa-bplus"><span>RANGE SCAN</span><b /><b /><b /></div><div className="dsa-graph"><span>GRAPH / MST</span><i /><i /><i /><i /></div></div>
      <div className="case-visual-foot"><span>ARRAYLIST FILTER</span><span>PRIM&apos;S MST</span></div>
    </div>
  );
}

function FwdVisual() {
  return <div className="case-visual case-visual-fwd" role="img" aria-label="Generated coursework visual showing HTML, CSS, JavaScript and Java layers"><div className="case-visual-topline"><span>GENERATED COURSEWORK VISUALIZATION</span><span>FWD</span></div><div className="fwd-stack"><span>HTML</span><span>CSS</span><span>JAVASCRIPT</span><span>JAVA</span></div><div className="case-visual-foot"><span>SMALL, TRACEABLE BUILDS</span><span>ACADEMIC SCOPE</span></div></div>;
}

export default function CaseStudyVisual({ project }: { project: Project }) {
  switch (project.slug) {
    case "pharmastock-medicine-stock-management": return <PharmaVisual />;
    case "command-argument-passing-system": return <CommandVisual />;
    case "hospital-bed-management-system": return <HospitalVisual />;
    case "dsa2-java-projects": return <DsaVisual />;
    default: return <FwdVisual />;
  }
}
