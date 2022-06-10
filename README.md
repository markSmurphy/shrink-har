# shrink-har

![Version](https://img.shields.io/npm/v/shrink-har?style=plastic)
![node-current](https://img.shields.io/node/v/shrink-har?style=plastic)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/99616f4abbc54e6fb78e888471814080)](https://www.codacy.com/gh/markSmurphy/shrink-har/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=markSmurphy/shrink-har&amp;utm_campaign=Badge_Grade)
![GitHub issues](https://img.shields.io/github/issues/markSmurphy/shrink-har?style=plastic)
[![Known Vulnerabilities](https://snyk.io/test/github/markSmurphy/shrink-har/badge.svg?targetFile=package.json)](https://snyk.io/test/github/markSmurphy/shrink-har?targetFile=package.json)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/shrink-har?style=plastic)
![Downloads Total](https://badgen.net/npm/dt/shrink-har)
![Downloads/Month](https://img.shields.io/npm/dm/shrink-har.svg?style=plastic)
![Last Commit](https://badgen.net/github/last-commit/markSmurphy/shrink-har)
![Licence](https://img.shields.io/npm/l/shrink-har.svg?style=plastic)

![shrink-har screenshot](./screenshots/analysis.gif)

**Shrink-HAR** is a command line utility that reduces the size of saved [HTTP Archive files](https://en.wikipedia.org/wiki/HAR_(file_format)) by removing the response body.

*Caution* This tool is destructive. If you're using `HAR` files to debug API responses, or any other payload, then this tool isn't for you. It is *only* useful if your debugging needs are limited to HTTP request/response headers thereby rendering the response bodies superfluous.

## Overview

HTTP Archive files can be large when they contain multiple response bodies. I wrote this tool when I needed to retain dozens of `HAR` files but was only interested in HTTP headers. The response bodies (images, CSS, Javascript, API JSON, etc) were superfluous to my needs but were the majority of the file sizes.

Shrink-HAR will:

* Analyse `HAR` files and report on potential savings.
* Optionally backup existing `HAR` files to a `ZIP` file before shrinking them.
* Shrink `HAR` files by stripping them, permanently, of all the response bodies.

## Installation

Install globally via `npm` using:

```shell
npm install -g shrink-har
```

## Usage

By default, running `shrink-har` without any options will result in an analysis of `*.har` files in the current directory:

```shell
shrink-har
```

This behaviour can be modified via the following options.

### --file <filespec>

`--file <filespec>`

Specifies a filename or, using wildcards, a file specification.

Default: `*.har`

e.g.

```shell
shrink-har --file www.amazon.co.uk.har
```

-or-

```shell
shrink-har --file *amazon*.har
```

### --directory

`--directory <path>`

Specifies the target directory.

Default: `.` (current working directory)

e.g.

```shell
shrink-har --directory ~/Downloads/
```

### --commit

`--commit`

Commit changes to files. If absent only an analysis is performed. A confirmation prompt is also shown, which can be modified with `--yes`.

Default: `false`

e.g.

```shell
shrink-har --commit
```

### --yes

`--yes`

Automatically answer "*yes*" to confirmation prompts. Use with `--commit`.

Default: `false`

e.g.

```shell
shrink-har --commit --yes
```

### --backup

``--backup``

Backup all target `.har` files into a single `.zip` file before committing changes.

Default: `false`

e.g.

```shell
shrink-har --commit --backup
```

### --verbose

`--verbose`

Enables verbose output.

Default: `false`

e.g.

```shell
shrink-har --verbose
```

### --debug

`--debug`

Enables debugging output.

Default: `false`

e.g.

```shell
shrink-har --debug
```

### --no-color

`--no-color`

Switches off colour output.

### --version

`--version`

Display version number.

### --help

`--help`

Displays help screen.

## Examples

### Analyse current directory

Analyse `*.har` in the current directory:

```shell
shrink-har
```

![shrink-har](./screenshots/analysis.gif)

---

### Verbose output of current directory's analysis

Analyse `*.har` in the current directory displaying verbose output

```shell
shrink-har --verbose
```

![shrink-har --verbose](screenshots/shrink-har--verbose.gif)

---

### Shrink all HAR files in current directory (interactive)

Shrink `*.har` in the current directory, with a confirmation prompt

```shell
shrink-har --commit
```

![shrink-har --commit](./screenshots/shrink-har--commit.gif)

---

### Backup and Shrink all HAR files in current directory (silent)

Shrink `*.har` in the current directory, with no prompts, after making a backup

```shell
shrink-har --commit --yes --backup
```

![shrink-har --commit --yes --backup](./screenshots/shrink-har--commit--yes--backup.gif)

---

### Shrink specific file in specific directory (interactive)

Shrink the file `www.example.com.har` in `./Downloads` after a confirmation prompt

```shell
shrink-har --file www.example.com.har --directory ./Downloads --commit
```

![shrink-har --file www.example.com.har --directory ./Downloads --commit](./screenshots/shrink-har--file--directory--commit.gif)

---

### Shrink all HAR files in specific directory without backing up (silent)

Shrink `*.har` in `./Downloads/HARFiles/` without backing up and with no prompt

> Warning, this command permanently removes data silently

```shell
shrink-har --directory ./Downloads/HARFiles/ --commit --yes
```

![shrink-har --directory ./Downloads/HARFiles/ --commit --yes](./screenshots/shrink-har--directory--commit--yes.gif)

## Change Log

The **Change Log** can be found [here](CHANGELOG.md)
