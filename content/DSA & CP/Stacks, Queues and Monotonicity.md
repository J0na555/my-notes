---
title: Stacks, Queues and Monotonicity
tags:
  - dsa
  - python
  - CP
date: 2026-04-15
type: note
status: draft
source: a2sv notes
---
# Stack 
Stack data structure is a linear data structure that accompanies a principle known as LIFO (Last In First Out) or FILO (First In Last Out).

## implementing stack using linked list
![[Pasted image 20260415144402.png]]
### push operation

- initialize a node
- update the value of the node with data
- now link this node to the head of linked list
- update the pointer to the current node (head = node)

![[Pasted image 20260415144723.png]]

### pop operation
- first check whether there is a node in the linked list, if not return
- otherwise make a pointer let say temp point to the top node and move forward the top node one step
- now free the temp node

![[Pasted image 20260415145348.png]]

### top operation
- check whether there is a node in the linked list if not return 
- otherwise return the value of the top node of the linked list at the head

![[Pasted image 20260415145512.png]]
# Queue
