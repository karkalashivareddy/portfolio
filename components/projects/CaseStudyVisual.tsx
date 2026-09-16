import type { Project } from "../../lib/types";

function Dot({ className = "" }: { className?: string }) {
  return <span className={`case-dot ${className}`} aria-hidden="true" />;
}

function PharmaVisual() {
  return (
    <div className="case-visual case-visual-pharma" role="img" aria-label="Generated PharmaStock system visualization showing the frontend, service layer, API contract, database and analytics relationships">
      <div className="case-visual-topline"><span>GENERATED SYSTEM VISUALIZATION</span><span>FLOW / 01</span></div>
      <div className="pharma-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="pharma-node pharma-node-core"><Dot /><strong>PHARMA<br />STOCK</strong><small>inventory system</small></div>
      <div className="pharma-node pharma-node-react"><Dot /><strong>REACT / VITE</strong><small>17-page SPA · RBAC</small></div>
      <div className="pharma-node pharma-node-api"><Dot /><strong>SERVICE LAYER</strong><small>async adapters</small></div>
      <div className="pharma-node pharma-node-db"><Dot /><strong>MONGODB</strong><small>target contract</small></div>
      <div className="pharma-node pharma-node-analytics"><Dot /><strong>RECHARTS</strong><small>alerts + derived data</small></div>
      <svg className="case-connectors" viewBox="0 0 800 480" fill="none" aria-hidden="true">
        <path d="M185 108 C280 154 294 192 350 224" />
        <path d="M185 372 C278 327 302 289 350 254" />
        <path d="M450 244 C528 202 563 148 616 110" />
        <path d="M448 266 C522 302 568 340 618 370" />
      </svg>
      <div className="case-visual-foot"><span>DEMO DATA TODAY</span><span>EXPRESS / MONGO CONTRACT READY</span></div>
    </div>
  );
}

function CommandVisual() {
  return (
    <div className="case-visual case-visual-command" role="img" aria-label="Generated planned process lifecycle visualization showing a parent, fork, child process, exec, program execution and wait synchronization">
      <div className="case-visual-topline"><span>GENERATED PLANNED PROCESS MODEL</span><span>POSIX / LIFECYCLE</span></div>
      <div className="terminal-command"><span>$</span> ./program arg1 arg2 arg3</div>
      <div className="process-track">
        <div className="process-node process-parent"><small>01 / PARENT</small><strong>REPL</strong><em>parse argv</em></div>
        <div className="process-arrow">fork()</div>
        <div className="process-split"><div className="process-node"><small>02 / CHILD</small><strong>execvp()</strong><em>transfer argv</em></div><div className="process-node process-program"><small>03 / PROGRAM</small><strong>RUNNING</strong><em>exit status</em></div></div>
        <div className="process-arrow process-arrow-back">waitpid()</div>
        <div className="process-node process-parent process-sync"><small>04 / PARENT</small><strong>SYNCHRONIZED</strong><em>WIFEXITED / WIFSIGNALED</em></div>
      </div>
      <div className="case-visual-foot"><span>PLANNED C / LINUX DESIGN</span><span>NO IMPLEMENTATION CLAIM</span></div>
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
