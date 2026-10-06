---
project: "ClientRadar"
repo_path: "/home/jonas/Documents/projects/ClientRadar"
ai_generated: true
generated_at: "2026-10-04T19:27:27.797Z"
commit: "3355b10"
dirty: true
dirty_count: 79
provider: "opencode"
---

> [!warning] Machine-generated. Do not edit.
> This note was written by a language model (`opencode`) from git metadata only.
> It is not your writing, it is not reviewed, and it can be wrong. The Project Tracker
> plugin overwrites this file every time you regenerate the summary.

## ClientRadar

Generated 2026-10-04T19:27:27.797Z from Commit `3355b10` on branch `feat/ai-lead-research`.
The working tree had 79 uncommitted file(s) at this point. Those changes are in no commit, so this summary describes work that exists nowhere in git history.

Source note: [[ClientRadar]]

---

## Summary

ClientRadar is a FastAPI + Next.js lead-generation tool that discovers local businesses (Google Places, Overpass, niches), geocodes and dedupes them, audits their websites, scores leads, and ships PDF reports, deployed on Render. The last commits layer an AI lead-research feature onto a mature map/discovery pipeline, going commit by commit from config and provider abstraction (Gemini + Groq) through API routes, research service, frontend client, and pages. The working tree holds 79 uncommitted files spanning that AI work plus an entirely uncommitted async worker pipeline (worker.py, object_storage, retention, pipeline models and a docs/archive directory), along with a monorepo-plan.md, so a second, larger restructuring is sitting unfinished alongside the AI feature.

## Suggested next steps

Proposed by the model, not a to-do list you agreed to.

- Split the working tree into two commits: the async worker pipeline (worker, object_storage, retention, pipeline models/API, alembic) and the AI research feature
- Decide whether monorepo-plan.md restructuring lands now or moves to its own branch, and reconcile DATA_PIPELINE.md, ai-plan.md, and ai-implementation.md with the actual code
- Run backend pytest and frontend lint locally to confirm the 79 changed files still pass the CI gate before committing
