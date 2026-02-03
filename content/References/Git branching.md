---
title: fix it, test
tags:
  - brach
  - git
  - github
date: 2025-09-07
---

## **1. Initial Setup**

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Now `main` is your **stable branch**.

---

## **2. Create a Branch for Each App**

### **Step 1: Create & Switch**

```bash
git checkout -b feature/app1
```

* `feature/` prefix = new feature
* `app1` = what you’re working on

### **Step 2: Build the App**

* Create [[Intro to Django#Models|models]], [[Intro to Django#Views|views]], [[Intro to Django#Templates|templates]], [[Intro to Django#URLs|URLs]], etc.
* Run and test locally until working.

### **Step 3: Commit Regularly**

Use clear commit messages:

```bash
git add .
git commit -m "app1: added models and migrations"
git commit -m "app1: created views and templates"
git commit -m "app1: integrated URLs into project"
```

Format:
`<app-name>: <what you did>`

---

## **3. Merge Back to Main**

Once `app1` works:

```bash
git checkout main
git merge feature/app1
git push origin main
```

Delete branch (optional cleanup):

```bash
git branch -d feature/app1
```

---

## **4. Start Next App**

```bash
git checkout -b fix:navbar
```

Repeat:

* Build → Commit → Merge → Push

---

## **5. Handling Bugs or Fixes**

Found a bug in `app1` after merging?

```bash
git checkout -b fix/app1-bug
# fix it, test
git commit -m "fix(app1): resolved bug with login"
git checkout main
git merge fix/app1-bug
git push origin main
git branch -d fix/app1-bug
```

---
  
## **6. Final Structure**

Your Git history will look clean:

```
main
  ├─ feature/app1 (merged)
  ├─ feature/app2 (merged)
  ├─ fix/app1-bug (merged)
```

---

## **Best Practices**

* **Keep `main` always working.** Never break it.
* **Commit small, meaningful changes.** Not just "stuff".
* **Use prefixes** (`feature/`, `fix/`) to keep things organized.
* **Merge only when tested**. This avoids breaking the project.

---
