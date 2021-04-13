---
title: "jq: passing json to jq"
---

Read this [excellent wikipedia page](https://en.wikipedia.org/wiki/Here_document) for
more information about here-documents and other variations thereof.

The content on this page was written primarily from a bash user point of view.

## using `echo`

One way that I see people using jq is by using echo piped into jq.

```bash
echo '{"x": {"y": [1,2,3], "z": [4,5]}}' | jq '.'
```

## using here-strings

Doing the same with with here-strings looks as follows.

```bash
<<< '{"x": {"y": [1,2,3], "z": [4,5]}}' jq '.'
```

## using `cat`

```bash
cat myfile | jq '.'
```

## using a file
