'use babel';

import { CompositeDisposable } from 'atom';

import osc from 'osc'

var oscPort = undefined;

export default {


  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'text-send:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    if (oscPort==undefined){
      oscPort = new osc.UDPPort ({
        localAddress: "0.0.0.0",
        localPort:9004,
        remoteAddress: "127.0.0.1",
        remotePort:9003
      })
      oscPort.open();
    }

    // console.log("console works")
    let editor
    if (editor = atom.workspace.getActiveTextEditor()){
      // console.log("editor exists")
      editor.onDidChange (function (event){
          // console.log("did change happened")
          var text = editor.getText();
          oscPort.send({address:"/atom/text",args:[text]})
      })
    }
  }

};
