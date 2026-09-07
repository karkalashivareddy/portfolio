# Environment Audit

_Read-only snapshot — 2026-09-06. No changes made to the system during this audit._

## Toolchain

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | v24.18.1 | Runtime for Next.js 16 build/dev |
| npm | 11.16.0 | Package manager (lockfile: package-lock.json) |
| git | 2.53.0.windows.1 | Windows build |
| GitHub CLI (`gh`) | 2.97.0 | Authenticated, see below |
| Java | 25 (LTS 2025-09-16) | Relevant for Java-based projects (context, not ported to this site) |
| Python | 3.14.6 | Available; used by some repo tooling |
| Docker | 29.7.2 (build a7dcaa6) | Available if we later containerize preview/deploy |

## Git / GitHub CLI state

- `git config user.name` → `karkalashivareddy`
- `git config user.email` → `karkalashivareddy@gmail.com`
- `gh auth status` → **Logged in** to `github.com` as `karkalashivareddy` (keyring), protocol https.
- Token scopes: `gist`, `read:org`, `repo`, `workflow`.
- The token is stored by `gh` in the system keyring. It is never read, logged, or emitted by any build step in this project.

> Security: the token payload above was redacted to `gho_***`. Never paste a live `gho_` token into logs, docs, or source. If one is ever exposed, revoke via GitHub → Settings → Developer settings → Personal access tokens.

## Project workspace

- Root: `C:\Users\karka\portfolio`
- Node workspace present: `node_modules/`, `.next/` (dev build cache from an earlier successful scaffold compile).
- Scaffold: `create-next-app` → Next.js **16.3.4**, React **19.2.8**, Tailwind **v4** (CSS-first config via `@theme`), app router (no `src/` dir).
- Additional deps installed: `motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `lucide-react`.

### Non-fatal install warnings

During dependency install npm printed `allow-scripts` warnings for `unrs-resolver`/nitro postinstall steps (Windows). These are optional native-postinstall warnings and do not affect lint/build. Documented here so they are not mistaken for errors.

## Workspace structure

```
C:\Users\karka\portfolio\
├─ app/            Next.js routes (app router)
├─ components/     UI + layout + section components
├─ data/           typed, source-verified content layer
├─ docs/           audit + design + architecture (this suite)
├─ github/         draft GitHub profile README source
├─ hooks/          client hooks (in-view, count-up)
├─ lib/            infra: store, config, security, sync clients, analytics
├─ public/         static assets
├─ .env.example    example env (see lib/config.ts)
└─ package.json
```

## Secrets posture

- No secrets in source. Admin access is gated by `ADMIN_TOKEN` from env (empty = admin disabled).
- `data-store/` (local JSON analytics/cache) must be gitignored.