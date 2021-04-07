---
title: "jq: select"
---

[Official Documentation](https://stedolan.github.io/jq/manual/#select(boolean_expression))

## missing array fields

Similar to something like
[javascript optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
, the select operator can work on array fields that might or might not exist.


```bash
Input:  '{"x": {"y": [1,2,3]}}'

        jq '.x.y[]'
Output: 1
        2
        3

        jq '.x.z[]'
Output: jq: error (at <stdin>:1): Cannot iterate over null (null)
```

Using select to deal with missing fields.


```bash
Input:  '{"x": {"y": [1,2,3]}}'

        jq '.x|select(.y)[]'
Output: 1
        2
        3

        jq '.x|select(.z)[]'
Output:
```

The [alternative operator](https://stedolan.github.io/jq/manual/#Alternativeoperator://)
can be used in this example as well, but I just don't find it as readable as the select method.


```bash
Input:  '{"x": {"y": [1,2,3]}}'

        jq '.x|(.y//[])[]'
Output: 1
        2
        3

        jq '.x|(.z//[])[]'
Output:
```
