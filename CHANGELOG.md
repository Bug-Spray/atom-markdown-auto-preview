# 1.1.0 - Features rounding-out (14 Dec 2016)
## Features
* Can automatically open the previewer on file open
* Can automatically close the previewer on file close
* Added settings
  * To allow/disable taking action on file opens and closes
  * To bypass all auto- behaviours with modifier keys
* Better use of Atom's API, after reading more internal code, etc.

## Fixes
* Added debug-mode variable; no longer spams the console

## Known issues
* Nil


# 1.0.1 - Patch (6 Dec 2016)
## Fixes
* Added a demo gif

## Known issues
* Some debug code still present in pushed version


# 1.0.0 - First Release (6 Dec 2016)
## Features
* Got the basics working - activates the corresponding tab, based on activation logic

## Known issues
* The 'editor' property must match the editor which has just been made active
  * Sometimes this fails after reloading a window or in similar circumstances
  * The preview tabs persist, but this link back to the source editor is no longer valid (a limitation of Atom, it seems)
  * Maybe there is a better way of tying a previewer back to the source editor...
