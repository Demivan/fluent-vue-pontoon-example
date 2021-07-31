fluent-vue-cli
==============

fluent-vue CLI for exporting and importing translations from Vue files

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fluent-vue-cli.svg)](https://npmjs.org/package/fluent-vue-cli)
[![Downloads/week](https://img.shields.io/npm/dw/fluent-vue-cli.svg)](https://npmjs.org/package/fluent-vue-cli)
[![License](https://img.shields.io/npm/l/fluent-vue-cli.svg)](https://github.com/Demivan/fluent-vue-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fluent-vue-cli
$ fluent-vue COMMAND
running command...
$ fluent-vue (-v|--version|version)
fluent-vue-cli/0.0.0 linux-x64 node-v14.17.3
$ fluent-vue --help [COMMAND]
USAGE
  $ fluent-vue COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fluent-vue extract FILES`](#fluent-vue-extract-files)
* [`fluent-vue help [COMMAND]`](#fluent-vue-help-command)

## `fluent-vue extract FILES`

describe the command here

```
USAGE
  $ fluent-vue extract FILES

ARGUMENTS
  FILES  list of files to extact translations from

OPTIONS
  -h, --help       show CLI help
  --outDir=outDir  (required)

EXAMPLE
  $ fluent-vue extract src/**/*.vue src/**/*.{lang}.ftl
```

_See code: [src/commands/extract.ts](https://github.com/Demivan/fluent-vue-cli/blob/v0.0.0/src/commands/extract.ts)_

## `fluent-vue help [COMMAND]`

display help for fluent-vue

```
USAGE
  $ fluent-vue help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
