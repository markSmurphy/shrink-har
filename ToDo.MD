# TO DO

## Bugs

## Chores

* Import repo into `GitHub`
* Change `package.json` references to GitHub from ~~BitBucket~~
* Add `npmjs` and `GitHub` badges into ReadMe
* Complete initial [Change Log](CHANGELOG.md)

## Features

* Workout the maximum `json` file size which is supported and supply warning for larger files
  * Address limitation through implementation of `streams`
* Readme documentation needs much work
* Add Test Suite
* Add `total space spaced` metric

### Future Features

* Expand `.har` analysis into:
  * Request cookies
  * Response cookies
  * Request body (i.e. `POST` uploads etc)

## Complete

* ~~Colour `--commit` output columns~~
* ~~Add shortcut `-y` to `--help` screen for `--yes`~~
* ~~Produce a different output after committing changes which include file system before/after sizes~~
* ~~Change Analysis output columns to distinguish `size` and `file size`~~
* ~~When parsing of .har file fails, the `# Requests` column shows `undefined` rather than `N/A`~~
* ~~Wildcard `--file` values cause a crash (e.g. `node ./shrink-har.js --directory ./test/har/ --debug --file c*.har`)~~
* ~~A single file is not recognised when passed via the command line `node shrink-har.js www.cazoo.com.har --directory test/har/` and *.har is incorrectly used instead~~
* ~~Add `--file` switch~~
* ~~Include working directory in the output.~~
* ~~Change `Reduction` and `Reduction Percent` column colours to highlight the most space savings ()> 50%)~~
* ~~Format Column Header text so it's not all Caps~~
* ~~Add `--verbose` output and additional columns~~
* ~~Fix `ora` spinner activity updates by calling `spinner.render()`~~
* ~~Add ability to write changes if `--commit` is provided~~
* ~~Add confirmation prompt before writing changes~~
* ~~Add warning if committing changes without `--backup`~~
* ~~Skip confirmation prompt if `-y` `--yes` is provided~~
* ~~List out use cases with CLI argument combinations and expected behaviour for:~~
  * ~~Better examples in `--help` screen~~
* ~~Improve `Done.` message at the end to make it clearer what's been *done*.~~
