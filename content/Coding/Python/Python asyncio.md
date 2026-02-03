---
title: This DOES NOT run the function yet!
tags:
  - async
  - await
  - python_with_examples
date: 2026-01-26
---
**async / await** in Python is the modern, clean way (introduced in Python 3.5) to write **concurrent code** that is especially good for **I/O-bound** tasks (network requests, files, databases, APIs, waiting for responses...).

Think of it this way:

| Synchronous (normal) code                 | Asynchronous code with async/await              |
| ----------------------------------------- | ----------------------------------------------- |
| Waiting = wasting CPU time                | Waiting = **free CPU** to do other work         |
| One task at a time (like a single waiter) | Many tasks "in progress" at once (many waiters) |
| Looks simple & linear                     | Looks almost the same as sync code!             |

### The Core Mental Model (most important part)

```python
async def make_coffee():
    print("Start grinding beans...")
    await asyncio.sleep(3)          # ← pretending to wait 3 seconds
    print("Coffee is ready ☕")

# This DOES NOT run the function yet!
coro = make_coffee()
```

`async def` → creates a **coroutine** (a special kind of generator-like object)

`await` → **pause this coroutine** and let the event loop run **other coroutines** until the awaited thing is finished

You **never** run an `async def` function directly — you need an **event loop** to drive it.

### Minimal complete example

```python
import asyncio
import time

async def say_after(delay, what):
    await asyncio.sleep(delay)    # non-blocking sleep
    print(what)

async def main():
    print(f"started at {time.strftime('%X')}")

    # Option 1: sequential (takes 7 seconds)
    # await say_after(3, 'hello')
    # await say_after(4, 'world')

    # Option 2: concurrent (takes ~4 seconds)
    await asyncio.gather(
        say_after(3, 'hello'),
        say_after(4, 'world'),
    )

    print(f"finished at {time.strftime('%X')}")

# The proper way to run it (Python 3.7+)
asyncio.run(main())
```

Output (concurrent version):

```
started at 14:20:55
hello
world
finished at 14:20:59   ← only ~4 seconds instead of 7
```

### Quick comparison table – when to use what

Situation                              | Best choice in 2025–2026          | Why
---------------------------------------|------------------------------------|---------------------
Many HTTP requests / API calls        | `asyncio` + `aiohttp`              | 100–1000× faster than threads
Web servers ([[FastAPI Auth|FastAPI]], Starlette, etc.)| `async def` endpoints              | Handles thousands of connections
Reading 500 files / DB queries        | `asyncio.gather()` + async libs    | Much better than threads/processes
Heavy CPU work (image processing...)  | `ProcessPoolExecutor` or threads   | asyncio **does not help** CPU-bound
Simple script, 2–3 slow requests      | `asyncio` + `await`                | Clean & efficient
Need both sync & async code           | `anyio` or `asyncio.run_in_executor`| Bridge between worlds

### Most common modern patterns (2025 style)

```python
# 1. Run many things concurrently
async def main():
    results = await asyncio.gather(
        fetch_user(123),
        fetch_user(456),
        fetch_posts(),
        timeout=30          # optional
    )

# 2. Timeout protection (very important!)
try:
    data = await asyncio.wait_for(fetch_slow_api(), timeout=10)
except asyncio.TimeoutError:
    print("Too slow → using cache")

# 3. Sequential but still async-friendly
async def pipeline():
    user = await get_user()
    posts = await get_posts(user.id)
    comments = await get_comments([p.id for p in posts])
    return comments

# 4. Mixing with synchronous code
from concurrent.futures import ThreadPoolExecutor

async def main():
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, heavy_cpu_function, arg)
```

### One-liner mental rule

> If a function **waits** for something (network, disk, sleep, queue, database…), it should usually be `async def` and use `await` on the waiting part.

> If a function does **pure CPU work** → keep it normal (def), don't make it async.

## Related

- [[Concurrency and async,await]]
- [[Pydantic]]
- [[OOP in Python]]
- [[Python Types hints]]
