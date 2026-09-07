import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import EmailCopyButton from "../../components/ui/EmailCopyButton";
import { profile, socials } from "../../data/profile";

export const metadata: Metadata = { title: "Contact", description: "Open to engineering work, internships and technical conversations.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <main className="world-route-page world-route-contact-page"><div className="world-shell world-route-contact-art"><p className="world-kicker"><span>09</span> / CONTACT / OPEN CHANNEL</p><div className="world-route-contact-copy"><h1>Let&apos;s build<br /><i>something useful.</i></h1><p className="world-lead">Open to engineering work, internships, and conversations about systems, algorithms and backend design.</p><EmailCopyButton className="world-contact-cta" showMailto>{socials.email} <ArrowUpRight size={18} /></EmailCopyButton><div className="world-contact-links"><a href={socials.github.url} target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a><a href={socials.linkedin.url} target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={13} /></a><a href={socials.codolio.url} target="_blank" rel="noreferrer">Codolio <ExternalLink size={13} /></a></div></div><div className="world-route-contact-note">{profile.location} · {profile.university} · graduating {profile.graduationYear}<Link href="/about">Read the story <ArrowUpRight size={14} /></Link></div></div></main>;
}
