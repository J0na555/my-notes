---
title: Redis — Architecture & Internals
tags:
  - redis
  - database
  - systems
  - from-scratch
  - backend
source: https://youtu.be/fmT5nlEkl3U Redis Deep Dive
related-project: redis-from-scratch
date: 2026-07-11
---
# Redis — Architecture & Internals

> [!info] Why this note exists Companion note to building **Redis from scratch in Python**. Covers what Redis is, why it's built the way it is, its data structures (both the user-facing ones and what's happening underneath in C), the protocol, persistence, clustering, and the classic use-cases you'll want to be able to defend in an interview or design discussion. Built from the Hello Interview Redis deep-dive video + written breakdown, plus supplementary internals resources linked at the bottom.

---

## What Redis Actually Is

Redis calls itself a **"data structure store"**, not just a key-value cache. That distinction matters: every object in Redis is a value stored at a string key, but the _value itself_ is a real data structure (a hash, a sorted set, a stream, etc.) with its own command surface — not just an opaque blob.

Key facts:

- Written in **C**.
- Keeps the **entire working dataset in memory** — this is the single biggest reason it's fast, and also its biggest limitation (RAM is the most expensive place to store data).
- **Single-threaded command execution.** One command runs to completion before the next starts.
- Speaks a very simple **text-based wire protocol (RESP)** — close enough to what you type in `redis-cli` that the CLI feels like talking to the server directly.

> [!quote] From the Hello Interview breakdown "While many databases involve a lot of magic (optimizers, query planners, etc), Redis has remained deliberately simple and good at what it does best: executing simple operations fast."

### Why single-threaded?

This is a deliberate design choice, not a limitation someone forgot to fix:

- **No locks needed** for command execution — since only one command runs at a time, there's no race condition _within_ Redis itself for a given operation.
- For operations this cheap (microseconds each), a single core is rarely the bottleneck — the bottleneck is usually network I/O, not CPU.
- Newer Redis versions (4.0+) offload some work to background threads — e.g. lazy freeing of memory (`UNLINK`, `lazyfree-*` configs), and I/O threading for reading/writing sockets in Redis 6+ — but **command execution itself is still single-threaded and ordered**. Keep that mental model: _one command at a time, in order_, no matter what version you're on.
- This is _why_ Lua scripts and multi-step commands like `GETSET` or the lock-release pattern below are atomic "for free" — the whole script runs as one atomic unit on that single thread.

---

## The Core Data Structures (User-Facing)

|Structure|Analogy|Typical use|
|---|---|---|
|**String**|raw bytes / counter|caching a blob, counters (`INCR`)|
|**Hash**|dict/object|storing a record (`user:123` → `{name, email}`)|
|**List**|linked list|queues, recent-items feeds|
|**Set**|unordered set|unique membership (tags, unique visitors)|
|**Sorted Set (ZSet)**|priority queue|leaderboards, rate limiting windows|
|**Stream**|append-only log|event sourcing, work queues (Kafka-lite)|
|**Geospatial Index**|sorted set + geohash|proximity search|
|**Bitmap / HyperLogLog**|bit array / probabilistic counter|activity tracking, cardinality estimation|
|**Bloom Filter, JSON, Time Series**|modules → core in Redis 8|membership tests, document storage, metrics|

All of these are just **the value stored at a key**. Choosing your keys well is basically choosing your data model _and_ your sharding strategy at the same time (more on this in §5).

---

## What's Actually Underneath (Internals)

This is the part most "Redis from scratch" projects skip, but it's where the interesting engineering is. Redis picks different **internal encodings** for the same logical type depending on size, and silently upgrades between them.

### SDS — Simple Dynamic Strings

Redis doesn't use plain C strings (`char*`). Every string is an **SDS**: a struct with a length prefix, allocated capacity, and the byte buffer.

- `O(1)` length lookups (no `strlen` scanning).
- Binary-safe (can hold `\0` bytes — needed since values aren't always text).
- Amortized-growth like a `Vec`/`ArrayList`: over-allocates on append to avoid repeated reallocation.

### dict — the hash table

The core key-value store (and the backing structure for large Hashes, Sets, and the key-side lookup of ZSets) is a **hash table with chaining** (`src/dict.c`).

- On collision, entries chain via a linked list, newest-inserted at the front.
- **Incremental (lazy) rehashing**: when the load factor crosses a threshold, Redis doesn't rehash everything at once (that'd cause a latency spike). Instead it keeps _two_ hash tables (`ht[0]` and `ht[1]`), and migrates a few buckets on every read/write operation until the migration completes. This is a big "aha" moment for interviews — it's how Redis avoids O(n) stalls despite being single-threaded.
- A random hash seed is generated per-instance at boot, so bucket layout isn't predictable/repeatable across restarts (mitigates hash-flooding attacks).

### Small-collection optimizations: listpack / ziplist

For **small** hashes, lists, sets, and sorted sets, Redis avoids the overhead of a full hash table or skiplist and instead uses a **compact, contiguous memory blob** (`listpack`, the modern replacement for the older `ziplist`). It's basically a flat array of length-prefixed entries — cache-friendly, low memory overhead, and fast enough at small N because you're not paying pointer-chasing costs.

Redis **upgrades** the encoding once thresholds are crossed, and it **never downgrades** back — even if you delete elements later. Config knobs (defaults roughly):

- `hash-max-listpack-entries` (128) / `hash-max-listpack-value` (64 bytes)
- `zset-max-listpack-entries` (128) / `zset-max-listpack-value` (64 bytes)
- `set-max-intset-entries` (512) — small all-integer sets use an even more compact `intset`
- `list-max-listpack-size` — Lists use **quicklist**: a linked list _of_ listpacks, giving you list semantics without one full listpack for the whole thing.

> [!tip] Gotcha worth remembering Because Redis never reverts to the compact encoding, a hash that briefly grew huge and then shrank will _permanently_ cost more memory per element than it needed to. This has bitten real production systems (see the "Grab" postmortem linked in Resources).

### Sorted Sets — dict + skiplist, together

This is the most interesting structure to actually implement yourself. A ZSet with enough elements is stored **twice**, in two structures that share the same underlying element data:

1. A **dict** mapping member → score, for `O(1)` `ZSCORE` lookups.
2. A **skiplist** mapping score → member, kept sorted, for `O(log N)` range queries (`ZRANGE`, `ZRANGEBYSCORE`, `ZRANK`).

**Why not just one?** A hash table alone gives you O(1) lookup but no ordering. A skiplist alone gives you O(log N) ordered access but O(N) lookup-by-member. Combining them costs 2x memory but gets you the best of both — this trade-off (memory for combined time complexity) is a good thing to be able to articulate.

**Skiplist mechanics:**

- Probabilistic structure: multiple "levels" of linked lists, top level sparse, bottom level dense (contains every node).
- Level count for a new node is chosen randomly with `p = 0.25` (25% chance to promote to the next level up), capped at 64 levels.
- Search starts at the top level and moves right until it would overshoot, then drops a level — skipping large chunks of the list each time, giving `O(log N)` search without any tree-rebalancing logic (no rotations like AVL/Red-Black trees — nodes are never moved once inserted).
- The bottom level acts as a doubly-linked list (`backward` pointer), which is what makes `ZREVRANGE` cheap.

### Object encoding — inspect it yourself

Every key's `OBJECT ENCODING` command tells you which internal representation is active — genuinely useful while building your own clone, to sanity-check against real Redis:

```
ZADD leaderboard 100 alice 200 bob
OBJECT ENCODING leaderboard   # "listpack"
# ...add 200 more members...
OBJECT ENCODING leaderboard   # "skiplist"
```

---

## The Protocol — RESP

Redis speaks **RESP** (REdis Serialization Protocol) over plain TCP. It's deliberately simple: request/response, human-readable-ish, minimal parsing overhead.

```
SET foo 1
GET foo     # -> 1
INCR foo    # -> 2
XADD mystream * name Sara surname OConnor
```

For a from-scratch build, the core things to implement are:

1. **A TCP server + event loop** (this is where you learn about `select`/`epoll`/`asyncio`, since real Redis uses an event loop, not a thread-per-connection model — consistent with the single-threaded design above).
2. **A RESP parser** — parsing the wire format (simple strings `+`, errors `-`, integers `:`, bulk strings `$`, arrays `*`, and in RESP3, additional types like maps/booleans/doubles).
3. **A RESP serializer** — encoding your responses back into the same format.
4. **A command dispatcher** — mapping parsed commands (`SET`, `GET`, `EXPIRE`, ...) to handlers against your in-memory store.
5. **Expiry handling** — both passive (check TTL on read) and active (a background sweep of a random sample of keys with TTLs, similar to real Redis).
6. Optionally: **RDB file parsing** (binary snapshot format) and **replication** (`PSYNC`/`REPLCONF`) if you want to go further, as some of the community solutions below do.

This progression (TCP → RESP → commands → expiry → persistence → replication) mirrors how the CodeCrafters "Build Your Own Redis" course is staged — worth using as a checklist even if you're not doing the paid course.

---

## Infrastructure: Single Node, Replication, Cluster

### Single node

Simplest deployment — one process, in-memory, optionally persisting to disk.

### High availability (replica)

- **Replication is asynchronous.** The primary acknowledges your write _before_ the replica has seen it.
- Consequence: if the primary dies right after ack'ing a write, and a replica gets promoted, that write can simply vanish. This is the core reason **Redis is not a system of record** — don't treat it as your source of truth for data you can't afford to lose.

### Cluster (sharding)

- Every key hashes into one of **16,384 hash slots**; each node owns a subset of slots.
- Clients **cache the slot → node mapping** locally and compute which node to hit before sending a command (like a phone book). If a slot has moved (rebalance/failover), the server replies `MOVED` and the client refreshes its map.
- Nodes gossip cluster state to each other so every node knows the full slot map — but a node **will not forward** your request for you; that's the client's job.
- **Redis expects all data for a given request to live on one node.** There are no cross-node joins or scatter-gather queries built in. This means: **your key design _is_ your scaling strategy.**
- **Hash tags**: wrap the part of the key you want hashed in `{braces}` so related keys land on the same slot — e.g. `{user:123}:posts` and `{user:123}:likes` always co-locate, enabling multi-key transactions (`MULTI`) across them.

---

## Persistence & Durability

Redis has **two persistence modes**, both opt-in trade-offs against speed:

|Mode|How it works|Failure mode|
|---|---|---|
|**RDB**|Periodic point-in-time snapshots of the whole dataset|A crash loses everything since the last snapshot|
|**AOF**|Logs every write command|Default `fsync` is once per second → up to 1s of acknowledged writes can be lost on crash|

You _can_ configure AOF to `fsync` on every write for maximum durability, but almost nobody does, because it costs the speed Redis is chosen for in the first place. This is an intentional design trade-off — Redis does **not** give you the "commit is on disk" guarantee a relational database gives by default. If you need that, look at something like **AWS MemoryDB**, which trades a bit of speed for real durability.

**Takeaway for your own implementation:** even a toy "save to disk periodically" feature teaches you the RDB half of this trade-off directly.

---

## Performance Numbers (rough, useful for back-of-envelope reasoning)

- A single Redis node: roughly **100k writes/sec**.
- Command execution itself: **microseconds**.
- Network round-trip for a read: **sub-millisecond**.
- This speed makes some anti-patterns tolerable that would be ruinous elsewhere — e.g. N+1 query patterns are catastrophic against SQL but survivable (if not ideal) against Redis, since each extra round trip only costs microseconds server-side. Pipelining / `MGET` still beats doing it one at a time.

---

## Classic Use Cases (and how they map to structures)

### Cache

The obvious one. Cache key = Redis key, cached value = Redis value (often a Hash for structured objects, e.g. `product:123` → `{name, price, inventoryCount}`).

- Set a **TTL** per key — Redis guarantees you never read past expiry.
- TTL handles _staleness_, not _memory pressure_. By default Redis **rejects writes once memory is full** — you need an eviction policy like `allkeys-lru` to actually free space, and Redis approximates LRU via sampling (not exact) because exact LRU tracking would cost too much memory/CPU for the benefit.

### Distributed Lock

```
SET lock:concert:343 my-token NX EX 30
```

- `NX` → only succeeds if the key doesn't exist (that's your lock acquisition).
- `EX 30` → auto-expiry so a crashed holder doesn't lock forever.
- `my-token` → a random value unique to the acquirer, needed for safe release.

**Releasing safely** requires a check-then-delete as one atomic Lua script (never a blind `DEL`, since your lock might have already expired and been re-acquired by someone else):



```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
end
```

This is **pessimistic locking** (you grab the lock before doing work) — contrast with Redis's optimistic option: `WATCH` a key + `MULTI`/`EXEC`, where the transaction aborts if the watched key changed.

**Known weakness:** because replication is async (§5), a primary can grant a lock and die before the replica knows about it — the promoted replica can then grant the _same_ lock to someone else. The **Redlock algorithm** (majority-of-nodes locking) exists to address this but is genuinely controversial — see Martin Kleppmann's critique in Resources. The standard fix for real correctness is a **fencing token** (a monotonically increasing number attached to each lock grant, checked/rejected by the resource itself) — something Redis doesn't provide natively.

> [!warning] Mental model Treat a Redis lock as an _efficiency_ tool that occasionally fails, not a correctness guarantee. If a stale lock holder corrupting data would be catastrophic, enforce the invariant at the data layer (`SELECT ... FOR UPDATE`, conditional `UPDATE ... WHERE version = X`) or use a real consensus system (ZooKeeper, etcd).

### Leaderboards

Sorted Sets are the natural fit — `O(log N)` insert/update, ordered range queries for free.

```
ZADD tiger_posts 500 "SomeId1"
ZREMRANGEBYRANK tiger_posts 0 -6   # keep only top 5 (negative index = from bottom)
```

`ZADD` on an existing member just updates its score and re-sorts — no need to remove-then-readd.

### Rate Limiting

**Fixed window** — increment a counter per window, expire it once:

```lua
-- pseudo: run as one atomic Lua script
local count = redis.call("INCR", KEYS[1])
if count == 1 then redis.call("EXPIRE", KEYS[1], window_seconds) end
return count
```

The "set expiry only on the first increment" detail matters — calling `EXPIRE` on _every_ request keeps pushing the window forward, and steady traffic never resets.

**Sliding window** — use a Sorted Set per user, timestamp as score:

1. `ZREMRANGEBYSCORE` — drop entries older than the window
2. `ZCARD` — count what's left
3. If under the limit, `ZADD` the new request All three as one Lua script, for atomicity.

### Proximity Search (Geospatial)

```
GEOADD key longitude latitude member
GEOSEARCH key FROMLONLAT longitude latitude BYRADIUS radius unit
```

Under the hood: coordinates are encoded into **geohashes** and stored in a Sorted Set. Search runs in `O(N + log M)` — `N` candidates from the grid-aligned bounding box (imprecise, since geohash cells are square), then a second pass filters down to the `M` items actually within the radius.

### Event Sourcing — Streams

Append-only log, similar to Kafka topics.

- `XADD` to append, `XREADGROUP`/`XCLAIM`/`XAUTOCLAIM` for consumer-group coordination.
- Each pending (unacked) entry has an idle timer; if a worker dies mid-task, another worker can `XCLAIM` it after the idle threshold — meaning **at-least-once delivery**, so processing must be idempotent.
- Choose Streams over Kafka when the queue is modest and you already have Redis in your stack. Choose Kafka when you need long retention, replay for many independent consumer groups, or durability guarantees Redis's persistence trade-offs (§6) can't give you.

### Pub/Sub

```
PUBLISH channel message
SUBSCRIBE channel
```

- **At-most-once delivery** — a channel only exists while it has subscribers; offline subscribers simply miss messages (no replay, unlike Streams).
- **Connection overhead is per-node, not per-channel** — a subscriber holds one connection per node and gets everything it's subscribed to over that one connection. Don't fall into the "let's roll our own pub/sub with a set of subscriber addresses per topic" trap — it adds an extra network hop per message and requires you to build your own liveness/heartbeat tracking that Redis already gives you for free.
- Since Redis 7, **sharded Pub/Sub** (`SPUBLISH`/`SSUBSCRIBE`) routes each channel to the node owning its slot, so — unlike classic cluster pub/sub, which broadcast to every node — capacity now actually scales with the cluster.

---

## Shortcomings & When _Not_ to Use Redis

- **Not a system of record.** Async replication (§5) + persistence trade-offs (§6) mean acknowledged writes can be lost.
- **Working set must fit in RAM economically.** Memory is the most expensive place to store data — don't reach for Redis if your dataset is huge and mostly cold.
- **No query flexibility.** No joins, no cross-key queries. In cluster mode, multi-key operations only work within a single hash slot (hash tags aside).
- **Not for durable, replayable, long-retention, many-consumer-group streaming** — that's Kafka's job.

### Hot Key Problem

Uneven load across keys — one item suddenly goes viral and its traffic alone matches the rest of the cluster combined — overwhelms the single node that owns that key's slot. Remediations, each with trade-offs:

1. **Client-side caching** — app servers keep a small local cache of hot items; trades staleness (bounded by TTL) for load reduction.
2. **Key copies** — duplicate the hot key under several suffixed keys (`product:123:1`...`product:123:10`) so they land on different slots/nodes; readers pick a random suffix. Writes now have to fan out to all copies.
3. **Read replicas** — multiplies read capacity, _if_ your client is actually configured to read from replicas (many aren't, by default). Does nothing for a write-hot key, since writes still land on the single primary owning that slot.

---

## Things That Went Into the Design (the "why" behind the "what")

- **Simplicity over magic**: no query planner, no optimizer — you reason about cost the same way you'd reason about the cost of a data structure operation in any language, which is exactly why Redis is so easy to hold in your head compared to a full RDBMS.
- **Speed as the top-level constraint**: nearly every other design decision (single-threaded execution, in-memory-first, async replication, sampled LRU, lazy AOF fsync) is downstream of "don't slow down the hot path."
- **Composable primitives over built-in solutions**: Redis Cluster hands you hash slots and hash tags rather than solving distributed transactions for you — you're expected to design your key scheme to make your access patterns single-node. This mirrors Redis's whole philosophy: give you fast, simple primitives, let you compose the system-level guarantees yourself.
- **Encoding upgrades are permanent, one-directional**: an optimization for the common case (few elements, small values) that trades a bit of extra memory later for simplicity now — no defragmentation/downgrade logic to maintain.

---

## Build-Your-Own-Redis Checklist (mapping theory → your project)

- [x]  TCP server + event loop (single-threaded dispatch, matching Redis's real model)
- [x]  RESP parser (simple strings, errors, integers, bulk strings, arrays)
- [x]  RESP serializer
- [x]  In-memory key-value store (start with a plain dict — you can later simulate incremental rehashing for fun)
- [x]  Core commands: `PING`, `ECHO`, `SET`/`GET`, `DEL`, `EXISTS`, `EXPIRE`/`TTL`
- [x]  Passive + active expiry sweep
- [ ]  List commands (`RPUSH`/`LPUSH`/`LPOP`/`BLPOP` — blocking commands are a good exercise in your event loop design)
- [ ]  Hash commands (`HSET`/`HGET`/`HGETALL`)
- [ ]  Sorted Set — implement a skiplist yourself; this is the single best internals exercise in the whole project
- [ ]  Transactions (`MULTI`/`EXEC`/`WATCH`) — optimistic concurrency control
- [ ]  Pub/Sub (`PUBLISH`/`SUBSCRIBE`)
- [ ]  Persistence — start with a naive periodic full-dump (RDB-lite), then maybe an append-only log (AOF-lite)
- [ ]  RDB file _parsing_ (load real Redis's binary snapshot format) — stretch goal
- [ ]  Replication (`REPLCONF`/`PSYNC`, command propagation) — stretch goal, this is where ryan-gang's repo below is a good reference

---

## Resources

### Video (source of this note)

- **Redis Deep Dive w/ Ex-Meta Senior Manager** — Hello Interview (YouTube): [https://youtu.be/fmT5nlEkl3U](https://youtu.be/fmT5nlEkl3U)
- Full written companion breakdown: [https://www.hellointerview.com/learn/system-design/deep-dives/redis](https://www.hellointerview.com/learn/system-design/deep-dives/redis)

### Official docs

- Redis docs home: [https://redis.io/docs/latest/](https://redis.io/docs/latest/)
- Full command reference: [https://redis.io/commands/](https://redis.io/commands/)
- RESP protocol spec: [https://redis.io/docs/latest/develop/reference/protocol-spec/](https://redis.io/docs/latest/develop/reference/protocol-spec/)
- Persistence (RDB/AOF): [https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- Distributed locks / Redlock: [https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- Redis source (C): [https://github.com/redis/redis](https://github.com/redis/redis) — start with `src/dict.c`, `src/t_zset.c`, `src/sds.c`

### "Build your own Redis" — practical builds

- CodeCrafters "Build Your Own Redis" course (Python/Go/Rust/etc, TCP → RESP → RDB → replication, staged challenges): [https://app.codecrafters.io/courses/redis/overview](https://app.codecrafters.io/courses/redis/overview)
- Challenge definition repo (stage specs, if you want to build without paying for the platform): [https://github.com/codecrafters-io/build-your-own-redis](https://github.com/codecrafters-io/build-your-own-redis)
- `ryan-gang/build-your-own-redis` (Python; RESP parser/serializer, RDB parser, replication/PSYNC — good reference for the stretch goals): [https://github.com/ryan-gang/build-your-own-redis](https://github.com/ryan-gang/build-your-own-redis)
- `MohaIfk/codecrafters-redis-python` (Python; PING/ECHO/SET/GET/lists/BLPOP): [https://github.com/MohaIfk/codecrafters-redis-python](https://github.com/MohaIfk/codecrafters-redis-python)

### Internals deep dives

- **zpoint/Redis-Internals** — annotated walkthrough of the actual C source for dict, ziplist/listpack, zset/skiplist, sds, etc. (this is the best single resource for "what's actually in the C code"): [https://github.com/zpoint/Redis-Internals](https://github.com/zpoint/Redis-Internals)
    - Hash internals + incremental rehashing: [https://github.com/zpoint/Redis-Internals/blob/5.0/Object/hash/hash.md](https://github.com/zpoint/Redis-Internals/blob/5.0/Object/hash/hash.md)
    - ZSet / skiplist internals: [https://github.com/zpoint/Redis-Internals/blob/5.0/Object/zset/zset.md](https://github.com/zpoint/Redis-Internals/blob/5.0/Object/zset/zset.md)
- "Deep Dive into Redis ZSet Internals" (Medium, ziplist vs skiplist walkthrough with diagrams): [https://sam-wei.medium.com/deep-dive-into-redis-zset-internals-8d10fa1f674c](https://sam-wei.medium.com/deep-dive-into-redis-zset-internals-8d10fa1f674c)
- "Redis internal: Understand underlying data structures used in Redis" (SDS, quicklist, encoding-upgrade gotchas incl. the Grab incident): [https://blog.hieunt.me/blog/redis-internal-understand-underlying-data-structures-used-in-redis](https://blog.hieunt.me/blog/redis-internal-understand-underlying-data-structures-used-in-redis)
- "How Redis Sorted Sets Work Internally" (listpack/skiplist thresholds, tuning): [https://oneuptime.com/blog/post/2026-03-31-redis-sorted-sets-work-internally-skiplist/view](https://oneuptime.com/blog/post/2026-03-31-redis-sorted-sets-work-internally-skiplist/view)

### System design context (for interview-style "why Redis here" reasoning)

- Hello Interview — Distributed Cache design breakdown: [https://www.hellointerview.com/learn/system-design/problem-breakdowns/distributed-cache](https://www.hellointerview.com/learn/system-design/problem-breakdowns/distributed-cache)
- Hello Interview — Caching core concept: [https://www.hellointerview.com/learn/system-design/core-concepts/caching](https://www.hellointerview.com/learn/system-design/core-concepts/caching)
- Martin Kleppmann — "How to do distributed locking" (the Redlock critique): [https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)

### Client library (Python)

- `redis-py` (official Python client — useful to compare your from-scratch API against a real client's expectations): [https://pypi.org/project/redis/](https://pypi.org/project/redis/)

---

## Open Questions to Chase Down While Building

- How does your event loop handle a `BLPOP` that has to block a client without blocking the whole server?
- What happens in your implementation if two clients race to `SET ... NX` at literally the same moment — does your single-threaded dispatch already make this safe, or did you accidentally introduce concurrency?
- If you implement expiry, are you doing it passively (lazy, on read) only, or also actively sweeping — and what's the cost/trade-off of each?
- If you get to replication: what does _your_ clone do when a "replica" misses a write — does it just silently diverge, like real Redis's async replication allows?