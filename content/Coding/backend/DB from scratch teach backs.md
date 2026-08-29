---
title: DB from scratch teach backs
date: 2026-08-26
tags:
  - database
  - cpp
  - from-scratch
type: note
status: draft
source:
publish: "false"
---
# Why B+ Trees instead of B-trees?

A classic B-tree stores key + full row data at every level  internal nodes included. 
A B+ tree moves all data into the leaves; internal nodes hold only keys used for routing.

Three consequences fall out of that single choice:

- **Fan-out.** An internal node page (say 4KB) can only fit so many entries. If each entry carries a full row payload, you fit few → shallow-ish tree becomes deep → more disk reads per lookup. Keys-only internal nodes pack hundreds of entries per page → tree of millions of rows is 3–4 levels deep → lookup costs 3–4 page reads, ever.
- **Range scans**. B+ tree leaves are chained together with sibling pointers. A scan from key A to key Z is: find leaf containing A, then walk right through siblings. No re-traversal through the tree between leaves. In a B-tree, an ordered scan is an in-order traversal constantly bouncing up and down levels.
- **Predictability.** Every lookup in a B+ tree travels exactly root-to-leaf, same depth always. B-tree lookups can terminate early at an internal node, making performance harder to reason about.
Cost you accept: keys get duplicated (the routing key also lives in a leaf), and splits touch two structures. Worth it.

# Why is the page — not the row, not the byte — the unit of everything?

Because of how disks work. Reading one byte from disk costs roughly the same as reading 4KB, the seek/latency dominates, not the transfer. So if you're paying for a read anyway, read a chunk. The chunk size is the page.

Once that's fixed, everything else inherits the same unit:

- **Buffer pool** caches frames, and each frame holds exactly one page.
- **Latching/locking** grabs a page while mutating it.
- **WAL recovery** replays changes against pages.
- **B+ Tree nodes** are sized to fit exactly one page, one node = one read.

One abstraction, four consumers. If layers above operated on bytes or individual rows directly, you'd have no coherent way to say "cache this," "lock this," or "recover this." The page is the contract between memory and disk.
# What do pin/unpin + dirty-flag solve, and what breaks if a pin leaks?

Two separate problems:

**Pin count** solves: the pool wants to evict a page that someone is actively using. Imagine the B+ Tree fetched a page and is halfway through splitting a node — if the pool evicts that frame to serve another request, the split corrupts. fetch_page pins ("nobody may evict this"), unpin_page releases the claimB. Eviction is only legal when pin count is zero.
Dirty flag solves: does this frame still match what's on disk? Modified in memory → dirty → must be written back before its frame is reused. Untouched → clean → evict by just dropping it, zero I/O. Without dirty tracking you either write every page back (wasteful) or risk losing writes (fatal).
Pin leak: some code path fetches a page, hits an early return/error, never unpins. Nothing fails at leak time — that's why it's silent. Later, pin count stays ≥1 forever, LRU permanently skips that frame, the pool slowly runs out of evictable frames, and eventually every fetch stalls. The bug appears far away from its cause. This is why Phase 4's testing rule exists: run more inserts than the pool holds frames, force eviction, watch correctness.
# Why must the WAL record be durable before the page mutation?
It's about which failure orderings remain survivable. Two scenarios, crash between both steps:
- Log first: log is on disk, page not yet updated. Restart → replay redoes the change. Consistent.
- Page first: page mutated, log record not yet durable. Restart → the change happened but no record of it exists. You cannot detect it, cannot undo it, cannot redo it. Corrupted state, silently.
So "log before page" isn't bureaucracy — it's the ordering that makes every possible crash point recoverable. And note "durable" means actually on disk (fsync), not handed to the OS cache — otherwise your "durable" record evaporates with the power.
Side effect you get free: the log is sequential appends, which disks love, versus random page writes, which they hate. Databases aren't fast despite the WAL; they're partly fast because of it.