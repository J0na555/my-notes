## Class: [[DSA MOC|DSA]]

## Topic: #dsa #algorithm #excalidraw

## Date: 23-04-2025

---

# Introduction

## Program vs Data Structure vs Algorithms

### A program

- A set of instruction which is written in order to solve a problem.
  - A solution to a problem actually consists of two things:
     - A way to organize the data
     - Sequence of steps to solve the

- The way data are organized in a computers memory is said to be **Data Structure**
- The sequence of computational steps to solve a problem is said to be an **Algorithm**.
- Therefore, a program is  **Data structures** plus **Algorithm**.
- The first step to solve the problem is obtaining ones own **abstract view**, or **model**, of the problem.
- This process of modeling is known as **abstraction**
**Abstraction** is a process of classifying characteristics as **relevant** and **irrelevant** for the particular purpose at hand and ignoring the irrelevant ones.
**The model**
- The model defines an abstract view to the problem.
- The model should only focus on problem related stuff
- Using the model, a programmer tries to define the properties of the problem. • These properties include
  - The data which are affected and
  - The operations that are involved in the problem
- An entity with the properties just described is called an abstract data type (ADT).

#### Abstract Data Types

- Is logical description of a problem
- An abstract data type (ADT) is the realization of a data type as a software component.
- Is a specification that describes a data set and the operation on that data.
- Think of an ADT as a picture of the data and the operations to manipulate and change that data.
- The ADT specifies:
 	- What data is stored.
 	- What operations can be done on the data.
- Does not specify how to store or how to implement the operation.
- Is independent of any programming language

#### Data Structure

- A data structure is **the implementation** for an ADT
- It can be implemented and used with in an algorithm
- Data structure is a way of **collecting and organizing data** in such a way that we can perform operations in an **effective way**
- Any thing that can store data can be called a data structure
- An ADT tells **what is to be done** and the DS tells **how** to be done
- ADT gives the **blueprint** while the DS provides the **implementation** part

![[types of ds]]

###### linear DS

The arrangement of the data in the sequential manner is known as linear DS.
The data structure used for this purpose are
 - [[arrays]]
 - [[Linked Lists]]
 - [[Stacks]] and
 - [[queues]]
In this DS, one element is connected to only one another element in a linear form.

- Linear DS can be further classified into **static** and **dynamic**
 	- Static linear DS the memory is allocated at **compile time** so the **max size is fixed**  for example **Arrays**
 	- dynamic linear DS the memory is allocated at **runtime** therefore the **max size is flexible** example of this can be **linked lists, stacks, queues**

###### None linear DS

When one element is connected to the 'n' number of elements is known as non- linear DS.
For example
 - [[trees]]
 - [[Graph Theory]]
in this case, elements are arranged in a random manner.

##### Operations on data structure

1. **Traversing**: visiting each elements of data structure in order to perform some specific operation like *searching* or *sorting*
2. **Insertion**: process of adding the elements to the DS at any location
3. **Deletion**: process of removing an element from the DS
4. **Searching**: process of finding an element with in the DS
  - linear search
  - binary search
5. **Sorting**: process of arranging the data stricture in a specific order
     - insertion sort
     - selection sort
     - bubble sort

##### Selecting a Data Structure

1. Analyze the problem to determine the **resource constraints** a solution must meet.
2. Determine the basic **operations that must be supported**. Quantify the resource constraints for each operation.
3. Select the **data structure** that best meets these requirements.

#### Algorithm

- Algorithm is a **method** or a **process** followed to solve a problem
- If the problem is **viewed as a function**, then an algorithm is an **implementation** for the function that transforms an input to the corresponding output.
- A **problem** can be solved by many different algorithms where as A given algorithm **solves only one problem**
- The quality of a data structure is related to its ability to successfully **model the characteristics** of the world (problem).
- Similarly, the quality of an algorithm is related to its ability to **successfully simulate** **the changes** in the world.
- However, the quality of **data structure** and **Algorithms** is determined by their **ability to work together** well(they are cooperative).
- Generally speaking, **correct data structures** lead to **simple and efficient algorithms** and **correct algorithms** lead to **accurate and efficient data structures**

##### Characteristics of an algorithm

- **Input**: an algorithm has some input values. we can pass 0 or some input value to an algorithm
- **Output**: we will get 1 or more output at the end of an algorithm
- **Unambiguity**: an algorithm should be unambiguous which means that it should be clear and simple
- **Finiteness**: an algorithm should have limited number of instructions
- **Effectiveness**: an algorithm should have finite as each instruction in - an algorithm affects the overall process

##### Algorithm efficiency

there are many approaches to solve a problem, so how do we choose between them?

- two goals of designing an algorithm
 1. to design an algorithm that is easy to **understand, code, debug**
 2. to design an algorithm that makes **efficient use of the computer's resources**
An algorithm is said to be efficient if it solves the problem within its resource constraints .
 	- Space
 	- Time
 	- Communication Band width
The **cost** of a solution is the **amount of resources that the solution consumes**.

##### How to measure efficiency?

1. **Empirical comparison**
 ➢based on the total running time of the program.
 ➢Uses actual system clock time.
2. **Theoretical (Asymptotic Algorithm Analysis)**
 ➢Determining the quantity of resources required using mathematical concept.

#### Approaches in Algorithm

1. **Brute force algorithm**: also known as **exhaustive algorithm**. Search algorithm that searches all possibilities to provide the required solution. such algorithms have two types
   - **Optimizing** : finding all solutions of a problem and then take out the best solution is known then it will terminate if the best solution is known.
   - **Sacrificing**: as soon as best solution is found, then it will stop
1. **Divide and Conquer**: this breaks down the algorithm to solve the problem in different methods. It allows you to solve the problem into different methods and valid output is produced for the valid input.
1. **Greedy algorithm**: Its an algorithm paradigm that makes an optimal choice on each iteration with the hope of getting best solution. Its easy to implement and has faster execution time, but there are rare cases in which it provides the optimal solution.

- The *major categories of algorithms* are
  - **Sort**: algorithm developed for sorting the items in certain order
  - **Search**: algorithm developed for searching the items inside a data structure
  - **Delete**: algorithm developed for deleting the existing element from the data structure
  - **Insert**: algorithm developed for inserting an item inside a data structure
  - **Update**: algorithm developed for updating the existing element inside a data structure

#### Algorithm analysis

algorithm can be analyzed in two levels. First is before creating the algorithm and the second one is after creating the algorithm.

- **Priori analysis**: is a theoretical analysis of an algorithm which is done before implementing the algorithm
- **Pasterion analysis**: is a practical analysis of an algorithm. The practical analysis is achieved by implementing the algorithm using any programming language

#### Algorithm Complexity

- To measure the goodness of data structures and algorithms, we need precise ways of analyzing them in terms of resource requirement.
- the main resources are
 	- **Running time** (computational time complexity)
 	- **Memory usage** (computational space complexity)
 	- **Bandwidth usage** (the total amount of data communicated among processing nodes in distributed computational environment)
 
- There are two approaches to measure the efficiency of algorithms
 	- **Empirical**: Programming competing algorithms and trying them on different instances
 	- **Theoretical**: Determining the quantity of resources required mathematically (Execution time, memory space, etc.) needed by each algorithm.

1. **Empirical  Approach**
 - Involves **implementing the algorithm** and measuring its performance on real-world or synthetic datasets.
 - Measures **actual runtime, memory usage, and other metrics** on specific hardware.
 
  **Advantages**
 ✔ **Real-world accuracy** – Measures actual performance on a given system.  
 ✔ **Hardware/software-specific insights** – Detects bottlenecks due to caching, compiler optimizations, etc.  
 ✔ **Useful for validation** – Verifies theoretical predictions.
 
  **Disadvantages**
 ✖ **Hardware-dependent** – Results vary across machines (CPU speed, RAM, OS).  
 ✖ **Limited scalability** – Testing very large inputs may be impractical.  
 ✖ **Time-consuming** – Requires implementation and multiple test runs.

2. **Theoretical  Approach**
 - Uses **mathematical models** (asymptotic analysis) to estimate efficiency.
 - Focuses on **growth rate** (Big-O, Ω, Θ) rather than exact runtime.
 
  **Advantages**
 ✔ **Hardware-independent** – Works for any machine.  
 ✔ **Predicts scalability** – Shows how the algorithm behaves as n→∞n→∞.  
 ✔ **Faster than empirical testing** – No need for implementation.
 
  **Disadvantages**
 ✖ **Ignores constant factors** – 106⋅n106⋅n vs. 0.5⋅n20.5⋅n2 may differ in practice.  
 ✖ **Does not account for low-level optimizations** (caching, parallelism).

- An algorithm can be analyzed under three specific cases
 	- **Best case**
 	- **Average case**
 	- **Worst case**
- **Best case analysis**: We analyze the performance of the algorithm under the circumstances on which it works best.
 	- In that way, we can determine the **lower-bound** of its performance
 	- However, you should note that we may obtain these results under very unusual or special circumstances and it may be difficult to find the optimum input data for such an analysis.
- **Average case analysis**: This gives an indication on how the algorithm performs on most probable data condition
 	- It is possible that this analysis is made by taking all possible combinations of data, experimenting with them, and finally averaging them.
 	- However, such an analysis may not reflect the exact behavior of the algorithm you expect from a real-life data set.
 	- Nevertheless, this analysis gives you a better idea how this algorithm work for your problem.
- **Worst case analysis**:In contrast to the best-case analysis, this gives you an indication on how bad this algorithm can go,
 	- in other words, it gives a **upper-bound** for its performance.
 	- Sometimes, this could be useful in determining the applicability of an algorithm on a mission-critical application.

#### Asymptotic (growth rate) analysis

- **Asymptotic analysis** is concerned with how the running time of an algorithm increases with the size of input increases.
- It’s only concerned with what happens for very a **large value of n**.

##### Types of asymptotic analysis

1. Big-Oh Notation (O)
2. Big-Omega Notation ()
3. Theta Notation ()
4. Little-o Notation (o)
5. Little-Omega Notation ()
