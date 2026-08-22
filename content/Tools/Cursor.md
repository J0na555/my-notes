#  First: Mental Model (IMPORTANT)

[[Cursor]] has **3 main ways to interact**:

1. **Inline AI (edit code directly)**
2. **Command Palette AI (do something specific)**
3. **Chat with full file / selection context**

If you only use chat → you’re using 30% of Cursor.

---

# ⌨️ Core Cursor Commands (You MUST know these)

##  `Cmd + K` / `Ctrl + K` → Inline Edit (MOST IMPORTANT)

This is the **killer feature**.

### What it does

* Edits code **in place**
* Understands selected code
* Produces diffs instead of new files

### How pros use it

1. Select a block of code
2. Press `Ctrl + K`
3. Type a **specific instruction**

### Examples

* “Refactor this function to be async and add error handling”
* “Fix bug without changing function signature”
* “Optimize this query for performance”

🔥 Hackathon tip:
Always select **the smallest relevant code** before `Ctrl + K`.

---

##  `Cmd + Shift + K` / `Ctrl + Shift + K` → Generate Code

This one is for **new code**, not editing.

### Use it when:

* Creating a new file
* Writing boilerplate
* Scaffolding features

### Examples

* “Create a REST controller for comments using this model”
* “Generate a simple JWT middleware”
* “Create CRUD routes for this schema”

 Don’t use this for fixing bugs — it’ll overwrite logic.

---

##  `/` Commands in Chat (Hidden Power)

Inside Cursor chat, typing `/` gives special context commands.

Common useful ones:

* `/explain` → explain selected code
* `/fix` → try to fix selected code
* `/refactor` → clean up selected code
* `/test` → generate tests (useful but optional)
* `/doc` → generate docs/comments

Example:

1. Select code
2. Open chat
3. Type:

```
/explain
```

Cursor uses **exact selection** — no guessing.

---

##  “Ask Cursor about this file”

When chat is open and a file is active, Cursor **automatically includes it**.

### Use prompts like:

* “Is there any security issue in this file?”
* “Does this follow REST conventions?”
* “What edge cases am I missing?”

Great for sanity checks before pushing.

---

# Debugging Commands (SAVES HOURS)

## Best debugging pattern

Select:

* Error message
* Stack trace
* Relevant function

Then:
`Ctrl + K`

Prompt:

> “Explain root cause first, then propose minimal fix.”

This prevents Cursor from hallucinating fixes.

---

#  Multi-file Awareness (Use Carefully)

Cursor can reason across files **if you tell it to**.

Say:

* “Based on this model and controller…”
* “Update this service to match the API contract”

 Hackathon rule:
Don’t let Cursor refactor multiple files unless you’re confident.

---

#  Cursor for SPEED (Real Use Cases)

### 1. API scaffolding

* Models
* Controllers
* Validation schemas

### 2. Boilerplate hell

* Auth middleware
* Error handlers
* DB config

### 3. Docs & README

* Setup steps
* API docs
* Demo scripts

Cursor is terrible at:

* Core business logic
* Complex state machines
* Clever algorithms

Don’t ask it to be smart. Ask it to be fast.

---

#  Cursor Anti-Patterns (Avoid These)

* “Build my whole backend”
* Letting it rewrite entire files repeatedly
* Accepting code you don’t understand
* Using chat instead of inline edits

That’s how people lose time.

---

#  Pro Prompt Patterns (STEAL THESE)

### Minimal change

> “Modify this with minimal diff.”

### Guardrails

> “Do not change public API.”

### Hackathon mode

> “Optimize for speed, not perfection.”

### Safety-first

> “Explain before coding.”

Cursor **responds to constraints** extremely well.

---

#  My personal Cursor workflow (what I’d do in your place)

1. Scaffold backend with Cursor
2. Freeze API contract
3. Inline-edit endpoints
4. Debug with explanations first
5. Use Cursor for docs + demo script
6. Stop refactoring 6 hours before deadline
d