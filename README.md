# Markdown Preview Auto-show

Automatically activates the preview tab corresponding to a Markdown source file (if open in a different pane).
Works a treat with `markdown-scroll-sync`!

The module works on the following logic:
  * If the previewer exists, and
  * If the previewer is in a different pane, then
  * Make the previewer visible

The module scans all open tabs for ones which have an 'editor' property, to identify preview-type tabs

The 'editor' property must match the editor which has just been made active:
  * Sometimes this fails after reloading a window or in similar circumstances
  * The preview tabs persist, but this link back to the source editor is no longer valid (a limitation of Atom)

![Screencap in action](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
