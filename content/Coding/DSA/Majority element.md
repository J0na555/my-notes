#leetcode #dsa 

# [Leetcode Majority Element ](https://leetcode.com/problems/majority-element/)

### Boyer-Moore Majority Voting Algorithm
It relies on the mathematical principle that if we cancel out each majority element with a non majority element, the majority element will still be left.

#### How it works
- initialize a *candidate* var and a *count* car set to 0
- iterate through the array nums
- if count is 0, assign the curr element as the new candidate
- if the curr element matches the *candidate*, increment count by 1
- if it doesnot match, decrement *count* by 1
- Return *candidate* at the end of iteration
#### Complexity
- Time complexity: 0(n) only a single pass throug
- Space complexity: 0(1) uses constant extra space for var

#### Implementation
```python
def majorityElement(nums: list[int]) -> int:
    candidate = None
    count = 0
    
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
        
    return candidate
```

```cpp
#include <vector>

class Solution {
public:
    int majorityElement(std::vector<int>& nums) {
        int candidate = 0;
        int count = 0;
        
        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }
        
        return candidate;
    }
};
```