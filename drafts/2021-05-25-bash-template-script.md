---
author: Phil Hadviger
author_title: Principal Site Reliability Engineer @ GLG
author_url: https://github.com/datfinesoul
author_image_url: https://s.gravatar.com/avatar/fbd101f7b02677e16044db00640c727f?s=80
draft: false
hide_table_of_contents: false

slug: bash-template-script
title: My BASH Template for Executable Scripts
tags: [bash, template, shell, script, stderr, log, trap, readlink, bash strict mode]
description: A base template I use for most of my bash scripts
---

## The Template

Since I can never truly remember all there is to bash, i've made a template I re-use for a lot of my bash scripts, to remind myself of useful starting points.  I'll post the whole template first, and then I'll explain it in smaller sections below.

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

LOG="$(mktemp /tmp/placeholder.XXXXXXXX)"
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

The template uses `readlink` as a way to find a full paths of files and directories.  I've found `readlink` to be the most reliable method, but it isn't created equally on Linux and OS-X (and some other systems).  So in parts of the template you'll see me use it like this: `"${readlink}" -e -- /tmp/bla`.  I need to use the GNU compatible version of `readlink` and so I create a variable for it, and execute that one instead a hardcoded executable.  The `readlink -e` part detects if the current version of `readlink` supports the `-e` flag, and if it doesn't it tries to use `greadlink` instead.  Not 100% failsafe, but works well enough so far.

### The Variables

```bash {4,5}
SCRIPT="$("${readlink}" -e -- "${0}")" # full path to script
SCRIPT_DIR="$(dirname "${SCRIPT}")" # full path to script dir
SCRIPT_BASE="$(basename "${SCRIPT}")" # script filename
_PWD="$(pwd)" # hack for docusaurus color coding
CURRENT_DIR="$("${readlink}" -e -- "${_PWD}")" # current dir full path
PID="$$" # process id
```

These are fairly self explanatory, and are used in other parts of the template.  The `_PWD` that's used here, is purely present cause I could not get this template to properly color code in the Blog.  I would other omit it.

### Bash Strict Mode

[Aaron Maxwell](http://redsymbol.net/articles/unofficial-bash-strict-mode/) wrote about this in detail on his site, so head on over there if you are interested on what is all about.

```bash
set -o errexit
set -o nounset
set -o pipefail
IFS=$'\n\t'
```

I use to to more reliably process input, and fail on unset variables and errors.

### Exit Trap

Not all of my scripts use a trap this elaborate, but like I mentioned the template is just a reminder of how to do things.

Traps are just an amazing way to tie up a script, provide a little more insight into how the script ended, and also clean up temporary resources that might have been created by a script.

[Greg "GreyCat"'s Wiki](https://mywiki.wooledge.org/SignalTrap) has an in-depth overview of traps and signals.

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

In some cases, having a variety of different ways of handling an exit can be very nice.  One thing to be aware of about signal handlers like SIGINT, (rather than using the EXIT trap), is that the process [should kill itself with SIGINT](http://www.cons.org/cracauer/sigint.html) rather than simply exiting, to avoid causing problems for its caller.

Also, traps need to be defined as high as possible in the scripts to actually handle all the signals and errors properly.

### Logging

```bash
# log all outputs to a file as well
LOG="$(mktemp /tmp/placeholder.XXXXXXXX)"
exec &> >(tee "${LOG}")
```

One of the most important setups I use.  This takes both `stderr` and `stdout` and prints the to the screen and a log file, for all commands in this script.  So no need to run `command > file-name 2>&1` because the output will already be in a log file of your choice.

**Note**: Some scripts can make great benefit of keeping stderr separate from stdout, especially when the output of the command is used in a pipe.  For those scripts, I would not recommend sending both streams to the tee command, and instead only send `stdout`.

### The Rest

```bash
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

