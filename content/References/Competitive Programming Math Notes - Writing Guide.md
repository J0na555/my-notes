---
title: Competitive Programming Math Notes Guide
tags:
  - CP
  - math
  - note-taking
date: 2026-02-18
type: Guide
status: draft
source: chatgpt
---
## 1. Core Philosophy (Important)

When writing CP math notes:

- prioritize clarity over beauty
- formulas must be scannable
- examples must be runnable mentally
- each topic should be self-contained
- avoid long paragraphs
- always show the closed form

Think like this:

> “If I forget this during a contest, can I recover in 10 seconds?”

If not → rewrite the note.

---

# 2. Basic Obsidian Math Syntax

## Inline math

Use for small expressions inside text.

```
The complexity is $O(n \log n)$.
```

---

## Block math (use this for formulas)

Always prefer block math for identities.

```
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

Rule:

- inline → small symbols
- block → important formulas

---

# 3. Recommended Note Structure

For every math topic, use this structure:

```
# Topic Name

## Idea
(short intuition)

## Formula
(main identities)

## Example
(concrete numbers)

## CP Usage
(when it appears in problems)

## Notes
(edge cases / tricks)
```

This structure is extremely effective for revision.

---

# 4. Example: Sum Formulas (Model Note)

You can copy this style directly.

---

## Sum Formulas

### Idea

Many summations of the form

$$  
\sum_{x=1}^{n} x^k  
$$

have closed-form polynomial expressions of degree (k+1).  
These formulas are heavily used in time complexity analysis and counting problems.

---

### Core Formulas

**Sum of first n integers**

$$  
\sum_{x=1}^{n} x = 1 + 2 + \dots + n = \frac{n(n+1)}{2}  
$$

**Sum of squares**

$$  
\sum_{x=1}^{n} x^2 = \frac{n(n+1)(2n+1)}{6}  
$$

**Sum of cubes**

$$  
\sum_{x=1}^{n} x^3 = \left(\frac{n(n+1)}{2}\right)^2  
$$

---

### Example

Compute:

$$  
\sum_{x=1}^{5} x  
$$

Using the formula:

$$  
\frac{5 \cdot 6}{2} = 15  
$$

---

### CP Usage

Common when:

- nested loop analysis
- prefix sum reasoning
- counting pairs
- combinatorics simplification

---

### Notes

- Always reduce to closed form when possible.
- Prevent overflow using `long long` in C++.
- Often appears in problems with arithmetic progressions.

---

# 5. Example: Arithmetic Progression

---

## Arithmetic Progression

### Definition

An arithmetic progression (AP) is a sequence where the difference between consecutive terms is constant.

General form:

$$  
a,\ a+d,\ a+2d,\ \dots  
$$

---

### Sum of First n Terms

$$  
S_n = \frac{n}{2}\left(2a + (n-1)d\right)  
$$

Alternative form:

$$  
S_n = \frac{n(a + l)}{2}  
$$

where (l) is the last term.

---

### Example

Sequence: (2, 5, 8, 11, 14)

- (a = 2)
- (d = 3)
- (n = 5)

$$  
S_5 = \frac{5}{2}(2\cdot2 + 4\cdot3) = 40  
$$

---

### CP Usage

Shows up in:
    
- pattern construction
- greedy math problems

---

# 6. Example: Set Theory Note Style

---

## Set Theory

### Basic Definitions

A set is a collection of distinct elements.

Notation:

- membership: (x \in A)
- not in: (x \notin A)
- subset: (A \subseteq B)

---

### Important Operations

**Union**

$$  
A \cup B  
$$

**Intersection**

$$  
A \cap B  
$$

**Difference**

$$  
A \setminus B  
$$

---

### Inclusion–Exclusion Principle

For two sets:

$$  
|A \cup B| = |A| + |B| - |A \cap B|  
$$

For three sets:

$$  
|A \cup B \cup C|  
= |A| + |B| + |C|

- |A \cap B|
    
- |A \cap C|
    
- |B \cap C|
    

- |A \cap B \cap C|  
    $$
    

---

### CP Usage

Extremely common in:

- counting problems
- bitmask problems
- probability questions

---

# 7. Example: Logic Notes

---

## Logic

### Common Operators

| Symbol     | Meaning |
| ---------- | ------- |
| ( \land )  | AND     |
| ( \lor )   | OR      |
| ( \lnot )  | NOT     |
| ( \oplus ) | XOR     |

---

### Important Identities

**De Morgan’s Laws**

$$  
\lnot (A \land B) = \lnot A \lor \lnot B  
$$

$$  
\lnot (A \lor B) = \lnot A \land \lnot B  
$$

---

### CP Usage

- bit manipulation
- boolean DP
- condition simplification

---

# 8. Example: Logarithms

---

## Logarithms

### Definition

$$  
\log_b a = c \iff b^c = a  
$$

---

### Important Rules

**Product rule**

$$  
\log_b(xy) = \log_b x + \log_b y  
$$

**Quotient rule**

$$  
\log_b\left(\frac{x}{y}\right) = \log_b x - \log_b y  
$$

**Power rule**

$$  
\log_b(x^k) = k \log_b x  
$$

**Change of base**

$$  
\log_b a = \frac{\log_c a}{\log_c b}  
$$

---

### CP Usage

- complexity analysis
- binary search reasoning
- divide and conquer depth

---

# 9. High-Value Obsidian Tips

Jonas, these separate average notes from elite ones.

## Use callouts for key formulas

```
> [!important] Must Remember
> $$
> \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
> $$
```

---

## Keep formulas isolated

Bad:

```
The sum is $$...$$ which is useful.
```

Good:

formula on its own line.

---

## Create one master note

Create:

```
CP Math Cheatsheet.md
```

Inside, link to:

- Sum formulas
- Number theory
- Logarithms
- Combinatorics
- etc.

This becomes your contest revision weapon.

---
