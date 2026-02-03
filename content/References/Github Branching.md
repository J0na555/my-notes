## 🧭 1. Branch Naming Convention

Use **descriptive, consistent, and lowercase-with-dashes** names.

**Format:**

```
<type>/<short-description>
```

**Common branch types:**

|Type|Purpose|
|---|---|
|`feat`|New feature|
|`fix`|Bug fix|
|`chore`|Maintenance tasks (e.g., config, dependencies)|
|`docs`|Documentation updates|
|`refactor`|Code changes that don’t affect behavior|
|`style`|UI or formatting changes|
|`test`|Adding or improving tests|
|`hotfix`|Urgent production fix|

**Examples:**

```
feat/user-auth
fix/login-bug
refactor/api-calls
docs/readme-update
chore/deploy-script
```

---

## ⚙️ 2. Branch Workflow

**Basic professional flow:**

```bash
# 1. Start from main branch
git checkout main

# 2. Make sure you’re up to date
git pull origin main

# 3. Create a new feature branch
git checkout -b feat/user-auth

# ... do your coding ...

# 4. Stage changes
git add .

# 5. Commit with a proper message
git commit -m "feat(auth): add [[🔑 JWT Auth Setup (Django + React)|JWT authentication system]]"

# 6. Push your branch
git push -u origin feat/user-auth
```

---

## 🧱 3. Commit Message Structure

Follow the **Conventional Commit format**:

```
<type>(<scope>): <short summary>
```

Optionally add a body and footer.

**Example full message:**

```
feat(auth): implement [[🔑 JWT Auth Setup (Django + React)|JWT authentication]]

Added JWT-based login and registration with token refresh.
This replaces the old session-based system.

BREAKING CHANGE: Old session middleware removed.
```

---

### 💡 Common commit types

|Type|Description|Example|
|---|---|---|
|`feat`|New feature|`feat(ui): add navbar component`|
|`fix`|Bug fix|`fix(api): correct null response on GET /users`|
|`docs`|Docs only|`docs(readme): update installation steps`|
|`style`|Formatting only|`style(css): fix alignment issue`|
|`refactor`|Code refactor|`refactor(db): simplify connection logic`|
|`test`|Add/update tests|`test(auth): add JWT validation test`|
|`chore`|Maintenance|`chore(ci): update GitHub Actions config`|

---

## 🧩 4. Commit Body Rules

✅ Keep subject line under **72 characters**  
✅ Use **imperative mood** (“add feature” not “added feature”)  
✅ Leave a blank line between subject and body  
✅ Explain _why_ the change was made, not just _what_ was done

**Example:**

```
fix(api): handle 404 errors correctly

Previously, the API returned a 500 when a user was not found.
This now returns a proper 404 with a descriptive message.
```

---

## 🔀 5. Merging Branches Like a Pro

Once your feature is ready and reviewed (or you’re working solo):

```bash
# Switch back to main
git checkout main

# Pull latest main
git pull origin main

# Merge your feature branch
git merge --no-ff feat/user-auth -m "merge: add user authentication feature"

# Push the merge
git push origin main
```

### ✨ Merge Commit Message Format

```
merge: <summary of what you merged>

<optional body>
```

**Example:**

```
merge: add user authentication feature

Includes login, registration, and token validation endpoints.
Closes #12.
```

---

## 🧹 6. After Merging

Once merged successfully:

```bash
git branch -d feat/user-auth        # delete local branch
git push origin --delete feat/user-auth  # delete remote branch
```

---

## 📘 7. Bonus: Tagging Versions (for releases)

Use semantic versioning (`MAJOR.MINOR.PATCH`):

```bash
git tag -a v1.0.0 -m "Initial stable release"
git push origin v1.0.0
```

---

## 🧠 8. Pro Tips

- Use **draft PRs** for unfinished work.

- Reference issues or tasks in commits:  
    `fix(login): resolve #42 - incorrect redirect`

- Keep commits **atomic** – one logical change per commit.

- Use `git rebase -i` to clean up messy commits before merging.

- Always pull before pushing to avoid conflicts.

---

## 📋 Example Professional Commit History

```
feat(api): add job filtering by salary range
fix(auth): correct expired token handling
refactor(models): move validation logic to separate utils
docs(readme): add setup instructions
merge: implement job filtering and auth fixes
```

---

```bash
# clean workflow of making branches 
# Always start on the latest main
git checkout main
git pull origin main

# Then create your feature branch
git checkout -b feature/new-login-system

# Make changes, commit, push
git add .
git commit -m "Add login feature"
git push origin feature/new-login-system

# When done, merge via PR (or locally if solo project)
```
