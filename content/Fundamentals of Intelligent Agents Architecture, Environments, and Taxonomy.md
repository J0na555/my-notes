---
title: "Fundamentals of Intelligent Agents: Architecture, Environments, and Taxonomy"
tags:
  - class
  - ai
date: 2026-04-03
type: note
status: draft
source: class-ppt
---
# Fundamentals of Intelligent Agents: Architecture, Environments, and Taxonomy

## Executive Summary

Intelligent agents are defined as autonomous hardware or software systems that perceive their environment through sensors and act upon it via effectors to achieve specific goals. The core structure of any agent is comprised of its physical machinery (Architecture) and its implementation logic (Agent Program). Central to the study of these systems is the concept of **rationality**—the capacity to make sensible judgments and perform actions that maximize performance based on experience and built-in knowledge.

To design an effective agent, one must first define its **Task Environment** using the **PEAS** framework (Performance, Environment, Actuators, and Sensors). Environments vary across several dimensions, such as being static or dynamic and discrete or continuous, which significantly influences agent design. Agents are categorized into five primary classes—Simple Reflex, Model-Based Reflex, Goal-Based, Utility-Based, and Learning Agents—ranging from basic condition-action rule followers to sophisticated systems capable of adapting through experience and feedback.

--------------------------------------------------------------------------------

## 1. Core Definitions and Structural Framework

An agent is any entity capable of perceiving its environment through **sensors** and acting upon that environment through **effectors**. When an agent possesses autonomy and the capacity for decision-making, it is classified as an **intelligent agent**.

### The Agent Equation

The fundamental structure of an intelligent agent is defined by the following relationship:

**Agent = Architecture + Agent Program**

- **Architecture:** The physical machinery or hardware on which the agent executes.
- **Agent Program:** The software implementation of the agent's function.

### Rationality and Autonomy

- **Rationality:** A rational agent is one that "does the right thing" based on what it perceives. Rationality involves being reasonable, sensible, and possessing a good sense of judgment. It often requires performing actions to obtain useful information.
- **Autonomy:** An agent is considered autonomous if its behavior is determined by its own experience. While an agent may have built-in knowledge, a lack of reliance on its own experience results in a lack of autonomy.

--------------------------------------------------------------------------------

## 2. Defining the Task Environment (PEAS)

The first step in designing an intelligent agent is specifying its "Task Environment," which represents the problem for which the agent provides a solution. This is categorized using the **PEAS** acronym:

|   |   |
|---|---|
|Component|Description|
|**P**erformance|The criteria that determine the success of the agent's behavior.|
|**E**nvironment|The external world or context in which the agent operates.|
|**A**ctuators|The tools or mechanisms the agent uses to act upon the environment.|
|**S**ensors|The tools or mechanisms the agent uses to perceive the environment.|

### Case Study: Automated Taxi Driver

The following table illustrates the PEAS description for a complex agent, such as an automated taxi:

|   |   |   |   |   |
|---|---|---|---|---|
|Agent Type|Performance Measure|Environment|Actuators|Sensors|
|**Taxi Driver**|Safe, fast, legal, comfortable trip, maximize profits, minimize fuel/cost.|Roads, urban/village areas, traffic, pedestrians, customers, animals.|Steering, accelerator, brake, signal, horn, display/voice synthesizer.|Cameras, sonar, GPS, speedometer, odometer, accelerometer, engine sensors, keyboard/mic.|

--------------------------------------------------------------------------------

## 3. Dimensions of Agent Environments

Environments are classified based on several distinct characteristics that dictate the complexity of the agent program:

- **Accessible vs. Inaccessible:** In an accessible environment, sensors provide the agent with the complete state of the world relevant to its actions. Accessible environments are more convenient as the agent does not need to maintain internal state.
- **Deterministic vs. Nondeterministic:** An environment is deterministic if the next state is completely determined by the current state and the agent’s actions. Inaccessible environments may appear nondeterministic to the agent.
- **Episodic vs. Non-episodic:** In episodic environments, experience is divided into independent episodes of perception and action. The quality of an action depends only on that specific episode.
- **Static vs. Dynamic:** A dynamic environment can change while the agent is deliberating. Static environments are easier to manage as the agent does not need to monitor the world during decision-making.
- **Discrete vs. Continuous:** Discrete environments have a limited number of clearly defined percepts and actions (e.g., Chess). Continuous environments involve values that sweep through a range (e.g., the speed and location of a taxi).
- **Single vs. Multi-agent:** Defines whether an agent operates alone or in an environment containing other agents (e.g., a football match).

--------------------------------------------------------------------------------

## 4. Taxonomy of Intelligent Agents

Agents are grouped into five classes based on their perceived intelligence and technical capability.

### 4.1 Simple Reflex Agents

These agents act only on the basis of the **current percept**, ignoring the history of previous perceptions.

- **Mechanism:** They use **condition-action rules** to map a specific state directly to an action.
- **Limitations:** They have very limited intelligence and are only rational if the correct decision can be made based solely on the current, fully observable environment.

### 4.2 Model-Based Reflex Agents

These agents maintain an **internal state** to keep track of parts of the world that cannot be seen currently.

- **Internal State:** A representation of the current state based on percept history.
- **Model:** Knowledge of "how things happen in the world," including how the world evolves independently and how the agent's own actions affect it.

### 4.3 Goal-Based Agents

Knowledge of the current state is not always sufficient; these agents require **goal information** that describes desirable situations.

- **Proactivity:** They use searching and planning to consider long sequences of possible actions to achieve a goal.
- **Function:** They choose actions specifically to reach the defined goal state.

### 4.4 Utility-Based Agents

These agents use a **utility function** to choose between multiple alternatives to find the _best_ action.

- **Preferences:** They go beyond goals by seeking the quickest, safest, or cheapest way to a destination.
- **Efficiency:** The utility function maps each state to a real number to measure how "happily" or efficiently an action achieves the goal.

### 4.5 Learning Agents

Learning agents are capable of adapting and improving automatically through experience. They consist of four conceptual components:

1. **Learning Element:** Responsible for making improvements by learning from the environment.
2. **Critic:** Provides feedback to the learning element by evaluating how well the agent is performing relative to a fixed standard.
3. **Performance Element:** Responsible for selecting external actions based on percepts.
4. **Problem Generator:** Suggests new actions that lead to informative experiences and new learning opportunities.