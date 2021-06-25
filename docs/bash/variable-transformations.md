---
title: "Variable Transformations"
---

## tab delimited ids into multiple parameters

Example input in this case is a function that returns the default subnets for a region.

```bash
IFS=$'\n\t'
function default_subnets () {
  local REGION="${1}"
  aws \
    --output text --region "${REGION}" \
    ec2 describe-subnets \
    --filter 'Name=default-for-az,Values=true' \
    --query 'Subnets[*].SubnetId'
}
```

One thing to pay attention to here, when you echo without quoting the variable here, you'll end up with a space delimited string, but when you echo a quoted variable, you end up with the original, which is a TAB (`\t`) delimited string.  This can affect further flow of a script.

```bash
DEFAULT_SUBNETS="$(default_subnets 'us-east-1')"
echo A: ${DEFAULT_SUBNETS}
echo "B: ${DEFAULT_SUBNETS}"
```

> ```text
A: subnet-d6938df9 subnet-517ddd1b subnet-ef4044d0 subnet-2a08b725 subnet-52eef20f subnet-bdbd57da
B: subnet-d6938df9      subnet-517ddd1b subnet-ef4044d0 subnet-2a08b725 subnet-52eef20f subnet-bdbd57da
   ```

With people I've worked with there were generally two camps.

1. People that try to quote as little as possible, because the scripts pretty much always work
2. Another set of people, including myself, that don't like auto-magic things all that much, and use quotes everywhere for more guaranteed consistent outcome.

Honestly, in most simple scripts, I've not seen that this debate matters much, but I find bash scripts fairly difficult to debug, and so I try to avoid the surprises.  The quoting also adheres to the `shellcheck` standard, which will return an error like this.

```text
echo A: ${DEFAULT_SUBNETS}
        ^-- SC2086: Double quote to prevent globbing and word splitting.
```

Now, all that's left is to turn the string into multiple parameters.

```bash
read -a PARAMETERS <<< "$( \
  sed '/^$/!s/[^\t]*\t*/--subnet-id &/g' <<< "${DEFAULT_SUBNETS}" \
  )"
echo "hello ${PARAMETERS[@]} world (${#PARAMETERS[@]})"
```

> ```text
> hello --subnet-id subnet-d6938df9 --subnet-id subnet-517ddd1b --subnet-id subnet-ef4044d0 --subnet-id subnet-2a08b725 --subnet-id subnet-52eef20f
> --subnet-id subnet-bdbd57da world (6)
> ```

**Note**: *This will only work with GNU sed, not the POSIX sed*

To break down some parts of the `sed` expression:

- `/^$/!` states to match only lines not matching this patterns which in this case makes it ignore empty lines.
- `s/[^\t]*\t*/--subnet-id &/g` is a substitution, matching any non TAB character until it reaches a tab, then replaces everything it matched up until now with `--subnet-id &`, where the `&` means the entire match thus far.  So `subnet-d6938df9\t` turns into `--subnet-id subnet-d6938df9\t`.  The `g` option makes it then continue until there are no more matches.
