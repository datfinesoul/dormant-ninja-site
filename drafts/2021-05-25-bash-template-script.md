---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: false
hide_table_of_contents: false

slug: bash-template-script
title: My BASH Template for Executable Scripts
tags: [bash, template, shell, script, stderr, log]
description: A base template I use for most of my bash scripts
---

## The Template

Since I can never truly remember all there is to bash, i made a template I use for a lot of my bash scripts, to remind myself of important pieces of a script.  I'll post the whole template, and then I'll explain it in smaller sections below.

<!--truncate-->

```bash title="template.bash"
#!/usr/bin/env bash
readlink='readlink'
readlink -e /tmp > /dev/null 2>&1
if [[ "$?" -ne 0 ]]; then
  readlink='greadlink'
fi

SCRIPT="$("${readlink}" -e -- "${0}")" # full path to script
SCRIPT_DIR="$(dirname "${SCRIPT}")" # full path to script dir
SCRIPT_BASE="$(basename "${SCRIPT}")" # script filename
_PWD="$(pwd)" # hack for docusaurus color coding
CURRENT_DIR="$("${readlink}" -e -- "${_PWD}")" # current dir full path
PID="$$" # process id

set -o errexit
set -o nounset
set -o pipefail
IFS=$'\n\t'

function cleanup {
  # shellcheck disable=SC2154
  if [ -n "${1:-}" ]; then
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Aborted by ${1:-}"
  elif [ "${status}" -ne 0 ]; then
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Failure (status $status)"
  else
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Success"
  fi
}
export -f cleanup
trap 'status=$?; cleanup; exit $status' EXIT
trap 'trap - HUP; cleanup SIGHUP; kill -HUP $$' HUP
trap 'trap - INT; cleanup SIGINT; kill -INT $$' INT
trap 'trap - TERM; cleanup SIGTERM; kill -TERM $$' TERM

# log all outputs to a file as well
LOG="$(mktemp /tmp/my.XXXXXXXX.log)"
exec &> >(tee "${LOG}")

if [[ "${SCRIPT_DIR}" != "${CURRENT_DIR}" ]]; then
  >&2 echo ":: please execute this script from its own directory"
  exit 1
fi

if [[ "$(id -u)" -eq "0" ]]; then
  >&2 echo ":: please DO NOT run as root"
  exit 1
fi

if [[ "$(uname -s)" == "Darwin" ]]; then
  true
else
  true
fi
```

### `readlink`

```bash
readlink='readlink'
readlink -e /tmp > /dev/null 2>&1
if [[ "$?" -ne 0 ]]; then
  readlink='greadlink'
fi
```

The template uses `readlink` as a way to find full paths of files.  I've found `readlink` to be the most reliable method, but it isn't created equally on Linux and OS-X (and some other systems).  So in parts of the template you'll see me use it like this: `"${readlink}" -e -- /tmp/bla`.  I need to use the GNU compatible version of `readlink` and so I create a variable for it, and execute that one instead.  The `readlink -e` part detects if the current version of `readlink` supports the `-e` flag, and if it doesn't it tries to use `greadlink` instead.  Not 100% failsafe, but works well enough for me so far.

### The Variables

```bash {4,5}
SCRIPT="$("${readlink}" -e -- "${0}")" # full path to script
SCRIPT_DIR="$(dirname "${SCRIPT}")" # full path to script dir
SCRIPT_BASE="$(basename "${SCRIPT}")" # script filename
_PWD="$(pwd)" # hack for docusaurus color coding
CURRENT_DIR="$("${readlink}" -e -- "${_PWD}")" # current dir full path
PID="$$" # process id
```

These are fairly self explanatory, and are used in other parts of the template.  The `_PWD` that's used here is purely present cause I could not get the script to properly color code for the Blog, but can otherwise be omitted.

### Bash Strict Mode

Best read about on [this site](http://redsymbol.net/articles/unofficial-bash-strict-mode/) since the author goes very in-depth about these lines.

```bash
set -o errexit
set -o nounset
set -o pipefail
IFS=$'\n\t'
```

I use to to more reliably process input, and fail on unset variables and errors.

### Exit Trap

```bash
function cleanup {
  # shellcheck disable=SC2154
  if [ -n "${1:-}" ]; then
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Aborted by ${1:-}"
  elif [ "${status}" -ne 0 ]; then
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Failure (status $status)"
  else
    >&2 echo ":: ${SCRIPT_BASE}:${PID}:${LOG} Success"
  fi
}
export -f cleanup
trap 'status=$?; cleanup; exit $status' EXIT
trap 'trap - HUP; cleanup SIGHUP; kill -HUP $$' HUP
trap 'trap - INT; cleanup SIGINT; kill -INT $$' INT
trap 'trap - TERM; cleanup SIGTERM; kill -TERM $$' TERM
```

