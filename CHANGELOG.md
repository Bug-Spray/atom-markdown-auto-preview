# 1.0.0 - First Release (6 Dec 2016)
## Features
* Got the basics working - activates the corresponding tab, based on activation logic
## Known issues
* The 'editor' property must match the editor which has just been made active
  * Sometimes this fails after reloading a window or in similar circumstances
  * The preview tabs persist, but this link back to the source editor is no longer valid (a limitation of Atom, it seems)
  * Maybe there is a better way of tying a previewer back to the source editor...
