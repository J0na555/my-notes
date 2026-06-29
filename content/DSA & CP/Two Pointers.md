---
title: Two Pointers
tags:
  - dsa
  - a2sv
  - two-pointers
date: 2026-03-04
type: note
status: draft
source: a2sv notes
---
# Definition
Two pointers technique is the use of two different pointers(usually to keep track of array or string indices) to solve a problem said indices with the benefit of saving time and space.

![[Pasted image 20260304090501.png]]

# Different Variants
- variant i: Parallel pointers
- variant ii: pointers on separate arrays
- variant iii: colliding pointers
- variant iv: seeker and placeholder
- variant v: for-while combo

## variant i: Parallel pointers
**problem** 
given an array of integers, determine if its sorted non-deceasing order 
**approach** 
in this problem, we only need to look at two consecutive values.This is cause for three consecutive numbers if `a <= b` and `b <= c` then `a <= c`
the two pointers will iterate parallel to each other, until the right-most one reach the end of the array.
**implementation**
```python
def isSorted(nums):
	left, right = 0, 1
	size = len(nums)
	
	while right < size:
		if nums[left] > nums[right]:
			return False
		left += 1
		right +=1
	
	return True
```

## variant ii: pointers on separate arrays
**problem**
you are given two arrays, sorted in non-decreasing order, merge them together
**approach**
we have to ways to solve this problem
- the first is to collect both elements into one array and then sort them with ant sorting method,such algorithm will tank time 0(m+n).log(m+n)
- the efficient approach is to put two pointers on separate arrays 
![[Pasted image 20260304095454.png]]
![[Pasted image 20260304095544.png]]
**implementation**
```python
def mergeList(list1, list2):
	merged =  []
	first, second = 0, 0
	
	while first < len(list1) and second < len(list2):
		if list1[first] < list2[second]:
			merged.append(list1[first])
			first += 1
		else:
			merged.append(list2[second])
			second += 1
	
	merged.extend(list1[first:])
	merged.extend(list2[second:])
	
	return merged
```

## variant iii: colliding pointers
**problem**
given an array of integers that is sorted in increasing order, find two numbers such that they add up to a specific target number
**approach**
there are two approaches for this problem
- brute force approach:
	- we could implement a nested loop finding all pairs of elements and add them 
	```python
	for i in range(n-1):
		for j in range(i+1):
			if arr[i] + arr[j] == target:
				return [arr[i]m arr[j]]
	```

- efficient approach
	- using two pointers starting at the end points of the array, we can choose to increase or decrease our sum however we like
	if the current sum is less then we move closer to the right
	if the current sum is greater then we move closer to the left

**implementation**
```python
def twoSum(nums, target):
	left, right = 0, len(nums)-1
	
	curr_sum = 0
	while nums[left] + nums[right] != target:
		curr_sum = nums[left] + nums[right]
		if curr_sum < target:
			left += 1
		else:
			right -= 1
	
	return [left + 1, right + 1]
```

## variant iv: seeker and placeholder
**problem**
you are given an array, group all non-zero elements to the beginning of the array while maintaining their relative order. the modification must be done in-place
**approach**
one pointer will iterate over the array, finding non zero elements. the other pointer will point to the next valid position for a non zero element
**implementation**
```python
def moveNoneZero(nums):
	holder, seeker = 0, 0
	
	while seeker  < len(nums)):
		if nums[seeker] != 0:
			nums[seeker], nums[holder] = nums[holder], nums[seeker]
			holder += 1
		seeker += 1
	
	return nums
```

## variant v: for-while combo
**approach pattern**
- the for while combo is used when one pointer moves one step at a time, but the other moves multiple steps at a time
**problem**
you are given two arrays sorted in increasing order, for each element of the second array, find number of elements in the first array that are strictly less than it.
**approach**
- brute force approach
	- for every element in the second array, iterate over the first array and count the ones that are smaller than it, this is inefficient 0(n^2)
- efficient approach
	- we are going to move pointer j over array b and move i over array a until we find an ai from array a that is greater or equal to bj. at this point the value i will represent the number of elements in a that are less than bj
**implementation**
```python
def countSmaller(list_1, list_2):
	smaller_count = []
	first = []
	
	for second in range(len(list_2)):
		first += 1
	smaller_count.append(first)

return smaller_counts
```

## Related

- [[DSA MOC]] — Full map of DSA topics
- [[Binary Search]] — Both exploit sorted arrays; two pointers can replace binary search in some cases
- [[Sorting Basics]] — Two pointers on sorted arrays; merge sort uses pointer technique
- [[Graph Theory]] — Pointer traversal patterns mirror graph traversal concepts
- [[Recursion]] — Iterative two pointers vs recursive approaches
- [[Stacks, Queues and Monotonicity]] — Stack-based alternatives for some two-pointer problems

