---
title: What is OS
tags:
  - os
date: 2025-11-16
---

# What is OS

- It's a program that acts like as an intermediatary between a user and the computer hardware
- computer consists of 1 or more processors, main memory, disk, keyboard, ....
- writing programs to keep track of all these components and use them correctly is an extremely difficult job.
- for these reason computers are equipped with layer of SW called OS whose job is to manage all these devices efficiently,and to provide user programs with a simple interface to the hardware.

## OS Goals

- execute user programs
- making solving user problems easier
- making computer system convenient
- efficient  use of computer hardware

## TLDR

- OS is intermediatary between user and hardware

## What is Kernel?

- The Kernel is a computer program at the core of a computer's OS that has complete control over everything in the system.Its the 'portion of os code that is always resident in memory', and facilitates interactions between hardware and software components.
- On most computers kernel is one of the first programs to load(after the **bootloader**)

### Kernel Mode

- In Kernel mode, the executing code has complete and unrestricted access to the underlying hardware. It can execute any CPU instruction and reference any memory address. Kernel mode is generally reserved for the lowest-level, most trusted functions of the operating system. Crashes in kernel mode are catastrophic; they will halt the entire PC

### User Mode

- In User mode, the executing code has no ability to directly access hardware or reference memory. Code running in user mode must delegate to system APIs to access hardware or memory. Due to the protection afforded by this sort of isolation, crashes in user mode are always recoverable. Most of the code running on your computer will execute in user mode.

## functions of an OS

- user environment:
  - transforma bare hardware
  - error detection and error handling
  - security
  - execution environment

- Resource management:
  
  - Time management
  - space management
  - synchornization and deadlock handling
  - accounting and status information

# The OS

- batch os
- time sharing os
- distributed os system
- embedded os
- real time os

## Batch OS

- in Batch OS the similar jobs are grouped togather into batches with the help of some opetaor and these batches are excuted one by one.

- advantage: reduced overall time
- disadvantage: manual intervention and low cpu utilization

## Time Sharing OS

- Multi-tasking via time quantum

- advantage: equal opportunity for processes, high cpu utilization
- disadvantage: higher priority processes wait

## distributed OS

- systems are connected by shared network
- remote access is possible

- advantage: fault tolerance, Resource sharing, load distribution
- disadvantage: data security challenges

## Embedded OS

- Designed for a specific task/ devices (eg. elevetors)

- advantage: fast, low cost, less memory use
- disadvantage: only one job, difficult to upgrade

## Real Time OS

- deals with real time data, no buffer delays

- types:

  - Hard real-time : time constrains are crucial
  - soft real-time : time constrains are less crucial

- advantage: max Resource utilization, almost error free
- disadvantage: complex algorithms, specific device drivers are needed

# History of OS

## first generation (1945-1955)

- vaccum tubes
- programming via plugged boared (no OS)

## second generaion (1955-1965)

- Transistors
- first OS
- batch systems introduced

## third generation (1965-1980)

- integrated circuits(ic)
- multi-programming
- spooling
- timesharing (variant of multi-programming)

## fourth generation (1980-present)

- large scale integrated chips (LSI)
- os for personal computers
- network os (mutiple computers seen)
- distributed os (one processor seen)

# Major achievements

- [[Process Management|processes]]
  
  - multi-programming
  - timesharing
  - real-time sharing
  - real time transactions
  - eror cause ([[Concurrency Control#Deadlock Handling|deadlock]], synchornization)

- memory management
  - processe isolation
  - automatic allocation
  - protection and access control

- scheduling and Resource management
  - fairness
  - differential resposiveness
  - efficiancy

- system structure

  - hardware enhancement
  - software modularization

# characteristics of modern os

- micro kernel architecture
- Multi-tasking
- symetric multi processing
- distributed os
- object oriented design
