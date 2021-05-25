---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: false
hide_table_of_contents: false

slug: start-at-the-end
title: Starting your Project at the End
tags: [coding, philosophy, recursion, project planning]
description: Starting at the end can often be more beneficial than working forwards
---

## It started with recursion for me

One of my first computer science class lessons that stuck with me the longest was when we were introduced to recursion.  Focus on the stopping case!

With iteration, the approach was generally simple: pick a starting point, and stop at the end. For example, use a for loop to add up the numbers 1 through n.  Simple, just declare a sum variable have each step of the loop increment the sum until you reach 1.

```c
int add_all(int max) {
  int sum=0;
  for (; max >= 1; --max) {
    sum += max;
  }
  return sum;
}
```

Recursion was a different beast, because we didn't really have sum as a variable and had to add the results of more function calls until we reach a stopping case, at which point we did something completely different and returned just a number.

```c
int add_all(int max) {
  if (max < 1) {
    return 0;
  } else if (max == 1) {
    return 1;
  } else {
    return max + add_all(max - 1);
  }
}
```

Since we don't have the luxury of the `sum` variable that is part of the iteration, the stopping case in the recursive example is really important to think about if you want the results to come back the same as the iterative version.

