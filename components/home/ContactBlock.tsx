import { ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import EmailCopyButton from "../ui/EmailCopyButton";
import { profile, socials } from "../../data/profile";
import Reveal from "../ui/Reveal";

/** CONTACT — final convergence of the field. Deliberately card-free: the focal
 *  atmosphere lights converge behind open white space, one electric CTA, and a
 *  quiet hairline row of where the code lives. Contrast to the valleys before
 *  it: this is the loudest moment because everything else is quiet. */
export default function ContactBlock() {
  return (
    <section id="contact" className="chapter-scene chapter-contact py-28 md:py-48">
      <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8 text-center">
        <Reveal>
          <div className="mb-6 font-mono text-[12px] uppercase tracking-[0.16em] text-fg-2">
            <span className="text-accent/90">09</span> · CONTACT
          </div>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-h1 md:text-display tracking-tight text-fg-0 text-balance">
            The signal resolves here
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] text-fg-1 leading-relaxed">
            B.Tech CS at {profile.university}, graduating {profile.graduationYear}.
            Open to engineering work, internships, and conversations about systems,
            algorithms and backend design.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <EmailCopyButton
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-ink text-[14px] font-medium hover:bg-accent-soft hover:-translate-y-0.5 shadow-accent transition-all duration-300"
              showMailto
            >
              {socials.email}
            </EmailCopyButton>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px]">
            {[
              { label: "LinkedIn", href: socials.linkedin.url, outbound: "linkedin", icon: <LinkedinIcon className="w-3.5 h-3.5" aria-hidden /> },
              { label: "GitHub", href: socials.github.url, outbound: "github", icon: <GithubIcon className="w-3.5 h-3.5" aria-hidden /> },
              { label: "Codolio", href: socials.codolio.url, outbound: "codolio", icon: null },
            ].map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-outbound={s.outbound}
                data-cursor={`OPEN ${s.label.toUpperCase()}`}
                className="group inline-flex items-center gap-1.5 text-fg-1 hover:text-white transition-colors"
              >
                {s.icon}
                {s.label}
                <ExternalLink className="w-3 h-3 text-fg-2 group-hover:text-fg-0 transition-colors" aria-hidden />
                {i < 2 && <span className="ml-3 text-fg-2/60" aria-hidden>·</span>}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-14 flex items-center justify-center" aria-hidden>
            <span className="contact-rule l" />
            <span className="contact-rule-dot" />
            <span className="contact-rule r" />
          </div>
          <p className="mt-6 font-mono text-[11px] text-fg-2 uppercase tracking-[0.16em]">
            field state · converging — open to good engineering conversation
          </p>
        </Reveal>
      </div>
    </section>
  );
}
