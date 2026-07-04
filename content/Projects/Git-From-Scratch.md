# Git-From-Scratch 
## 1. `init` — repo bootstrap

**Build:** create `.git/`, `.git/objects/`, `.git/refs/`, `.git/refs/heads/`, `HEAD`, `index`.

**Watch out for:**

- Don't clobber an existing `.git` — check first, or you'll wipe someone's real repo during testing.
- `HEAD` needs actual content on init: `ref: refs/heads/main` (or `master`). An empty file breaks every command that reads HEAD later.
- Decide your default branch name now (`main` vs `master`) — changing it later means migrating refs.
- Make directories with correct permissions; on some systems silent permission failures make `objects/` unwritable and every future `add`/`commit` fails with a confusing error.

---

## 2. Object model (Blob / Tree / Commit) — the foundation everything else depends on

**Build:** a base `GitObject` class, SHA-1 hashing, zlib compression, content-addressable storage under `objects/<first-2-chars>/<remaining-38-chars>`.

**Watch out for:**

- **Hash the right bytes.** Real Git hashes `"<type> <size>\0<content>"`, not raw content. If you skip the header, your hashes won't match Git's (fine for a toy project, but decide on purpose — don't discover it by accident).
- **Byte encoding matters.** Hash and store bytes, not Python strings. `str.encode()` mistakes (wrong encoding, or hashing before vs after compression) will make identical files produce different hashes on different runs.
- **Compression is separate from hashing.** Hash the raw content+header; compress _after_ hashing. Mixing the order = hashes that don't match content.
- **Object write must be idempotent.** If two files have identical content, they must produce the identical blob hash and only be stored once. Test this explicitly — it's the whole point of content-addressable storage and easy to break with naive "always write" logic.
- **Directory-splitting the hash (2/38 split)** is an optimization, not a correctness requirement — but if you add it, add it before you have hundreds of objects, or you'll write a migration script you don't need yet.

---

## 3. Blob objects — file contents

**Build:** read file → wrap as blob → hash → store.

**Watch out for:**

- Binary files vs text files: if you open files in text mode, you will corrupt binary content (images, compiled files). Read in binary mode (`rb`) always.
- Line-ending differences (CRLF vs LF) will silently change hashes if you don't decide on a normalization policy — decide now, not after your first cross-platform bug.
- Symlinks: decide explicitly whether you support them. If you don't, at least detect and reject/warn instead of reading through them and storing the target file's content by accident.

---

## 4. Staging area / index

**Build:** track which files are staged, with their blob hashes, ready for commit.

**Watch out for:**

- **Index format persistence.** If you store the index as JSON/plain text, decide the schema before you have real data in it — changing the schema later means writing a migration or breaking existing repos.
- **Staleness bugs.** If a file is staged, then edited again before commit, does `add` re-hash it? If you cache the old hash, you'll silently commit stale content. Always re-read and re-hash on `add`.
- **Directory adds.** `add src/` must recurse and stage every file inside, and must skip `.git/` itself — an easy infinite-loop / self-ingestion bug if your recursion isn't careful.
- **Removed files.** What happens when a staged file is deleted from disk before commit? Decide: error, auto-unstage, or commit a deletion. Undefined behavior here is a classic source of "commit succeeded but repo is now broken."
- **Duplicate staging.** Adding the same file twice shouldn't double an entry or produce two index rows for one path.

---

## 5. Tree objects — directory structure

**Build:** build a tree from staged paths, referencing blobs and sub-trees, storing names + modes.

**Watch out for:**

- **Nested directories require recursive tree building.** A flat "just list all staged files" approach won't reproduce Git's actual directory hierarchy — you need trees-within-trees, built bottom-up.
- **Sorting matters.** Git sorts tree entries by name (with a specific rule for directories vs files) — if your tree serialization isn't in a deterministic order, identical directory contents will hash differently between runs, breaking your content-addressing guarantee.
- **File mode/permissions.** Decide what you track (100644 normal file, 100755 executable, 040000 directory) — even a simplified version needs _some_ explicit mode, or checkout can't restore permissions correctly.
- **Empty directories.** Git doesn't track them natively — decide now whether you'll support them or explicitly document that you won't, so it's not a "discovered later" surprise.

---

## 6. Commit objects

**Build:** commit = tree hash + parent hash(es) + author + timestamp + message.

**Watch out for:**

- **Timestamp format.** Pick a format and timezone convention up front (Unix epoch + offset is simplest) — inconsistent timestamp formats break sorting for `log` later.
- **First commit has no parent.** Your commit object creation and your `log` traversal both need to handle `parent = None` without crashing.
- **Merge commits have 2+ parents.** Even if you don't implement `merge` yet, decide whether your commit format supports multiple parents from the start — retrofitting it later touches your object serialization and every command that reads commits.
- **Empty commits.** Decide whether committing with nothing staged is an error (real Git errors by default) — silent no-op commits create confusing history.
- **Author string format.** `"Name <email>"` is the convention — if you don't validate/normalize it, malformed input corrupts your commit object content and its hash.

---

## 7. Branches (refs)

**Build:** branches as files in `refs/heads/<name>` containing a commit hash; `HEAD` points at a branch (or a commit, for detached HEAD).

**Watch out for:**

- **Branch names with slashes** (`feature/login`) mean `refs/heads/` needs to support nested directories, not just flat files — a very common early bug.
- **Deleting the current branch.** Must be blocked or handled explicitly — deleting the branch HEAD points to leaves you in a broken, unrecoverable state if you don't guard it.
- **Creating a branch that already exists** should error, not silently overwrite (silent overwrite = lost commits with no warning).
- **Detached HEAD.** If you ever checkout a raw commit hash instead of a branch name, HEAD points directly at a commit. Any subsequent commit here won't move a branch — decide if you support this at all before your first user creates orphaned commits by accident.

---

## 8. `checkout` — switching branches

**Build:** update HEAD, restore working directory files to match the target commit's tree.

**Watch out for:**

- **This is your riskiest command** — it overwrites working directory files. Uncommitted changes get silently destroyed unless you explicitly check for them and warn/block, mirroring real Git's "your local changes would be overwritten" safeguard.
- **Untracked files** that exist in the target branch's tree but not the current working directory must be created; files that exist now but _not_ in the target tree must be removed — a full "reconcile working directory to tree" step, not just an overlay.
- **Partial-failure state.** If checkout fails halfway (disk full, permission error) after deleting some files but before restoring others, you can leave the working directory in a broken half-state. Decide on an ordering (write new/changed files before deleting removed ones) to minimize damage.

---

## 9. `status`

**Build:** compare working directory vs index vs last commit.

**Watch out for:**

- Three-way comparison, not two: (a) working dir vs index = "not staged", (b) index vs last commit = "staged for commit", (c) files on disk not in either = "untracked". Conflating these gives wrong/confusing output.
- Re-hashing every file on every `status` call to detect changes is correct but slow — fine for a toy project, but know that real Git uses file mtime/size caching to avoid this, and don't be surprised if your version feels sluggish on large trees.

---

## 10. `log`

**Build:** walk commit parent pointers from HEAD backward.

**Watch out for:**

- **Cycle protection.** A corrupted or hand-edited repo could create a parent cycle — an unbounded `while parent: parent = parent.parent` will infinite-loop. Guard with a visited-set even in a "shouldn't happen" case.
- **Merge commits (multiple parents)** need a defined traversal strategy (e.g., depth-first vs breadth-first vs chronological) or your history order won't make sense once you add merging.

---

## 11. General cross-cutting constraints (apply to _every_ feature above)

- **Concurrent access.** If two processes (or a script run twice) write to the index or refs at the same time, you can corrupt state — real Git uses lock files (`index.lock`). Even a naive lock file check will save you from a whole class of "why is my repo broken" bugs.
- **Path handling cross-platform.** Windows path separators (`\`) vs Unix (`/`) will break hashing consistency and tree building if you don't normalize paths before hashing.
- **Corruption recovery.** Every object read should validate (does the hash of decompressed content match the filename?) — silent corruption is worse than a crash, because it produces wrong results that look fine.
- **CLI argument parsing.** Decide your command structure (subcommands + flags) before you have 8 commands with 8 inconsistent argument styles — retrofitting consistent CLI UX later is annoying.
- **Testing against real Git.** At each stage, run the equivalent real `git` command on a throwaway repo and diff behavior. This catches assumption bugs (e.g., "I thought empty commits were fine") far earlier than building the whole thing and testing at the end.
- **Scope creep guard.** This project's value is understanding internals, not feature parity with real Git. Explicitly write down what's out of scope (merging, rebasing, remotes/push/pull, `.gitignore`, packfiles) so you don't get 80% through and start second-guessing why you're not just using real Git.

---

## Suggested build order (for reference, not a full roadmap)

1. Object model + storage (blob/tree/commit base, hashing, compression)
2. `init`
3. `add` (blob creation + index)
4. `commit` (tree building + commit object)
5. `log`
6. `status`
7. `branch` (create/list/delete)
8. `checkout` (branch switch + working dir restore)
9. Anything past this point (merge, diff, remotes) is a deliberate extension, not core.