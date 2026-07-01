---
title: What is Time and Space Complexity
tags:
  - dsa
  - spacecomplexity
  - timecomplexity
date: 2025-11-22
---

# What is Time and Space Complexity

### Time Complexity

- Measures an algorithm's execution time with respect to input size.

### Space Complexity

- The total extra space taken by the algorithm with respect to the input size.
- An **[[In-place algorithm|in-place algorithm]]** is one that does not use extra space beyond itself.

### Asymptotic Analysis

- Evaluates the performance of  algorithms as input size grows.

# What are the different cases in time and space complexity analysis

### Best case

- In the best-case analysis, we calculate the lower bound on the running time of an algorithm.
- We must know the case that causes a minimum number of operations to be executed

### Average case

- In average case analysis, we take all possible inputs and calculate the computing time for all of the inputs.
- Sum all the calculated values and divide the sum by the total number of inputs

### Worse case

- In the worst-case analysis, we calculate the upper bound on the running time of an algorithm.
- We must know the case that causes a maximum number of operations to be executed.
- As Competitive Programmers, we care about worst case complexities

### Amortized case

- Amortized time is the way to express the time complexity when an algorithm has the very bad time complexity only once in a while besides the time complexity that happens most of time.
-

## Related

- [[Stack]]
- [[14 LeetCode Patterns to Solve Any Question]]
