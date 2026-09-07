import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import EmailCopyButton from "../ui/EmailCopyButton";
import { socials } from "../../data/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] mt-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 py-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <div className="font-display font-semibold text-fg-0">
            Karkala Shiva Reddy
          </div>
          <p className="mt-2 text-[13px] text-fg-2 max-w-xs leading-relaxed">
            Computer Science Engineer — building software across algorithms,
            backend systems and full-stack applications.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              data-outbound="github"
              aria-label="GitHub"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-fg-1 hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              data-outbound="linkedin"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-fg-1 hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={socials.codolio.url}
              target="_blank"
              rel="noopener noreferrer"
              data-outbound="codolio"
              aria-label="Codolio"
              className="flex items-center justify-center px-3 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-fg-1 hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors font-mono text-[11px]"
            >
              Codolio
            </a>
            <EmailCopyButton
              compact
              className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-[rgba(255,255,255,0.1)] text-fg-1 hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors font-mono text-[11px]"
            />
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-[13px]" aria-label="Footer">
          <Link href="/" className="text-fg-1 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/projects" className="text-fg-1 hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="/coding" className="text-fg-1 hover:text-white transition-colors">
            Coding
          </Link>
          <Link href="/github" className="text-fg-1 hover:text-white transition-colors">
            GitHub
          </Link>
          <Link href="/about" className="text-fg-1 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-fg-1 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex flex-col gap-2 text-[12px] text-fg-2 font-mono">
          <span className="inline-flex items-center gap-2">
            <span className="status-dot live" aria-hidden /> portfolio live
          </span>
          <span>© {year} Shiva Reddy</span>
          <span>every number links to a verifiable source</span>
        </div>
      </div>
    </footer>
  );
}