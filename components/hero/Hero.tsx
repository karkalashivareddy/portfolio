"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { profile, socials, verifiedNumbers } from "../../data/profile";
import StatBlock from "../ui/StatBlock";
import EmailCopyButton from "../ui/EmailCopyButton";
import EngineerGraph from "./EngineerGraph";
import HeroReveal from "./HeroReveal";

export default function Hero() {
  return (
    <section id="origin" className="relative min-h-screen flex flex-col overflow-hidden chapter-scene chapter-origin">
      <div className="relative flex-1 flex items-center mx-auto w-full max-w-[1280px] px-5 sm:px-8 pt-28 pb-10">
        <div className="w-full min-w-0 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <HeroReveal index={0} className="section-label mb-6">
              <span className="text-accent">01</span>
              <span>KARKALA SHIVA REDDY · B.TECH CS</span>
            </HeroReveal>

            <HeroReveal index={1}>
              <h1 className="font-display text-[clamp(4rem,8.4vw,8.6rem)] leading-[.88] tracking-[-.075em] text-fg-0 max-w-[760px]">
                Computer Science
                <br />
                <span className="text-[#73dce7]">Engineer</span>
              </h1>
            </HeroReveal>

            <HeroReveal index={2}>
              <p className="mt-6 text-lead text-fg-1 max-w-[600px]">
                {profile.shortBio}
              </p>
            </HeroReveal>

            <HeroReveal index={3}>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-fg-2">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky" aria-hidden /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ok" aria-hidden />
                {profile.degree} · {profile.university}
              </span>
              </div>
            </HeroReveal>

            <HeroReveal index={4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                data-magnetic="true"
                data-cursor="VIEW PROJECTS"
                className="group inline-flex items-center gap-2 px-0 py-3 text-[#e8fbfb] font-medium text-[15px] border-b border-cyan/60 hover:border-white transition-all duration-300"
              >
                View Projects
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
              <Link
                href="/coding"
                className="group inline-flex items-center gap-2 px-0 py-3 text-fg-1 text-[15px] border-b border-line hover:text-white hover:border-white/60 transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" aria-hidden />
                Coding Profiles
              </Link>
              <div className="flex items-center gap-2 ml-1">
                <a
                  href={socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-outbound="github"
                  data-cursor="OPEN GITHUB"
                  aria-label="GitHub profile (opens in new tab)"
                  className="flex items-center justify-center w-10 h-10 border-b border-line text-fg-1 hover:text-white hover:border-line-strong transition-colors"
                >
                  <GithubIcon className="w-[18px] h-[18px]" />
                </a>
                <a
                  href={socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-outbound="linkedin"
                  data-cursor="OPEN LINKEDIN"
                  aria-label="LinkedIn profile (opens in new tab)"
                  className="flex items-center justify-center w-10 h-10 border-b border-line text-fg-1 hover:text-white hover:border-line-strong transition-colors"
                >
                  <LinkedinIcon className="w-[18px] h-[18px]" />
                </a>
                <EmailCopyButton
                  className="inline-flex items-center gap-2 px-0 py-2.5 border-b border-line text-fg-0 text-[13px] hover:text-white hover:border-line-strong transition-all duration-300"
                >
                  Email me
                </EmailCopyButton>
              </div>
              </div>
            </HeroReveal>

            <HeroReveal index={5}>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-line pt-8">
              <StatBlock
                value={verifiedNumbers.problemsSolved}
                label="Problems solved"
                source={verifiedNumbers.source}
                compact
              />
              <StatBlock
                value={verifiedNumbers.platforms}
                label="Platforms"
                source={verifiedNumbers.source}
                compact
              />
              <StatBlock
                value={verifiedNumbers.codechefContests}
                label="CodeChef rated contests"
                source={verifiedNumbers.source}
                suffix="+"
                compact
              />
              <StatBlock
                value={verifiedNumbers.codingStreakDays}
                label="Longest streak"
                source={verifiedNumbers.source}
                suffix="d"
                compact
              />
            </div>
            </HeroReveal>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-[480px] lg:max-w-none">
            <EngineerGraph />
          </div>
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <Link
          href="#signal"
          className="flex flex-col items-center gap-2 text-fg-2 hover:text-fg-1 transition-colors p-1"
          aria-label="Scroll to the highlights section"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-fg-2">SCROLL</span>
          <ArrowDown className="w-4 h-4 animate-bounce" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
