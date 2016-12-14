'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  handleOpens: null,
  handleCloses: null,
  dontSwitch: null,
  altKey: null,
  ctrlKey: null,
  metaKey: null,
  shiftKey: null,

  debugOutput: false,


  config: {
    handleOpens: {
      title: 'Observe Opens',
      description: 'Automatically open a previewer pane when opening a markdown file',
      type: 'boolean',
      default: false,
      order: 1
    },
    handleCloses: {
      title: 'Observe Closes',
      description: 'Automatically close a previewer pane when the last editor for that file is closed (Markdown files)',
      type: 'boolean',
      default: false,
      order: 2
    },

    behaviour: {
      title: 'Prevent Behaviour',
      type: 'object',
      properties: {
        dontSwitch: {
          title: 'Bypass Modifiers',
          description: 'Bypass default behaviour (activating the preview, *and* open/close handlers), if:',
          type: 'boolean',
          default: true,
          order: 10,
        },
        withAlt: {
          title: 'Alt is pressed',
          type: 'boolean',
          default: false,
          order: 20
        },
        withCtrl: {
          title: 'Ctrl is pressed',
          type: 'boolean',
          default: false,
          order: 30
        },
        withMeta: {
          title: 'Meta (Win/Mac) is pressed',
          type: 'boolean',
          default: false,
          order: 40
        },
        withShift: {
          title: 'Shift is pressed',
          type: 'boolean',
          default: true,
          order: 50
        }
      }
    }
  },


  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register open and close functions
    this.subscriptions.add(atom.workspace.onDidOpen(module.exports.openHandler));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(module.exports.closeHandler));

    // Register command that toggles this view
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(module.exports.autoPreview));

    // Register inhibitor behaviour handle
    atom.views.getView(atom.workspace).addEventListener('keydown', module.exports.keyTracker);
    atom.views.getView(atom.workspace).addEventListener('keyup', module.exports.keyTracker);

  },

  deactivate() {
    atom.views.getView(atom.workspace).removeEventListener('keydown', module.exports.keyTracker);
    atom.views.getView(atom.workspace).removeEventListener('keyup', module.exports.keyTracker);
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  serialize() { },

  autoPreview(editor) {
    if (!atom.workspace.isTextEditor(editor)) {
      module.exports.debugOutput && console.log('The activated pane item was not an editor');
      return;
    }

    module.exports.debugOutput && console.log('Activated editor: ', editor.getTitle());

    if (module.exports.bypassAction()) { return; }

    previewURI = module.exports.previewURI(editor);
    previewPane = atom.workspace.paneForURI(previewURI);
    if (!previewPane) {
      module.exports.debugOutput && console.log('There is no preview for this editor');
      return;
    }

    previewItem = previewPane.itemForURI(previewURI);
    module.exports.debugOutput && console.log('Corresponding previewer: ', previewItem.getTitle());

    if (previewPane !== atom.workspace.paneForItem(editor)) {
      module.exports.debugOutput && console.log('The previewer is in a different pane; activating');
      previewPane.activateItem(previewItem);
    } else {
      module.exports.debugOutput && console.log('The previewer is in the same pane; aborting');
    }
  },

  openHandler(event) {
    if (!event.item || !atom.workspace.isTextEditor(event.item)) {
      module.exports.debugOutput && console.log('The opened pane item was not a text editor');
      return;
    } else {
      module.exports.debugOutput && console.log('Opened editor: ', event.item.getTitle());
    }

    if (atom.workspace.paneForURI(module.exports.previewURI(event.item))) {
      module.exports.debugOutput && console.log(`The previewer for ${event.item.getTitle()} has already been opened`);
      return;
    }

    if (!atom.config.get('atom-markdown-auto-preview.handleOpens')) {
      module.exports.debugOutput && console.log('Config is set to ignore file opens');
      return;
    }

    if (module.exports.bypassAction()) { return; }

    // Open the preview
    if ('getGrammar' in event.item &&
        event.item.getGrammar() &&
        event.item.getGrammar().name.includes('Markdown')) {
      module.exports.debugOutput && console.log('Opening the previewer with :toggle');
      atom.commands.dispatch(atom.views.getView(event.item), 'markdown-preview:toggle');
    } else {
      module.exports.debugOutput && console.log('The file is not a Markdown file; aborting');
    }
  },

  closeHandler(event) {
    if (!event.item || !atom.workspace.isTextEditor(event.item)) {
      module.exports.debugOutput && console.log('The closed pane item was not a text editor');
      return;
    } else {
      module.exports.debugOutput && console.log('Closed editor: ', event.item.getTitle());
    }

    if (!atom.config.get('atom-markdown-auto-preview.handleCloses')) {
      module.exports.debugOutput && console.log('Config is set to ignore file closes');
      return;
    }

    if (module.exports.bypassAction()) { return; }

    // Close the preview
    previewURI = module.exports.previewURI(event.item);
    previewPane = atom.workspace.paneForURI(previewURI);
    if (previewPane) {
      module.exports.debugOutput && console.log('Destroying previewer for ', event.item.getTitle());
      previewPane.destroyItem(previewPane.itemForURI(previewURI));
    } else {
      module.exports.debugOutput && console.log('There is no preview open for ', event.item.getTitle());
    }
  },

  previewURI(editor) {
    return `markdown-preview://editor/${editor.id}`;
  },

  keyTracker(event) {
    module.exports.debugOutput && console.log('Event: ', event);
    module.exports.debugOutput && console.log('Module.exports: ', module.exports);
    module.exports.altKey = event.altKey;
    module.exports.ctrlKey = event.ctrlKey;
    module.exports.metaKey = event.metaKey;
    module.exports.shiftKey = event.shiftKey;
  },

  bypassAction() {
    if (atom.config.get('atom-markdown-auto-preview.behaviour.dontSwitch') === true &&
        module.exports.altKey === atom.config.get('atom-markdown-auto-preview.behaviour.withAlt') &&
        module.exports.ctrlKey === atom.config.get('atom-markdown-auto-preview.behaviour.withCtrl') &&
        module.exports.metaKey === atom.config.get('atom-markdown-auto-preview.behaviour.withMeta') &&
        module.exports.shiftKey === atom.config.get('atom-markdown-auto-preview.behaviour.withShift')) {
      module.exports.debugOutput && console.log('Bypass modifiers match config settings');
      return true;  // bypass modifiers are pressed
    } else {
      module.exports.debugOutput && console.log('No modifier bypass will occur');
      return false;  // bypass modifiers don't match
    }
  }

};
