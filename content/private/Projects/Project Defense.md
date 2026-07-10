---
tags: [taskgen]
---

# Project Defense Study Guide

How to use this: for each module below, don't just re-read the code and summarize it.
Answer the "Defend it" question out loud, from memory, with the file closed.
If you can't, that's your study target — go back in, understand it, close the file, try again.
The goal isn't to describe what the code does. It's to be able to justify why it's built this way
over the obvious alternative, and know what breaks if it were built differently.

---

## AniFlow (Django + AniList OAuth + streaming adapters)

### `apps/users/` — custom user model, AniList OAuth views
- What it does: custom user model, `/auth/anilist/login/` and `/auth/anilist/callback/` OAuth flow, session creation.
- Defend it: Why a custom user model instead of Django's default `User`? What breaks later if you'd used the default and needed to add AniList-specific fields (tokens, external IDs) after the fact?
- Defend it: Walk through the OAuth callback step by step — what does AniList send you, what do you exchange it for, where does the token get stored, and what happens if the exchange fails halfway?
- Defend it: Why validate/whitelist the `?next=` redirect param instead of trusting it directly? What attack does an unvalidated redirect enable?

### `apps/tracker/` — tracker abstraction + AniList adapter
- What it does: abstracts "a tracker" as a concept, with AniList as one concrete implementation, syncing remote lists into local `Anime`/`UserAnime` rows.
- Defend it: Why build an abstraction here at all if AniList is the only tracker implemented? What's the cost of building it now vs. adding the abstraction later when a second tracker actually shows up (YAGNI vs. future-proofing tradeoff)?
- Defend it: On sync, how do you reconcile local watch progress vs. remote state if both changed? Who wins?

### `apps/streaming/` — StreamingSource models, matchers, router, per-site adapters
- What it does: maps catalog titles to provider-specific IDs, builds episode URLs, falls back to provider search when no mapping exists.
- Defend it: Why a router + pluggable adapter pattern instead of an if/else per site inside the view? What does adding a new streaming provider require, concretely, file by file?
- Defend it: Why `rapidfuzz` for title matching instead of exact match? What's the false-positive failure mode of fuzzy matching (wrong show resolved), and how would you catch that if it happened?
- Defend it: What happens when a title can't be mapped at all — what does the user see, and why did you choose that behavior over silently failing or hard-erroring?

### `apps/anime/` — core models + web views + `/api/*` JSON handlers
- What it does: dual surface — server-rendered pages for the web UI, JSON API under `/api/` for a separate SPA, sharing the same session auth.
- Defend it: Why one Django app serving both HTML and JSON instead of splitting the API into its own service? What would you have to duplicate if you split them?
- Defend it: Why does unauthenticated `/api/` return 401 JSON instead of redirecting to login like the web UI does? Why is that the correct behavior for an API consumer vs. a browser?
- Defend it: Where does CORS get configured, and why does it matter here specifically (session cookies + separate SPA origin)?

### Deployment / config (`render.yaml`, `config/settings`)
- Defend it: Why Postgres instead of SQLite for this project specifically, given OtakuParadise shipped with SQLite committed straight into the repo? What would break in AniFlow if you'd done the same?
- Defend it: What's `CSRF_TRUSTED_ORIGINS` doing here and why does it matter once frontend and backend are on different domains?

---

## CP-Lockin (browser extension — Codeforces/LeetCode tracker)

### `src/api/` — platform integrations (Codeforces, LeetCode)
- What it does: Codeforces via public REST + accepted submissions with incremental sync; LeetCode via public GraphQL `submissionCalendar`.
- Defend it: Why incremental sync for Codeforces but not (or differently) for LeetCode? What's the actual difference in what each API gives you back?
- Defend it: LeetCode's calendar is day-level counts, not a list of solved problems — what does that limitation mean for accuracy, and where does it show up in the UI as a result?
- Defend it: What happens on the very first sync for a long-time competitive programmer with years of history? Where's the boundary/limit, and why does it exist?

### `src/background/` — background sync orchestration
- Defend it: Why run sync in the background on a schedule instead of only on-demand when the popup opens? What's the tradeoff (freshness vs. API load/rate limits)?
- Defend it: What happens if a scheduled sync fails silently — does the user find out, and how?

### `src/storage/` — local storage access
- Defend it: Why `browser.storage.local` instead of a backend + database? What do you give up (cross-device sync, backup) and what do you gain (privacy, zero infra)? Would you make the same call for a product with paying users?
- Defend it: What's the data lifecycle — does anything ever get pruned/expired, or does it grow forever?

### `src/services/` — stats, streak, weekly aggregation
- Defend it: How exactly is a "streak" calculated — what counts as breaking it, and what's the timezone edge case (midnight boundary, UTC vs. local)?
- Defend it: Walk through how a single day's activity becomes a heatmap cell — what's the actual data transformation from raw API response to rendered color?

### Platform-specific color system (gold/blue/green)
- Defend it: Why encode "which platform" as color instead of, say, a separate row per platform? What UI decision does that force, and is it the right one?

---

## Crystal Ball (pre-commit security scanner)

### Detector engine (AST-based static rules)
- Defend it: Why AST-based analysis instead of regex/string matching on the diff? What's a concrete case regex would miss or falsely flag that AST analysis handles correctly?
- Defend it: Walk through detecting a hardcoded secret, step by step, from staged file to flagged finding — what does the AST actually look like at the point you're checking it?
- Defend it: How would you add a brand new rule (say, detecting `eval()` calls with user input)? What files change?

### Diff engine (diff-aware / changed-line filtering)
- Defend it: Why scope analysis to changed lines instead of the whole file? What legacy-code noise problem does this solve, and what does it mean you might miss (a pre-existing vulnerability in an untouched line)?

### Severity grading + commit blocking
- Defend it: Why block on HIGH/CRITICAL but not MEDIUM/LOW? Who decided that threshold and is it configurable? What's the risk of blocking too aggressively (devs just using `--no-verify` every time)?

### Formatter/reporter (oracle/dramatic/professional/minimalist tones)
- Defend it: This is a UX/polish decision, not a technical necessity — be ready to explain *why* it exists at all. What actual problem does tone-switching solve for a team adopting this tool?

### Packaging / install
- Defend it (uncomfortable one, but ask yourself this directly): the install command in your own README currently points to the wrong repo. What does that tell you about your own review process before you consider this "done," and what would you change about how you ship a README next time?

---

## General cross-project questions to expect
- "Why did you choose Django/Python here over [X]?" — have a real answer, not "it's what I know."
- "What would you change if you rebuilt this today?" — always have at least one honest answer per project.
- "What's the part of this you understand least?" — better to name it yourself than get caught not knowing.

---

## Tasks

- [ ] **project defense** — AniFlow: custom user model + AniList OAuth flow
- [ ] **project defense** — AniFlow: tracker abstraction + AniList adapter sync
- [ ] **project defense** — AniFlow: streaming source models, matchers, router, per-site adapters
- [ ] **project defense** — AniFlow: anime app (dual HTML/JSON surface, auth, CORS)
- [ ] **project defense** — AniFlow: deployment & config decisions
- [ ] **project defense** — CP-Lockin: platform API integrations (Codeforces, LeetCode)
- [ ] **project defense** — CP-Lockin: background sync orchestration
- [ ] **project defense** — CP-Lockin: local storage data lifecycle
- [ ] **project defense** — CP-Lockin: stats, streak, weekly aggregation logic
- [ ] **project defense** — CP-Lockin: platform color system rationale
- [ ] **project defense** — Crystal Ball: AST-based detector engine
- [ ] **project defense** — Crystal Ball: diff-aware changed-line filtering
- [ ] **project defense** — Crystal Ball: severity grading + commit blocking
- [ ] **project defense** — Crystal Ball: formatter/reporter tone system
- [ ] **project defense** — Crystal Ball: packaging & install
- [ ] **project defense** — cross-project questions (why Django, rebuild choices, weakest areas)