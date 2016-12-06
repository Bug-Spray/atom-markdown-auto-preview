'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(module.exports.autoPreview));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  serialize() { },

  autoPreview(editor) {
    var previewer = module.exports.findCounterpart(editor);
    console.log('Editor: ', editor);

    if (previewer !== null && module.exports.counterpartCanBeShown(editor, previewer)) {
      module.exports.activateCounterpart(previewer);
    }
  },

  findCounterpart(editor) {
    for (var idx = 0; idx < atom.workspace.getPaneItems().length; idx++) {

      var paneItem = atom.workspace.getPaneItems()[idx];
      if (paneItem.hasOwnProperty('editor') && (paneItem.editor === editor)) {
        console.log('Found previewer counterpart');
        return paneItem;
      }

    }
    console.log('A counterpart previewer doesn\'t seem to exist');
    return null;
  },

  counterpartCanBeShown(editor, previewer) {
    if (atom.workspace.paneForItem(previewer) !== atom.workspace.paneForItem(editor)) {
      console.log('The previewer is in a different pane to the editor');
      return true;
    } else {
      console.log('The previewer is in the same pane as the editor');
      return false;
    }
  },

  activateCounterpart(previewer) {
    console.log('Gonna make the previewer visible');
    atom.workspace.paneForItem(previewer).activateItem(previewer);
  }

};
