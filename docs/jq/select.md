---
title: "jq: select"
---

[Official Documentation](https://stedolan.github.io/jq/manual/#select(boolean_expression))

## missing array fields

Similar to something like
[javascript optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
, the select operator can work on array fields that might or might not exist.


```bash
Input:  '{"x": {"y": [1,2,3], "z": [4,5]}}'

        jq '.x.y[]'
Output: 1
        2
        3

        jq '.x.a[]'
Output: jq: error (at <stdin>:1): Cannot iterate over null (null)
```

Using select to deal with missing fields.


```bash
Input:  '{"x": {"y": [1,2,3], "z": [4,5]}}'

        jq '.x|select(.y).y[]'
Output: 1
        2
        3

        jq '.x|select(.a).a[]'
Output:
```

The [alternative operator](https://stedolan.github.io/jq/manual/#Alternativeoperator://)
can be used in this example as well.  Not sure which ends up being more readable.


```bash
Input:  '{"x": {"y": [1,2,3], "z": [4,5]}}'

        jq '.x|(.y//[])[]'
Output: 1
        2
        3

        jq '.x|(.a//[])[]'
Output:
```
