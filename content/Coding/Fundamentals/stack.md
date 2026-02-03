---
title: Stacks in C++ (see also [[Stacks]])
tags:
  - dsa
  - stacks
date: 2025-06-16
---

# Stacks in C++ (see also [[Stacks]])

```c
 void push (stack *s, int element);
/* Insert an element in the stack */
int pop (stack *s);
/* Remove and return the top element */
void create (stack *s);
/* Create a new stack */
int isempty (stack *s);
/* Check if stack is empty */
int isfull (stack *s);
/* Check if stack is full */
```

- Stack is a linear data structure that follows principle known as **LIFO** (last in first out or in other words first in last out(FILO)).
- Array can be implemented by using [[Linked lists]], [[arrays]] and also [[pointers]]. Can be also **dynamic** or **fixed** size.

# methods on stack

**Push()**:
 `array`
  step 1. check if the stack is full
   step 2. if the stack is full produce an error and exit
   step 3. if the stack is not full, increment top to point to the next empty space
   step 4. add the data to the stack location where the top is locating
   step 5. return success
 
 linked list
  step 1. initialize a node
   steo 2. update the value of that node by data i.e node.value = data
   steo 3. link the link to the top of the list i.e node.next = head
   step 4. update the top pointer to the current node i.e head = node
![[Pasted image 20250616142709.png]]
**Pop()**:
 `array`
  step 1. check if the stack is empty
   step 2. if the stack is empty produce an error and exit
   step 3. if not, access the data which the top is pointing
   step 4. decrease the top of the data by one
   step 5. return success

  `linked list`
   step 1. check if there is a node present in the linked list or not
   step 2. if not then return null
   step 3. otherwise make pointer let say temp point to the top node
   step 4. move forward the top node by one
   step 5. free the temp node 

## Related

- [[14 LeetCode Patterns to Solve Any Question]]
- [[Time  and Space Complexity of an algorithm]]
