---
title: Recursion
tags:
  - a2sv
  - dsa
  - recursion
  - python
date: 2026-04-17
type: note
status: draft
source: a2sv notes
---
# Recursion
Recursion in Python is a powerful concept where a function solves a problem by calling itself with a simpler version of the same problem, mirroring how we break down complex tasks in everyday thinking. It relies on the call stack to manage these self-calls, creating a natural flow from larger problems to trivial ones and back.

## Core Idea

Recursion embodies the "divide and conquer" principle: tackle big challenges by reducing them to smaller, identical sub-challenges until reaching a simple, solvable case. Think of it like Russian nesting dolls each doll opens to reveal a smaller one inside, until you hit the tiniest doll that needs no further opening. In code, this self-reference creates elegance for hierarchical or repetitive structures, like tree traversals or mathematical patterns, without explicit loops.

## Essential Components

Every recursive function needs two parts to avoid infinite loops.

- **Base case**: The stopping condition, like the smallest doll. It returns a direct value without further calls (e.g., if input is 0 or 1, return 1).
    
- **Recursive case**: The self-call with progress toward the base (e.g., handle n by recursing on n-1). Each call shrinks the problem, building a stack of pending computations.
    

Without a base case, Python's call stack overflows, as each call adds a layer until memory runs out.

## Call Stack Mechanics

Python tracks recursion via the call stack, a last-in, first-out structure (LIFO). Each self-call pushes a new frame holding local variables and return addresses; the base case pops frames while "unwinding" computes results upward. For factorial(n), calls build: factorial(5) waits for factorial(4), which waits for ... factorial(1), then resolves backward: 1 * 2 * ... * 5.

This stack enables recursion's magic—separate namespaces per call prevent variable clashes—but limits depth (Python defaults to 1000 levels).

## Steps to Implement Recursion

- Step 1 - Define a base case: 
	- Identify the simplest (or base) case for which the solution is known or trivial. This is the stopping condition for the recursion, as it prevents the function from infinitely calling itself.  
>   
- Step 2 - Define a recursive case: 
	- Define the problem in terms of smaller subproblems. Break the problem down into smaller versions of itself, and call the function recursively to solve each subproblem.  
  
- Step 3 - Ensure the recursion terminates: 
	- Make sure that the recursive function eventually reaches the base case, and does not enter an infinite loop.  
>   
- Step 4 - Combine the solutions: 
	- Combine the solutions of the subproblems to solve the original problem.
```python
def fib(n):

    # Stop condition
    if (n == 0):
        return 0

    # Stop condition
    if (n == 1 or n == 2):
        return 1

    # Recursion function
    else:
        return (fib(n - 1) + fib(n - 2))



n = 5;
print("Fibonacci series of 5 numbers is :",end=" ")

for i in range(n): 
    print(fib(i),end=" ")
```

**Output**

```
Fibonacci series of 5 numbers is: 0 1 1 2 3
```
![[Pasted image 20260417161941.png]]

## Related

- [[DSA MOC]] — Full map of DSA topics
- [[Graph Theory]] — DFS is inherently recursive; recursion is the backbone of graph traversal
- [[Binary Search]] — Recursive binary search implementation
- [[Stacks, Queues and Monotonicity]] — Call stack mechanics; stack-based DFS
- [[Two Pointers]] — Recursive vs iterative approaches for array problems
- [[trees]] — Tree traversals (inorder, preorder, postorder) are recursive