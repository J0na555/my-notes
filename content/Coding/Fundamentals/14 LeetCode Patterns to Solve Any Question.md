---
title: 1. Sliding Window
tags:
  - algorithm
  - dsa
  - leetcode
date: 2025-10-13
---

# 1. Sliding Window

![[Pasted image 20251013194740.png]]
[![](https://substackcdn.com/image/fetch/$s_!u-Nk!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F027104d2-a082-4ec3-965b-39cdec441299_2560x1440.png)

](<https://substackcdn.com/image/fetch/$s_!u-Nk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F027104d2-a082-4ec3-965b-39cdec441299_2560x1440.png>)

## When to use it?

1. Linear data structures (arrays, lists, strings)
2. Must scan through a subarray or substring
3. When the subarray must satisfy some condition (shortest/longest/min/max)
4. Improve [[Time  and Space Complexity of an algorithm|time complexity]] from O(N^2) to O(N)

## Technique

In the sliding window, you have **2 pointers, i and j**. Move j as far as you can until your condition is no longer valid, then move the i pointer closer to j until the condition is valid again to shrink the window. At every iteration, keep track of the min/max length of the subarray for the result. Without the sliding window technique, we would need to use a double for loop resulting in O(N^2) time. The sliding window is O(N) [[Time  and Space Complexity of an algorithm|time complexity]].

## Dynamic Sliding Window

![[Pasted image 20251013195430.png]]

In the dynamic sliding window, the size of the window (subarray between i and j) changes throughout the algorithm. In this example, we scan the subarray “bacb” and find that we have a duplicate “b”, so we will move the i pointer to shrink the window and move on to letter “a”, resulting in “acb”, then we start moving j again.

## Fixed Sliding Window

![[Pasted image 20251013195720.png]]
In the fixed sliding window, the size of the window is the same length throughout the algorithm. In this case, we need scan subarrays of length 3 for the final result, so we initialize i and j to indices 0 and 2 and at every iteration we increment i and j by 1.

```python
"""
A generic template for dynamic sliding window finding min window length
"""
def shortest_window(nums, condition):
    i = 0
    min_length = float('inf')
    result = None

    for j in range(len(nums)):
        # Expand the window
        # Add nums[j] to the current window logic

        # Shrink window as long as the condition is met
        while condition():  
            # Update the result if the current window is smaller
            if j - i + 1 < min_length:
                min_length = j - i + 1
                # Add business logic to update result

            # Shrink the window from the left
            # Remove nums[i] from the current window logic
            i += 1

    return result
```

```python

"""
A generic template for dynamic sliding window finding max window length
"""
def longest_window(nums, condition):
    i = 0
    max_length = 0
    result = None

    for j in range(len(nums)):
        # Expand the window
        # Add nums[j] to the current window logic

        # Shrink the window if the condition is violated
        while not condition():  
            # Shrink the window from the left
            # Remove nums[i] from the current window logic
            i += 1

        # Update the result if the current window is larger
        if j - i + 1 > max_length:
            max_length = j - i + 1
            # Add business logic to update result

    return result
```

```python
"""
A generic template for sliding window of fixed size
"""
def window_fixed_size(nums, k):
    i = 0
    result = None

    for j in range(len(nums)):
        # Expand the window
        # Add nums[j] to the current window logic

        # Ensure window has size of K
        if (j - i + 1) < k:
            continue

        # Update Result
        # Remove nums[i] from window
        # increment i to maintain fixed window size of length k
        i += 1

    return result
```

## LeetCode Questions

- [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)
- [424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/description/)
- [1876. Substrings of Size Three with Distinct Characters](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/description/)
- [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/)

---

[[leetcode cheetsheet|Leetcode Cheatsheet]]

## Related

- [[stack]]
