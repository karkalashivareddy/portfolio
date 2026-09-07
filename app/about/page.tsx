import type { Metadata } from "next";
import { MapPin, GraduationCap, CalendarDays, Mail } from "lucide-react";
import { profile, socials } from "../../data/profile";
import { timeline } from "../../data/timeline";
import Reveal from "../../components/ui/Reveal";
import EmailCopyButton from "../../components/ui/EmailCopyButton";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Karkala Shiva Reddy — B.Tech CS at KL University, competitive programmer, and builder of reliable systems.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const facts: { icon: typeof GraduationCap; label: string; value: string }[] = [
    { icon: GraduationCap, label: "Education", value: profile.universityLong },
    { icon: CalendarDays, label: "Graduating", value: String(profile.graduationYear) },
    { icon: MapPin, label: "Location", value: profile.location },
  ];
  if (socials.email) facts.push({ icon: Mail, label: "Email", value: socials.email });

  return (
    <div className="about-stage mx-auto w-full max-w-[1280px] px-5 sm:px-8 pt-32 pb-28">
      <Reveal>
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-24 items-end">
          <div>
            <div className="section-label mb-7"><span className="text-[#ffb572]">01</span><span>ABOUT / FIELD NOTES</span></div>
            <h1 className="about-lead">The engineer <em>behind</em> the build.</h1>
          </div>
          <div className="pb-2">
            <p className="text-[clamp(1.2rem,2vw,1.65rem)] leading-[1.35] text-fg-0">{profile.headline}</p>
            <p className="mt-5 max-w-[45ch] text-[15px] leading-relaxed text-[#b8b1aa]">{profile.shortBio}</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div className="about-rule mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facts.map((fact) => (
            <div key={fact.label} className="about-fact">
              <fact.icon className="w-4 h-4" aria-hidden />
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[.16em] text-[#8f8984]">{fact.label}</div>
              <div className="mt-2 text-[14px] leading-relaxed text-fg-0">{fact.label === "Email" ? <a className="hover:text-[#ffb572] transition-colors" href={`mailto:${fact.value}`}>{fact.value}</a> : fact.value}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={130}>
        <div className="mt-28 grid lg:grid-cols-[.65fr_1fr] gap-10 lg:gap-24">
          <div>
            <div className="section-label mb-4"><span className="text-[#ffb572]">02</span><span>THE STORY</span></div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none tracking-[-.06em] text-fg-0">A calm mind for complex systems.</h2>
          </div>
          <div className="about-story">
            <p>I&apos;m a B.Tech Computer Science student at <strong>{profile.university}</strong>, building in Java and C. My work sits at the intersection of competitive programming and systems programming — the same discipline that makes a 2,531-problem solving record and a fork-based command shell feel like natural engineering.</p>
            <p className="mt-5">The portfolio is the public floorplan of that process. Projects are classified by real engineering depth, coding numbers are synced from a public Codolio profile, and repositories are shown with honest scope — including coursework and scaffolding.</p>
            <p className="mt-5">Next on the roadmap: Spring Boot, Docker, distributed systems, and continuing to publish engineering work publicly.</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={170}>
        <div className="mt-28">
          <div className="section-label mb-4"><span className="text-[#ffb572]">03</span><span>TRAJECTORY</span></div>
          <ul className="timeline-open">
            {timeline.map((entry, i) => (
              <li key={i} className="grid md:grid-cols-[150px_1fr_auto] gap-4 md:gap-10">
                <span className="font-mono text-[12px] text-[#ffb572]">{entry.date}</span>
                <div><h3 className="font-display text-xl text-fg-0">{entry.title}</h3><p className="mt-1.5 max-w-[640px] text-[14px] leading-relaxed text-[#b8b1aa]">{entry.detail}</p></div>
                <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#8f8984]">{entry.kind} · {entry.source}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={210}>
        <div className="mt-20 flex flex-col md:flex-row md:items-center justify-between gap-6 about-rule">
          <p className="max-w-[55ch] text-[13px] leading-relaxed text-[#8f8984]">The headline numbers live on the homepage. The detail lives in the projects, coding and GitHub chapters.</p>
          {socials.email && <EmailCopyButton className="inline-flex items-center gap-2 border-b border-[#ffb572]/60 py-2 text-[13px] text-fg-0 hover:border-white transition-colors">Copy email</EmailCopyButton>}
        </div>
      </Reveal>
    </div>
  );
}
