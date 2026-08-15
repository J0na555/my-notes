---

## tags: [cpp, database, learning-plan, systems-programming] status: in-progress started: 2026-08-15
---

> Goal: understand storage engines, indexing, and query execution well enough to build a minimal but real database — not a toy that only handles one hardcoded query.

## Phase 0 — Study the references

Read/skim these before writing code. Don't over-invest here — enough to steal the right mental models, not enough to stall.

- [ ] Read [db_tutorial](https://cstack.github.io/db_tutorial/) — the file format, B-tree logic, and overall shape of a minimal DB (this is the backbone the rest of the plan follows)
- [ ] Skim [KISSDB](https://github.com/adamierymenko/kissdb) — how minimal a disk-based hash map can actually be
- [ ] Skim [GroundUpDb](https://github.com/adamfowleruk/groundupdb) or [MiniDB](https://github.com/nrthyrk/minidb) — C++-specific patterns: memory mapping, class structure for pages/buffers

**Output:** a short note (`[[db-notes]]`) on file format + page layout decisions you're stealing/adapting.

---

## Phase 1 — Interface Layer (REPL)

Build this first — it's your test harness for everything after it.

- [ ] Build a command-line REPL: read a line, dispatch it, print result or error
- [ ] Distinguish **meta-commands** (`.exit`, `.help`, etc.) from actual statements
- [ ] Basic input buffer handling (db_tutorial covers this early — `InputBuffer` / `Table` structs)

---

## Phase 2 — Storage Engine (raw file I/O)

Get data onto disk before you get clever about indexing it.

- [ ] Design a fixed-size page format (row layout, page header)
- [ ] Implement raw read/write to a data file using `std::fstream` or `mmap`
- [ ] Simple append-only insert + full-scan read to prove the format works end-to-end

---

## Phase 3 — Indexing (B+ Tree or LSM)

- [ ] Implement a B+ Tree **or** a simple LSM-tree in C++ on top of Phase 2's file I/O
- [ ] Support insert / search / (delete if B+ Tree)
- [ ] Swap your Phase 2 full-scan reads for index lookups

---

## Phase 4 — Buffer Pool Manager

Raw `fstream`/`mmap` calls on every operation don't scale — this is the bridge between your C++ objects and the disk.

- [ ] Wrap your file I/O in a class managing a fixed array of in-memory pages
- [ ] Implement pin/unpin and dirty-page tracking
- [ ] Implement a page replacement policy (start with LRU)
- [ ] Route all B+ Tree / LSM page access through the buffer pool instead of directly through `fstream`/`mmap`

---

## Phase 5 — Query Processor (Parser + Executor)

Don't write a full SQL parser. Support a deliberately small surface area first.

- [ ] **Tokenizer**: split raw input into tokens
- [ ] **Parser**: tokens → a `Statement` struct. Support only `INSERT`, `SELECT`, `UPDATE`, `DELETE`, with simple `WHERE` clauses (single equality condition is enough at first)
- [ ] **Executor**: takes a `Statement`, calls the index's insert/search/etc. via the Buffer Pool
- [ ] Translate a `SELECT` scan into iteration over B+ Tree leaf nodes (or LSM levels)

---

## Phase 6 — Durability (Write-Ahead Log)

- [ ] Append every mutation to a sequential log file **before** it touches the B+ Tree / data pages
- [ ] Write a recovery routine: on startup, replay the log to reconstruct state after a crash
- [ ] Test it — kill the process mid-write, confirm recovery actually works

---

## Phase 7 — Concurrency

- [ ] Start with a single global mutex around writes (correctness first, speed later)
- [ ] Only _after_ that works: explore fine-grained per-page latching

---

## Phase 8 — Stretch: compare against real parsers

Not for direct use early on — these are references once your hand-rolled parser feels limiting, to see how a production-grade SQL parser is structured.

- [ ] [hyrise/sql-parser](https://github.com/hyrise/sql-parser)
- [ ] [sqlparser.com C parser](https://www.sqlparser.com/sql-parser-c.php)
- [ ] [jaypipes/sqltoast](https://github.com/jaypipes/sqltoast)

---
## Related
