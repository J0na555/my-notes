---
title: Artificial Intelligence
tags:
  - class
  - ai
date: 2026-04-03
type: note
status: draft
source: class-ppt
---
# Artificial Intelligence: Searching and Planning for Problem-Solving Agents

## Executive Summary

Problem-solving agents are a specialized class of goal-based agents designed to address complex real-life challenges through intelligent programming. These agents operate by identifying sequences of actions that lead from an initial state to a desired goal state. The search process involves formulating goals and problems, defining state spaces, and utilizing specific algorithms to navigate these spaces efficiently.

Key takeaways from the analysis of search strategies include:

- **Search Classification:** Strategies are categorized into Uninformed (blind) search, which lacks domain knowledge, and Informed (heuristic) search, which utilizes problem-specific knowledge to improve efficiency.
- **Performance Metrics:** Algorithms are evaluated based on completeness (guarantee of finding a solution), optimality (finding the lowest-cost solution), time complexity, and space complexity.
- **Trade-offs:** A fundamental tension exists between speed and memory; memory-efficient programs are often slow, while fast programs typically require significant memory.
- **Advanced Paradigms:** Beyond standard path-finding, local search focuses on goal states in infinite spaces, and adversarial search addresses multi-agent environments where agents compete against one another.

--------------------------------------------------------------------------------

## Foundations of Problem-Solving Agents

To solve a problem, an agent must engage in a structured process of formulation before beginning the search for a solution.

### Goal and Problem Formulation

1. **Goal Formulation:** Based on the current situation, the goal is defined as a set of world states in which the agent's requirements are satisfied.
2. **Problem Formulation:** This is the process of deciding which actions and states to consider. For example, in a driving task from Woliso to Nekemte, states are defined as locations between the two points, while actions include turning, accelerating, and braking.

### Components of a Well-Defined Problem

A formal problem is defined by five critical components:

- **Initial State:** The starting point of the agent.
- **Set of Possible Actions:** The available operations the agent can perform.
- **Transition Model:** A description of what each action does, returning ordered pairs of `{action, successor}`.
- **State Space:** The set of all states reachable from the initial state via any action sequence.
- **Path Cost:** A numeric function assigning a cost to a path, typically the sum of individual step costs.
- **Goal Test:** A mechanism applied to a state to determine if it satisfies the goal.

**Example: The 8-Puzzle Problem**

- **States:** Descriptions of the location of eight tiles and a blank space within a nine-square grid.
- **Successor Function:** The blank space moves Left, Right, Up, or Down.
- **Goal Test:** Checks if the current configuration matches the target layout.
- **Path Cost:** Each step costs 1; the total cost is the path length.

--------------------------------------------------------------------------------

## The Search Process

Searching is the process of examining various action sequences and choosing the best one. This is represented visually and mathematically as a **search tree**.

### Search Tree Dynamics

- **Nodes:** Denoted paths within the search.
- **Branches:** Connections between paths.
- **Root Node:** The node with no parent (initial state).
- **Leaf Nodes:** Nodes with no children.

### Core Search Functions and Lists

To conduct a search, an agent requires:

- **Generator Function:** Produces successor states given a current state and action.
- **Tester Function (IsGoal):** A Boolean check to see if a state is the goal.
- **OPEN List:** Stores nodes that have been seen but not yet explored.
- **CLOSED List:** Stores nodes that have been both seen and explored.

The search generally proceeds by expanding nodes on the OPEN list, adding their children to the OPEN list, and moving the expanded node to the CLOSED list. A **Merge function** then arranges these successors based on evaluation costs.

--------------------------------------------------------------------------------

## Uninformed Search Strategies

Uninformed or "blind" search strategies have no information regarding the number of steps or path cost from the current state to the goal.

|   |   |   |   |   |
|---|---|---|---|---|
|Strategy|Complete|Optimal|Time Complexity|Space Complexity|
|**Breadth-First (BFS)**|Yes|No*|O(b^d)|O(b^d)|
|**Uniform Cost (UCS)**|Yes|Yes|O(b^d)|O(b^d)|
|**Depth-First (DFS)**|No|No|O(b^m)|O(b^m)|
|**Depth-Limited (DLS)**|If l \geq d|No|O(b^l)|O(b^l)|
|**Iterative Deepening (IDS)**|Yes|No|O(b^d)|O(b^d)|
|**Bi-directional**|Yes|Yes|O(b^{d/2})|O(b^{d/2})|

_*Note: BFS is optimal only if all step costs are equal._

### Key Uninformed Methods

- **Breadth-First Search (BFS):** Expands the shallowest unexpanded node first. It uses a queue (First-In-First-Out) and is guaranteed to find a solution, though it is memory-intensive as it keeps all nodes in memory.
- **Uniform Cost Search (UCS):** Expands the node with the lowest path cost g(n). It is optimal if the path cost never decreases (g(successor(n)) \geq g(n)).
- **Depth-First Search (DFS):** Expands the deepest node in the tree. It uses a stack (Last-In-First-Out) and is more space-efficient (linear memory) but can fail in infinite spaces or loops.
- **Iterative Deepening Search (IDS):** Combines the benefits of BFS and DFS. It performs repeated DFS with increasing depth limits (d=1, d=2, etc.) until a goal is found. It is space-efficient like DFS and finds the shortest path like BFS.
- **Bidirectional Search:** Runs two simultaneous searches—one forward from the start and one backward from the goal—meeting in the middle. This significantly reduces time complexity but requires an explicit, reversible goal state.

--------------------------------------------------------------------------------

## Informed (Heuristic) Search Strategies

Informed search uses domain-specific knowledge, expressed through a **heuristic function** **h(n)**, which estimates the cost of the path from state n to the goal.

### Best-First Search

This is a general class of algorithms that includes:

- **Greedy Search:** Expands the node that appears closest to the goal based solely on h(n). It is efficient but neither complete nor optimal, as it can be led down infinite paths.
- _Search:_* The most widely used informed search. It minimizes the total estimated cost f(n) = g(n) + h(n), where g(n) is the cost to reach the node and h(n) is the estimated cost to the goal.

### Admissibility

A heuristic h(n) is **admissible** if it never overestimates the actual cost to the goal (h(n) \leq actual cost). Using an admissible heuristic ensures that A* search will find the optimal solution.

--------------------------------------------------------------------------------

## Local and Adversarial Search

### Local Search

In some problems, the path to the goal is irrelevant; only the final state matters. Local search uses minimal memory and is suitable for infinite search spaces.

- **Hill-Climbing:** Continually moves in the direction of increasing value (uphill) until a peak is reached.
    - **Local Maximum:** A peak higher than its neighbors but lower than the global maximum.
    - **Global Maximum:** The best possible state in the state space.
    - **Flat Local Maximum/Plateau:** A region where all neighbors have the same value.
    - **Shoulder:** A plateau that has an uphill edge.
- **Local Beam Search:** Keeps track of k states rather than one. It generates all successors of k states and selects the k best for the next iteration.

### Adversarial Search (Games)

Adversarial search occurs in multi-agent environments where agents have conflicting goals. In these "games," an agent must plan not only its own moves but also account for the counter-moves of an opponent. These problems are modeled using search trees and heuristic evaluation functions to navigate the competitive state space.