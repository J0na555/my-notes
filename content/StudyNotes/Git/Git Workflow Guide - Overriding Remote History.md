# Git Workflow Guide — Overriding Remote History

> **Purpose**: Real-world scenarios for syncing local and remote branches when history diverges.

---

## The Mental Model

```
Remote (origin/main):  A --- B --- C --- D
                                         ↑ HEAD
Local (main):          A --- B --- C --- E --- F
                                         ↑ our changes
```

- Local commits `E` and `F` exist but the remote has a commit `D` you don't have.
- To push, you must integrate `D` somehow and get the final state to HEAD.

---

## Scenario 1: Local Uncommitted Changes + Remote Has New Commits

**What happened**: You pulled a branch, made local edits (not yet committed), and someone else pushed a commit before you. Now you want to push your changes on top of everything.

**Commands**:

```bash
# 1. See what's different
git fetch origin
git log --oneline main..origin/main       # what remote has that you don't
git log --oneline origin/main..main       # what you have that remote doesn't

# 2. Stage and commit your local changes
git add <files>
git commit -m "fix: description of changes"

# 3. Pull the remote changes (creates a merge commit)
git pull origin main

# 4. Resolve any conflicts, then
git push origin main
```

**What happens**:

```
Before:   A --- B --- C (local HEAD)
                \
                 D (origin/main)

After pull:   A --- B --- C --- E --- F (merge commit)
                     \         /
                      D ------'
                      
After push: origin/main now has the merge commit
```

**Risks**: Merge commits add a non-linear history. If conflicts arise, resolve them manually in the conflicted files, stage, then `git commit` (git auto-generates the merge message).

---

## Scenario 2: You Have Unpushed Commits + Remote Has New Commits (Rebase)

**When to use**: You want a clean, linear history without merge commits.

```bash
# 1. Fetch remote
git fetch origin

# 2. Rebase your commits on top of remote
git rebase origin/main

# 3. Resolve conflicts if they appear
#    After resolving each conflicted file:
git add <file>
git rebase --continue

# 4. Push (may need --force-with-lease if you already pushed earlier)
git push origin main
```

**What happens**:

```
Before:   A --- B --- C (your commits)
                \
                 D (origin/main)

After rebase:   A --- D --- B' --- C'
                              ↑ your commits rewritten on top
```

**Why `--force-with-lease` instead of `--force`**:
- `--force` blindly overwrites whatever is on remote
- `--force-with-lease` checks if someone else pushed since you last fetched — safer

> [!warning] Never rebase commits that others have already pulled
> Rebasing rewrites commit history. If someone else built work on your old commits, their history will break.

---

## Scenario 3: You Want to Completely Replace Remote HEAD With Your Local State

**When to use**: The remote state is broken and you want to overwrite it entirely with your local version.

```bash
# 1. Fetch and examine the difference
git fetch origin
git log --oneline origin/main..main       # what you have extra

# 2. Option A: Soft reset (keeps your changes staged)
#    This moves the branch pointer but keeps all your files as-is.
#    Useful if you want to squash or re-commit.
git reset --soft <base-commit-hash>
git commit -m "new consolidated commit"

# 3. Option B: Hard reset (discards remote changes entirely)
#    ⚠️ This discards the remote's commits from your local history
git reset --hard <your-desired-commit>
#    Then force push
git push --force-with-lease origin main
```

**What this looks like**:

```
Remote:   A --- B --- C --- D (broken)
Local:    A --- B --- C --- E --- F (working)

After reset --hard to F + force push:
Remote:   A --- B --- C --- E --- F
```

> [!danger] Force pushing rewrites shared history
> Only do this on branches where you're the sole contributor, or communicate with the team first. Everyone else will need to `git fetch --force` and reset their local branch.

---

## Scenario 4: You Want to Undo a Specific Remote Commit (Revert)

**When to use**: A commit is already on the shared remote branch and others may have pulled it. You want to undo its changes safely.

```bash
# Revert creates a NEW commit that undoes the target commit
git revert <commit-hash>
git push origin main
```

**Why this over reset**:

| Approach | Effect on History | Safe for Shared Branches? |
|----------|------------------|---------------------------|
| `git revert` | Adds a new commit (history grows) | ✅ Yes |
| `git reset --hard` | Deletes commits from history | ❌ No (rewrites) |

**What the revert commit looks like**:

```
Before:   A --- B --- C
                       ↑ introduces a bug

After revert:   A --- B --- C --- D
                                  ↑ D is "Revert C" — C's changes are undone
                                  but C still exists in history
```

This is exactly what the remote had — commit `70d6b6b Revert "fix: fix admin dashboard"` was a revert of `062bffb`.

---

## Scenario 5: Cherry-Pick — You Only Want Specific Changes From Another Branch

**When to use**: A fix was committed on `dev` but you only need that one fix on `main`, not the entire branch.

```bash
# 1. Find the commit hash on the source branch
git log dev --oneline

# 2. Cherry-pick it onto your current branch
git checkout main
git cherry-pick <commit-hash>

# 3. Resolve conflicts if any, then
git push origin main
```

**What this looks like**:

```
Dev:      A --- B --- C (cherry-pick B)
                      
Main:     D --- E --- B'
                      ↑ B' has the same changes but a new hash
```

> [!tip] Cherry-pick creates a new commit hash
> The changes are the same, but the commit ID is different. This can cause confusion if the same fix is cherry-picked twice.

---

## Scenario 6: Stashing — You're Not Ready to Commit But Need to Pull

**When to use**: You have uncommitted local changes and need to pull remote changes (or switch branches) without losing your work.

```bash
# 1. Save your work-in-progress
git stash -u      # -u includes untracked files

# 2. Pull or switch branches
git pull origin main

# 3. Reapply your stashed work
git stash pop     # applies and removes the stash

# 4. If conflicts occur, resolve them manually
```

**Multiple stashes**:
```bash
git stash list                    # list all stashes
git stash save "description"      # named stash
git stash apply stash@{2}         # apply specific stash without removing
git stash drop stash@{2}          # remove specific stash
```

---

## Scenario 7: The Exact Workflow We Just Did

For reference, here's exactly what was done:

```bash
# 1. Check state
git status --short                # see modified files
git fetch origin                  # see what's on remote
git log --oneline main..origin/main   # remote has 1 new commit (revert)
git log --oneline origin/main..main   # we have no commits ahead

# 2. Add untracked test images to .gitignore
echo "backend/assets/images/destination/" >> .gitignore
echo "backend/assets/images/custom/gallery/" >> .gitignore

# 3. Stage and commit our changes
git add <all-modified-files>
git commit -m "fix: description of our changes"

# 4. Pull remote (auto-merged — no conflicts)
git pull origin main

# 5. Push to remote
git push origin main
```

**Result**:
```
Local commit:  0dac09e (our fix)
Remote commit: 70d6b6b (revert of old commit)
Merge commit:  666e6f4 (our fix + revert combined)
HEAD:          666e6f4 → now on remote
```

---

## Quick Reference

| Goal | Command | Safe for Shared Branches? |
|------|---------|--------------------------|
| See remote changes | `git fetch origin` | ✅ |
| See what's different | `git log --oneline main..origin/main` | ✅ |
| Undo a remote commit safely | `git revert <hash>` | ✅ |
| Get remote changes, keep history linear | `git pull --rebase` | ⚠️ (only if not yet pushed) |
| Get remote changes, accept merge | `git pull` (default) | ✅ |
| Overwrite remote entirely | `git push --force-with-lease` | ❌ |
| Take one commit from another branch | `git cherry-pick <hash>` | ✅ |
| Save work without committing | `git stash -u` | ✅ |
| Discard local changes | `git restore <file>` | ✅ |
| See commit graph | `git log --graph --oneline --all` | ✅ |

---

## Related Notes in This Vault

- [[Git Branching Strategies]]
- [[Resolving Merge Conflicts]]
