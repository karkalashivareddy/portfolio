import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "../components/layout/SiteShell";
import Footer from "../components/layout/Footer";
import { profile, socials } from "../data/profile";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.shivareddy.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.displayName} — Computer Science Engineer`,
    template: `%s · ${profile.displayName}`,
  },
  description: profile.headline,
  keywords: [
    "Shiva Reddy",
    "Karkala Shiva Reddy",
    "software engineer",
    "Java",
    "Data Structures & Algorithms",
    "backend",
    "full-stack",
    "competitive programming",
    "KL University",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${profile.displayName} — Portfolio`,
    title: `${profile.displayName} — Computer Science Engineer`,
    description: profile.headline,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: profile.headline,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.displayName} — Computer Science Engineer`,
    description: profile.headline,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: profile.name,
        alternateName: profile.displayName,
        jobTitle: "Computer Science Engineering Student",
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: profile.universityLong,
        },
        alumniOf: { "@type": "CollegeOrUniversity", name: profile.universityLong },
        url: SITE_URL,
        sameAs: [socials.github.url, socials.linkedin.url, socials.codolio.url],
        knowsAbout: [
          "Software Engineering",
          "Java",
          "Data Structures",
          "Algorithms",
          "Backend Development",
          "Full-Stack Development",
          "Databases",
        ],
      },
      {
        "@type": "WebSite",
        name: `${profile.displayName} — Portfolio`,
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#7aa2ff] focus:text-[#06070b] text-sm font-medium"
        >
          Skip to content
        </a>
        <SiteShell>
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </SiteShell>
      </body>
    </html>
  );
}
