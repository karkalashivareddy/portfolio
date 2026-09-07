import { profile } from "../../data/profile";

const GOAL_NOTES: Record<string, string> = {
  "Spring Boot": "REST-first backend framework",
  Docker: "Containers & dev environments",
  "Distributed systems": "Consistency, reliability",
  "System design": "Scaling patterns",
  Cloud: "AWS / deployment fundamentals",
};

export default function CodingGoals() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 open-list">
      {profile.goals.map((g) => (
        <div key={g} className="py-4">
          <span className="text-[10px] font-mono text-warn uppercase tracking-wide inline-flex items-center gap-1.5">
            <span className="status-dot stale" aria-hidden /> next
          </span>
          <div className="mt-2 font-display text-[15px] text-fg-0">{g}</div>
          <p className="mt-1 text-[11.5px] text-fg-2 leading-relaxed">
            {GOAL_NOTES[g] ?? "On the roadmap — not yet claimed as a skill"}
          </p>
        </div>
      ))}
    </div>
  );
}
