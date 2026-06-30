---
title: Sorting Basics
tags:
  - dsa
  - sorting
  - a2sv
date: 2026-02-25
type: note
status: draft
source: a2sv notes
---
## What is Sorting?
arranging a set of data in some logical order

## Types of Sorting
- sorting by comparison 
- sorting by distribution

### Sorting by Element Comparison
a data item is compared with other items in  order to find its place in the sorted list
- Bubble sort
- selection sort
- insertion sort
### Sorting by Distribution
all items under sorting are distributed over a storage space and then grouped together to get the sorted list
- counting sort
- bucket sort
### stable vs unstable sorting
#### stable sorting  
maintains the original order of similar items after sorting
#### unstable sorting
does not preserve the initial arrangement of exact items after sorting

### in place vs out of place sorting
#### in-place 
uses a constant space by modifying the order of the elements with in the list

#### out of place
uses extra space to modify order of elements
# Comparison Sorting
## Bubble Sort
- repeatedly swapping elements if they are in the wrong order. keep doing this until sorted

**Implementation**
```python
def bubble_sort(arr):
	n = len(arr)
	
	# Traverse through the list
	for i in range(n):
		swapped = False
		
		
		for j in range(0, n-i-1):
			# compare adjacent elements
			if arr[j] > arr[j+1]:
				arr[j], arr[j+1] = arr[j+1], arr[j]
				swapped = True
				
		# if no swapping occurred, arr is sorted
		if not swapped:
			break
	
	return arr
```

#### Key Points to Note
1. **After each pass**, the largest unsorted element "bubbles up" to its correct position at the end
2. **Number of passes needed**: In worst case, n-1 passes (where n is list length)
3. **Optimization**: The `n-i-1` in the inner loop means we don't compare already-sorted elements
4. **Early termination**: If a pass completes with no swaps, the array is sorted and we can stop

#### Time Complexity
- **Best case** (already sorted): O(n) - with optimization
- **Average case**: O(n²)
- **Worst case** (reverse sorted): O(n²)

#### Space Complexity
- O(1) - sorts in-place, only uses a constant amount of extra space

## Selection Sort
Selects the smallest element from an unsorted list in each iteration and places that element at the beginning of the unsorted list or in other words it works by repeatedly finding the min(max) element from the unsorted portion and moving its to correct position. unlike bubble sort which makes many swaps, selection sort makes only one swap per pass.

**Implementation** 
```python
def selection_sort_min(arr):
	n = len(arr)
	
	for i in range(n):
		# find the min element from the unsorted portion
		min_idx = i
		for j in range(i+1, n):
			if arr[j] < arr[min_idx]:
				min_idx = j
		# swap if founf min with the first element of unsorted portion
		arr[i], arr[min_idx] = arr[min_idx], arr[i]
	
	return arr
```

```python 
def selection_sort_max(arr):
	n = len(arr)
	
	for i in range(n-1, 0, -1): # start from the end
		max_idx = i
		for j in range(i): # check all elements before i
			if arr[j] > arr[min_idx]:
				max_idx = j
				
		arr[j], arr[max_idx] = arr[max_idx], arr[j]
		
	return arr
```

#### Time Complexity
- **All cases**: O(n²) - always makes n(n-1)/2 comparisons
- **Number of swaps**: O(n) - only n swaps maximum (better than bubble sort!)

#### Space Complexity
- O(1) - in-place sorting


## Insertion Sort
Insertion sort builds the final sorted array one element at a time by repeatedly inserting each element into its correct position among the previously sorted elements.

**Algorithm**
- If the element is the first one, it is already sorted.
- Move to next element
-  Compare the current element with all elements in the sorted array
- Shift all the the elements in sorted sub-list that is greater than the value to be sorted.
-  Insert the value at the correct position
- Repeat until the complete list is sorted
in other words
-  the algorithm maintains two portions
	- left portion: sorted elements
	- right portion: unsorted elements to be inserted
	at each step, we take the first element from the unsorted portion and insert it into its correct position in the sorted portion.
	
**Implementation**
```python
def insertion_sort(arr):
    # Start from index 1 (first element is considered sorted)
    for i in range(1, len(arr)):
        key = arr[i]  # Element to be inserted
        j = i - 1     # Index of last sorted element
        
        # Shift elements greater than key to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Place key in its correct position
        arr[j + 1] = key
    
    return arr
```

- Time Complexity
	- Best case: 0(n) -> already sorted array
	- Worst case: 0(n^2) -> reverse sorted array
	- Average case: 0(n^2) 
- In place sorting
- Stable

#### Comparison with Other Sorts

| Algorithm          | Best Case  | Average Case | Worst Case | Space    | Stable |
| ------------------ | ---------- | ------------ | ---------- | -------- | ------ |
| **Insertion Sort** | O(n)       | O(n²)        | O(n²)      | O(1)     | Yes    |
| Bubble Sort        | O(n)       | O(n²)        | O(n²)      | O(1)     | Yes    |
| Selection Sort     | O(n²)      | O(n²)        | O(n²)      | O(1)     | No     |
| Merge Sort         | O(n log n) | O(n log n)   | O(n log n) | O(n)     | Yes    |
| Quick Sort         | O(n log n) | O(n log n)   | O(n²)      | O(log n) | No     |
# Distribute Sorting
## Counting Sort

## Related

- [[DSA MOC]] — Full map of DSA topics
- [[Binary Search]] — Binary search requires sorted arrays; know your sort complexity
- [[Graph Theory]] — Topological sort on DAGs; sorting before graph algorithms
- [[Recursion]] — Merge sort and quicksort are recursive; divide and conquer
- [[Two Pointers]] — Merge technique in two pointers uses sorted array property
- [[Stacks, Queues and Monotonicity]] — Monotonic stack problems often follow sorting
