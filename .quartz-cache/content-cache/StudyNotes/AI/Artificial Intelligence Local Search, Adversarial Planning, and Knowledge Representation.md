---
title: Local Search, Adversarial Planning, and Knowledge Representation
tags:
  - class
  - ai
date: 2026-04-03
type: note
status: draft
source: class-ppt
---
# Artificial Intelligence: Local Search, Adversarial Planning, and Knowledge Representation

## Executive Summary

This briefing document synthesizes the core principles of artificial intelligence as they relate to search strategies and knowledge representation. In many complex problem-solving scenarios, the path to a solution is secondary to the goal state itself. Local search algorithms, such as Hill-climbing and Local Beam Search, optimize for these states while minimizing memory usage. However, in multi-agent environments, adversarial search must be employed to account for conflicting goals between opponents.

A critical component of intelligent behavior is Knowledge Representation and Reasoning (KRR). Because natural language is inherently ambiguous, formal logics—specifically Propositional Logic (PL) and First-Order Logic (FOL)—are required to represent facts and deduce new information accurately. Knowledge Engineering (KE) serves as the bridge between human expertise and these formal systems, ensuring that knowledge-based agents can effectively automate reasoning, make quality decisions, and solve complex real-world problems.

--------------------------------------------------------------------------------

## 1. Local Search Algorithms

Local search is characterized by the principle that the goal state is the solution, making the path taken to reach that state irrelevant. This approach offers significant advantages:

- **Memory Efficiency:** Generally requires a constant amount of memory as it does not maintain a search tree.
- **Suitability for Infinite Spaces:** Can find reasonable solutions in spaces where systematic search is unsuited.
- **Configuration Modification:** Operates by starting with a complete configuration and making incremental modifications to improve quality.

### Hill-Climbing Algorithm

Hill-climbing is a continual loop that moves in the direction of increasing value, often referred to as "uphill." The algorithm terminates upon reaching a "peak" where no neighbor has a higher value.

|   |   |
|---|---|
|Term|Definition|
|**Current State**|The state in the landscape diagram where an agent is currently present.|
|**Global Maximum**|The best possible state in the state space; the highest value of the objective function.|
|**Local Maximum**|A state that is better than its neighbors but lower than the global maximum.|
|**Flat Local Maximum**|A flat space where all neighboring states have the same value as the current state.|
|**Shoulder**|A plateau region that possesses an uphill edge.|

### Local Beam Search

While hill-climbing tracks one node, Local Beam Search keeps track of _k_ states.

1. It begins with _k_ randomly generated states.
2. At each step, all successors of all _k_ states are generated.
3. If any successor is a goal, the algorithm halts.
4. Otherwise, it selects the _k_ best successors from the complete list and repeats the process.

--------------------------------------------------------------------------------

## 2. Adversarial Search (Games)

Adversarial search occurs in multi-agent environments where agents have conflicting goals. In these "games," agents must plan ahead while accounting for the fact that other agents are actively planning against them.

- **Multi-agent Environment:** Each agent is an opponent and must consider the actions of others and the subsequent effects on their own performance.
- **Modeling Games:** Games are solved in AI using two main factors: a search problem model and a heuristic evaluation function.

--------------------------------------------------------------------------------

## 3. Fundamentals of Knowledge Representation and Reasoning (KRR)

Knowledge in AI is defined as an accumulation of facts, procedural rules, heuristics, and familiarity gained through experience. KRR is the field concerned with how an agent’s "thinking" contributes to its intelligent behavior.

### Characteristics and Importance of Knowledge

Knowledge is voluminous, potentially incomplete or imprecise, and dynamic (changing over time). It is essential for:

- Automating reasoning and discovering/deducing new facts.
- Answering user queries.
- Making quality decisions and selecting courses of action.
- Solving complex problems like medical diagnosis or natural language communication.

### Categories of Knowledge to Represent

- **Objects:** Facts about entities in the world domain.
- **Events:** Actions occurring within the world.
- **Performance:** Knowledge regarding how to do things (behavior).
- **Meta-knowledge:** Knowledge about what the agent knows.
- **Facts:** Truths about the real world.
- **Knowledge-Base (KB):** A central component consisting of a group of "sentences" (technical terms for represented information).

--------------------------------------------------------------------------------

## 4. Approaches to Knowledge Representation

There are four primary ways to represent knowledge within an AI system:

1. **Simple Relational Knowledge:** Storing facts systematically in columns, similar to database systems, representing relationships between entities.
2. **Inheritable Knowledge:** Data is stored in a hierarchy of classes. Elements inherit values from other members of a class using "instance relations."
3. **Inferential Knowledge:** Knowledge is represented in the form of formal logics, allowing the system to derive additional facts.
4. **Procedural Knowledge:** Uses small programs or codes to describe how to proceed. A common tool in this approach is the **If-Then rule**.

--------------------------------------------------------------------------------

## 5. Knowledge Engineering (KE)

Knowledge Engineering is the process of building a knowledge base by extracting information from human experts.

- **The Knowledge Engineer:** Investigates a domain, identifies important concepts, and creates formal representations of objects and relations.
- **Knowledge Acquisition:** The specific process of interviewing human experts to elicit required knowledge.
- **The Process:** Includes choosing a representation formalism and a reasoning/problem-solving strategy.
- **The Knowledge Base:** Stores sets of facts and rules expressed in a formal Knowledge Representation (KR) language. Each individual representation is called a "sentence."

--------------------------------------------------------------------------------

## 6. Logic as a Representation Language

Formal logic is a declarative language used to assert sentences and deduce conclusions. It is preferred over natural language (like English) because natural language is ambiguous and context-dependent.

### Components of Formal Logic

- **Syntax:** The rules describing how to construct valid sentences (e.g., what structures are allowed).
- **Semantics:** The mapping of sentences to the real world; what the sentences actually mean.
- **Proof Theory:** A set of rules for carrying out reasoning to draw new conclusions from existing statements.

--------------------------------------------------------------------------------

## 7. Formal Logic Types: PL and FOL

### Propositional Logic (PL)

PL is a simple language for representing facts via symbols and constants.

- **Syntax:** Uses logical constants (True, False), proposition symbols (P, Q, R), and logical connectives (not, and, or, implies, equivalent).
- **Sentences:** Can be atomic (a single symbol) or complex (combined with connectives or parentheses).
- **Sentence Classifications:**
    - **Valid (Tautology):** True under all possible interpretations.
    - **Satisfiable:** True under some interpretations.
    - **Unsatisfiable (Contradiction):** False under all interpretations.

### First-Order Logic (FOL)

FOL is more expressive than PL and can represent any situation found in natural language by using:

- **Objects and Relations:** Constants (names, numbers) and predicates (relating objects).
- **Functions:** Returns values (e.g., "mother-of").
- **Variables:** Used for generalization (e.g., x, y).
- **Quantifiers:**
    - **Universal (****\forall****):** Statements about every object (e.g., "All cats are mammals"). Usually paired with the "implies" (\Rightarrow) connective.
    - **Existential (****\exists****):** Statements about some objects (e.g., "Someone is smart"). Usually paired with the "and" (\wedge) connective.

## Related

- [[AI MOC]] — Full map of AI topics
- [[Fundamentals of Intelligent Agents Architecture, Environments, and Taxonomy]] — Agent types and architecture
- [[Artificial Intelligence Searching and Planning for Problem-Solving Agents]] — Systematic search strategies (BFS, DFS, A*)
- [[Comprehensive Briefing Fundamentals and Applications of Artificial Intelligence]] — Broader AI overview
- [[Agentic AI (m1w1l1)]] — Modern agentic AI: how agents reason and use tools
- [[Graph Theory]] — Search algorithms operate on graph structures