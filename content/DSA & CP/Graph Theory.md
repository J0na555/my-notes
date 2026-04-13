---
title: Graphs
tags:
  - dsa
  - graph
date: 2026-04-13
type: note
status: draft
source: Internet search
---
# Introduction
In [mathematics](https://en.wikipedia.org/wiki/Mathematics "Mathematics") and [computer science](https://en.wikipedia.org/wiki/Computer_science "Computer science"), **Graph Theory** is the study of [graphs](https://en.wikipedia.org/wiki/Graph_\(discrete_mathematics\) "Graph (discrete mathematics)"), which are [mathematical structures](https://en.wikipedia.org/wiki/Mathematical_structures "Mathematical structures") used to model pairwise relations between objects. A graph in this context is made up of [vertices](https://en.wikipedia.org/wiki/Vertex_\(graph_theory\) "Vertex (graph theory)") (also called nodes or points) which are connected by [edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory_terms#edge "Glossary of graph theory terms") (also called arcs, links, or lines). A distinction is made between undirected graphs, where edges link two vertices symmetrically, and [directed graphs](https://en.wikipedia.org/wiki/Directed_graph "Directed graph"), where edges link two vertices asymmetrically. Graphs are one of the principal objects of study in [discrete mathematics](https://en.wikipedia.org/wiki/Discrete_mathematics "Discrete mathematics").


In General Graph is  a set of points, called **vertices** together with a collection of lines called **edges**.

![[Pasted image 20260413125623.png\|500]]
# Basic Concepts
![[Pasted image 20260413121613.png\| 500]]

## Node and Edge
- A **Node (vertex)** is the basic unit in a graph, it represents an object, state or point in the system 
- An **edge** is a connection between two nodes, it represents a relationship or transition between two objects(nodes), a road between two cities, or an action that changes one state to another
- In AI search, you usually think of **nodes as states** and **edges as actions or transitions** that take you from one state to another, possibly with a cost attached (making the graph weighted).

## Directed vs Undirected Graphs

![[Pasted image 20260413123108.png\|600]]
-  In a **directed graph** (digraph), each edge has a direction (often drawn as an arrow). An edge from A to B only lets you go from A to B, not necessarily back; the relationship is asymmetric, like “follows” on social media or a one‑way street.

- In an **undirected graph**, edges have no direction. If there is an edge between node A and node B, you can go from A to B and from B to A in the same way. The relationship is symmetric, like “friends with” or a two‑way road.
- In AI search, undirected graphs often model reversible actions (you can undo a move), while directed graphs model irreversible or one‑way transitions (e.g., state changes in a game where certain moves cannot be reversed).
![[Pasted image 20260413125031.png\| 400]]
![[Pasted image 20260413125102.png\|300]] ![[Pasted image 20260413125114.png\|300]]

