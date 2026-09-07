import { NextResponse } from "next/server";
import { getGithubSnapshot } from "../../../lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getGithubSnapshot();
  const counts = snapshot.repos.reduce(
    (acc, r) => {
      acc.stars += r.stars;
      acc.forks += r.forks;
      if (r.language) acc.languages[r.language] = (acc.languages[r.language] ?? 0) + 1;
      return acc;
    },
    { stars: 0, forks: 0, languages: {} as Record<string, number> }
  );
  return NextResponse.json({
    source: "github",
    username: snapshot.profile.login,
    profile: {
      login: snapshot.profile.login,
      name: snapshot.profile.name,
      bio: snapshot.profile.bio,
      avatar_url: snapshot.profile.avatar_url,
      public_repos: snapshot.profile.public_repos,
      followers: snapshot.profile.followers,
      following: snapshot.profile.following,
      created_at: snapshot.profile.created_at,
      html_url: snapshot.profile.html_url,
    },
    counts,
    repos: snapshot.repos.map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stars: r.stars,
      forks: r.forks,
      topics: r.topics,
      updated_at: r.updated_at,
    })),
    meta: snapshot.meta,
  });
}