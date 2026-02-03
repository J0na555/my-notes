## Class: [[DSA]]

## Topic: #linkedList #dsa #java

## Date: 26-03-2025

---

## 1️⃣ What is a Linked List? (Plain English)

A **linked list** is a way to store data **in nodes**, where:

- Each node holds **data**
- And a **reference (pointer)** to the next node

Unlike arrays:

- ❌ Elements are **not stored next to each other**
- ✅ You can **easily insert or delete** items without shifting everything

Think of it like:

```
[data | next] -> [data | next] -> [data | next] -> None
```

---

## 2️⃣ Why Linked Lists Exist (Tell it like it is)

**Arrays suck at insertion/deletion**

- Insert at start → everything shifts → slow

**Linked Lists fix that**

- Change a few pointers → done

But:

- ❌ Random access is slow (no `arr[5]`)
- ❌ Uses extra memory (for pointers)

👉 **Trade-off**: speed vs memory vs convenience

---

## 3️⃣ Basic Structure of a Linked List

We need **two classes**:

1. `Node`
2. `LinkedList`

---

## 4️⃣ Node Class (The Building Block)

```python
class Node:
    def __init__(self, data):
        self.data = data      # stores the value
        self.next = None      # points to the next node
```

Each node:

- Holds data
- Knows where the next node is

---

## 5️⃣ LinkedList Class (The Controller)

```python
class LinkedList:
    def __init__(self):
        self.head = None  # first node of the list
```

If `head` is `None`, the list is empty.

---

## 6️⃣ Insert at the Beginning (Fast & Easy)

### Idea

- New node points to current head
- Head moves to new node

```python
def insert_at_beginning(self, data):
    new_node = Node(data)
    new_node.next = self.head
    self.head = new_node
```

**[[Time  and Space Complexity of an algorithm|Time Complexity]]:** `O(1)`  
This is one of the biggest advantages of linked lists.

---

## 7️⃣ Insert at the End

### Idea

- Traverse until `next == None`
- Attach new node there

```python
def insert_at_end(self, data):
    new_node = Node(data)

    if self.head is None:
        self.head = new_node
        return

    current = self.head
    while current.next:
        current = current.next

    current.next = new_node
```

**[[Time  and Space Complexity of an algorithm|Time Complexity]]:** `O(n)`  
Because we must walk through the list.

---

## 8️⃣ Display the Linked List

```python
def display(self):
    current = self.head
    while current:
        print(current.data, end=" -> ")
        current = current.next
    print("None")
```

Example output:

```
10 -> 20 -> 30 -> None
```

---

## 9️⃣ Delete a Node by Value

### Case Handling

1. List is empty
2. Value is at head
3. Value is in the middle/end

```python
def delete(self, key):
    current = self.head

    # Case 1: head node contains the key
    if current and current.data == key:
        self.head = current.next
        return

    # Case 2: search for the key
    prev = None
    while current and current.data != key:
        prev = current
        current = current.next

    # Case 3: key not found
    if current is None:
        print("Value not found")
        return

    prev.next = current.next
```

---

## 🔟 Search for a Value

```python
def search(self, key):
    current = self.head
    position = 0

    while current:
        if current.data == key:
            return position
        current = current.next
        position += 1

    return -1
```

Returns index-like position (not true index, but helpful).

---

## 1️⃣1️⃣ Reverse a Linked List (Very Important 🔥)

This is a **classic interview problem**.

### Idea

We reverse the direction of pointers.

```python
def reverse(self):
    prev = None
    current = self.head

    while current:
        next_node = current.next  # save next
        current.next = prev       # reverse pointer
        prev = current            # move prev forward
        current = next_node       # move current forward

    self.head = prev
```

Before:

```
10 -> 20 -> 30 -> None
```

After:

```
30 -> 20 -> 10 -> None
```

---

## 1️⃣2️⃣ Full Working Example

```python
ll = LinkedList()
ll.insert_at_beginning(10)
ll.insert_at_end(20)
ll.insert_at_end(30)

ll.display()

ll.delete(20)
ll.display()

print(ll.search(30))

ll.reverse()
ll.display()
```

---

## Final Honest Take

- Linked lists are **simple conceptually**
- The **real challenge is pointer logic**
- If you understand:
  - `current`
  - `prev`
  - `next`
