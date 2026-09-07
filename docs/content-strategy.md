# Content Strategy

Audit â†’ brand â†’ message architecture. All copy must stay verifiable (see profile-audit.md).

---

## 1. Positioning

**Current honest position**: a 2nd-year Computer Science student at KL University with
- strong competitive programming numbers (verified via Codolio),
- real C/Linux systems coursework,
- two product-grade engineering projects,
- clear momentum toward backend/full-stack systems engineering.

**Positioning statement (final):**

> Computer Science Engineer building reliable software across algorithms, backend systems and full-stack applications.

**Evidence tier (used to back the claim):**

| Claim | Evidence |
|---|---|
| Algorithms / DSA depth | Codolio ~2,531 solved, CodeChef 1,943 + DSA rating 1707, LeetCode 264, GFG 225 + topic distribution |
| Systems / C / Linux / OS | Command Argument Passing System, mini-shell, `/proc` work, signals, termios |
| Backend / full-stack | PharmaStock service-layer architecture, Hospital Bed Express+MySQL |
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
- 2 featured case studies (PharmaStock, Command Argument Passing System).
- Secondary: hospital bed mgmt, Java DSA (AVL/B+/Graph).
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
- Featured 5 repos (ranked); contribution activity described qualitatively if API unavailable.

### JOURNEY
Timeline (verified dates only):
- **2025-12** â€” GitHub account created; began publishing.
- **2026-02 â†’ 03** â€” FWD coursework + first Java system (GatePass).
- **2026-04 â†’ 06** â€” Hospital Bed Management System (full-stack first complete project); university timetable generator.
- **2026-05** â€” DSA-2 projects (AVL, B+Tree, Graph) in Java.
- **2026-08** â€” PharmaStock frontend completed (review-2); OSSP C practicals + command-argument-p passing system; fraud-analysis research scaffold.
- **Ongoing** â€” CodeChef/LeetCode/GFG campaigns (verified contest history runs to Starters 254).

### CONTACT
LinkedIn, GitHub, Codolio. Email only if user supplies a public address (none verified â†’ placeholder with `mailto` disabled).

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
