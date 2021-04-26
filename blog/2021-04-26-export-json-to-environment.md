---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: true
hide_table_of_contents: false

slug: export-json-to-env
title: Export JSON to environment variables in BASH
tags: [bash, jq, json, env, environment variables]
description: Exports the contents of a JSON object to environment variables
---

**I need these key/value pairs from JSON exported to the environment**

There have been a few times where I've needed to take the contents of a JSON object and export them to the environment.  While there are surely lots of way to do this with `awk`, `sed`  and/or `jq` in combination, I've opted to just create a bash function for it.

**An input file called `config.json`**

Just a file with two key/value pairs, which will be used in the example below.

```json
{
  "XYZ_NAME": "test this!",
  "XYZ_PATH": "/tmp/foo"
}
```

**The JQ syntax used in the function**

[**`to_entries`**](https://stedolan.github.io/jq/manual/#to_entries,from_entries,with_entries)

Here we change the key/value object, into an array of consistent looking objects we can loop over.

```json
# Input
{"XYZ_NAME":"test this!","XYZ_PATH":"/tmp/foo"}
# Output
[{"key":"XYZ_NAME","value":"test"},{"key":"XYZ_PATH","value":"/tmp/foo"}]
```

[**`map("\(.key)=\(.value)")`**](https://stedolan.github.io/jq/manual/#map(x),map_values(x))

By looping over each consistent object, we create an array with strings of key/value pairs.

```json
# Input
[{"key":"XYZ_NAME","value":"test"},{"key":"XYZ_PATH","value":"/tmp/foo"}]
# Output
["XYZ_NAME=test this!","XYZ_PATH=/tmp/foo"]
```

[**`.[]`**](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[])

We now only extract the strings from within the array.

```json
# Input:
["XYZ_NAME=test this!","XYZ_PATH=/tmp/foo"]
# Output:
XYZ_NAME=test this!
XYZ_PATH=/tmp/foo
```

**Throwing this all into a bash function**

The reason this has to be a function vs. a script, is because in order for the enviroment variables to persist in the active shell after the script terminates.

```bash
function export_json_to_env () {
    INPUT_FILE="${1}"
    while IFS=$'\t\n' read -r LINE; do
        export "${LINE}"
    done < <(
        <"${INPUT_FILE}" jq \
            --compact-output \
            --raw-output \
            --monochrome-output \
            --from-file \
            <(echo 'to_entries | map("\(.key)=\(.value)") | .[]')
    )
}
```

The `while; do ... done` loops over each row returned from the `jq` command, which is piped into the loop using [Process Substitution](https://tldp.org/LDP/abs/html/process-sub.html).  It then exports each key value pair.

`--from-file` also uses Process Subsitution, in order to pretend it's pulling data from a JQ filter file.

**The result of invoking the function with a file**

```bash
#!/usr/bin/env bash
env | grep "YY\_" || echo -e "BEFORE: not found\n"

export_json_to_env "config.json"

echo "AFTER:"; env | grep "YY\_"
```

```text
BEFORE: not found

AFTER:
XYZ_PATH=/tmp/foo
XYZ_NAME=test this!
```

