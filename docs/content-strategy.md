# Content Strategy

Audit â†’ brand â†’ message architecture. All copy must stay verifiable (see profile-audit.md).

---

## 1. Positioning

**Current honest position**: a Computer Science student at KL University with
- verified coding activity sourced from Codolio,
- executable algorithm work,
- C/Linux systems coursework,
- full-stack, backend, database, and applied-ML projects,
- clear momentum toward production-oriented systems engineering.

**Positioning statement (final):**

> Computer Science Engineer building reliable software across algorithms, backend systems and full-stack applications.

**Evidence tier (used to back the claim):**

| Claim | Evidence |
|---|---|
| Algorithms / DSA depth | LogInsight's executable algorithm laboratory, DSA2's AVL/range-scan/Prim modules, and verified Codolio activity |
| Systems / C / Linux / OS | OSSP mini-shell, process, `/proc`, signal, FIFO, and file-descriptor exercises |
| Backend / full-stack | ForgeSense, PharmaStock's frontend/service boundary, and Hospital Bed Express+MySQL |
| Java (primary language) | Java DSA projects; LeetCode activity in Java; listed as primary in profile |
| Product-quality frontend | PharmaStock React SPA: RBAC, analytics, design tokens, accessible states |

**What we never claim**: production deployment, professional employment, internships, company work, awards, "expert", star counts, user numbers, or performance improvements without evidence.

---

## 2. Message hierarchy (page by page)

### HOME
1. Name + role.
2. One positioning line (above).
3. "Currently" line â€” DSA in Java, backend systems, full-stack builds.
4. Primary CTA: **Explore my work**. Secondary: **GitHub** Â· **Coding profile** Â· **LinkedIn**.
5. Quick-proof strip: 3â€“4 verified numbers (e.g. 2,500+ problems, 36 contests, 5 platforms, 3 flagship projects).

### ABOUT
- Concise engineering story: KL University CSE 2026 â†’ 2029; started in C and algorithm design; moved through systems coursework (processes, shells, `/proc`) into product builds.
- Current focus list (verified): Java, DSA, backend (Node/Express), databases (MySQL/Mongo), C/Linux systems, full-stack React.
- Philosophy: build systems that are understandable, testable, extensible; publish evidence; keep learning.
- Future: Spring Boot, Docker, distributed systems, system design, cloud (listed as goals, clearly marked as goals).

### PROJECTS
- 1 detailed flagship case study (PharmaStock), supported by systems, backend, database, algorithm, and coursework pages.
- Secondary: hospital bed management, Java DSA (AVL/range scan/Prim), and FWD coursework.
- Every featured project gets a `/projects/:slug` page with problem â†’ architecture â†’ implementation â†’ result (only verified sections).

### SKILLS
Only verified items with honest proficiency framing (see data model). Categories:
- Languages: Java, C, JavaScript/TypeScript(types used in projects), Python, SQL
- Frontend: React, Vite, Tailwind (used in portfolio itself), HTML/CSS
- Backend/Systems: Node.js, Express, REST APIs, Linux/POSIX syscalls, `/proc`, signals
- Databases: MySQL, MongoDB (PharmaStack/mongo used in project docs â€” label "MongoDB (ODM: Mongoose, academic)").
- Tools: Git, GitHub, VS Code, Postman, MongoDB Compass, Arduino IDE, Docker (listed as learning).

### CODING (Codolio-driven)
- Verified aggregates + per-platform cards.
- Charts only from real data (difficulty split for LeetCode/GFG; CodeChef rating curve from real contest list).
- Honest notes where data is partial (Codeforces participation light).

### GITHUB
- Live profile via unauthenticated GitHub API with caching + graceful fallback.
- Featured engineering repositories are ranked by technical signal; contribution activity is described qualitatively if the API is unavailable.

### JOURNEY
Timeline (verified dates only):
- **2025-12** â€” GitHub account created; began publishing.
- **2026-02 â†’ 03** â€” FWD coursework + first Java system (GatePass).
- **2026-04 â†’ 06** â€” Hospital Bed Management System (full-stack first complete project); university timetable generator.
- **2026-05** â€” DSA-2 projects (AVL insertion, range scan, Prim's MST) in Java.
- **2026-08** â€” PharmaStock frontend completed (review-2); OSSP C practicals and the command-argument project abstract were published.
- **Ongoing** â€” CodeChef/LeetCode/GFG campaigns (verified contest history runs to Starters 254).

### CONTACT
LinkedIn, GitHub, Codolio, portfolio, and the public email address supplied for the profile.

---

## 3. Brand voice rules

- "Built", "Implemented", "Explored", "Developed", "Currently learning", "Academic project" â€” chosen to match evidence strength.
- No superlatives; no filler ("passionate", "enthusiast", "zen", "code wizard").
- Technical specifics beat adjectives: describe the actual request flow, process lifecycle, or data model rather than implying unsupported product outcomes.
- Numbers always carry a source label (Codolio / LeetCode / GitHub).

---

## 4. Weaknesses to neutralize (from audit)

| Weakness | Strategy |
|---|---|
| GitHub profile incomplete | Add profile README (see `/github/profile-readme.md`), bio, pinning, topics |
| Strongest project unpublished | Keep the strongest public case studies accurate and clearly scoped |
| Academic repo names | Clean names + descriptions; hide empties |
| No live demos | Add "run locally" + sandbox links where honest; screenshots as a near-term step |
| LinkedIn unverifiable | Link it; never source claims from it in copy |
| Backend claims exceed pushed code | PharmaStock labeled "frontend service-layer (backed by demo data; API contract ready)"; backend marked as next phase |
