import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../../../data/projects";
import ProjectDetail from "../../../components/projects/ProjectDetail";
import { SITE_URL } from "../../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/projects/${slug}`,
      title: project.title,
      description: project.tagline,
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.tagline,
      images: [`${SITE_URL}/og.png`],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
