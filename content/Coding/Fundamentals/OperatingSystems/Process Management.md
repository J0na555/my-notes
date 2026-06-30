---
title: process and program
tags:
  - operating_system
  - os
  - process
date: 2025-11-16
---

# process and program

### program

- sequence of instructions

### process

- a program in execution or instance of running program

# Process Creation

### System initialization
  
- foreground process
- background process

### process Creation system call by running processes

### user request

### initiation of batch job

---

# process termination

- ## normal exit (voluntary eg. exit)

- ## error exit ( voluntary eg. program bug)

- ## fetal error (involuntary eg. file not found)

- ## killed by another process (involuntary eg. kill)

# Process State

### New State

- program started in secondary memory

### Ready State
  
- loaded on the main memeory

### Run State

- alloted memory for execution

### Block or wait State

- needs I/O or blocked resource

### Suspend Ready State

- high priority process preempts memory

### Terminate State

- execution finished

## Possible state transitions

- Transition 1:Process blocks for an event to occur.

- Transition 2:Scheduler picks another process to have CPU time.

- Transition 3:Scheduler picks first process get the CPU to run again

- Transition 4:event  becomes occurred to awakened for blocked process.

## Process Implementation

### process table

- array of structures

## Related

- [[Operating System]]
