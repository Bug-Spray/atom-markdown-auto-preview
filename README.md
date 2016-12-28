# Atom Markdown Auto-Preview

## Blurb

Automatically activates the preview tab corresponding to a Markdown source file (if open in a different pane).
Works a treat with `markdown-scroll-sync`!

![Screencap in action](https://cloud.githubusercontent.com/assets/10861177/20911665/ad3c5d84-bbbd-11e6-97c5-6a0270c310ef.gif)

## Features

* When switching to a Markdown file, makes the corresponding preview active (visible)
  * If it has already been opened
  * Is in a different pane/group to the source file

* When opening a Markdown file, opens the preview pane (optional)
* When closing a Markdown file, closes the corresponding preview (optional)

## Fiddly bits

The module works on the following logic:
  * If the previewer exists, and
  * If the previewer is in a different pane, then
  * Make the previewer visible

The module uses the same logic as the `Markdown Preview: Toggle` command to determine the counterpart preview tab for a Markdown editor
