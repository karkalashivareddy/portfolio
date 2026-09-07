import Link from "next/link";
import CodingHighlights from "./CodingHighlights";
import GitHubHighlights from "./GitHubHighlights";
import Reveal from "../ui/Reveal";
import SectionHeader from "../ui/SectionHeader";
import SceneDivider from "../layout/SceneDivider";

export default function LiveSection() {
  return (
    <>
      <section id="coding" className="chapter-scene chapter-coding py-14 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <Reveal>
            <SectionHeader
              index="05"
              label="CODING"
              title="Competitive programming, live"
              description="Synced on demand from my public Codolio profile and labeled by freshness — nothing hard-coded without a source."
            />
          </Reveal>
          <Reveal>
            <CodingHighlights />
          </Reveal>
          <Reveal>
            <div className="mt-8">
              <Link
                href="/coding"
                className="inline-flex items-center gap-2 text-[14px] text-accent-soft hover:text-white transition-colors"
              >
                Full coding dashboard →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SceneDivider mark="field // 06" gap="py-10 md:py-14" />

      <section id="github" className="chapter-scene chapter-github py-14 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <Reveal>
            <SectionHeader
              index="06"
              label="GITHUB"
              title="Public workspace, live"
              description="Repositories pulled live from the GitHub API. An early account — zero stars are shown honestly, not padded."
            />
          </Reveal>
          <Reveal delay={80}>
            <GitHubHighlights />
          </Reveal>
          <Reveal>
            <div className="mt-8">
              <Link
                href="/github"
                className="inline-flex items-center gap-2 text-[14px] text-accent-soft hover:text-white transition-colors"
              >
                Filter &amp; explore all repositories →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
