"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hootReference = void 0;

const vscode = require('vscode')
const fs = require('fs')

class hootReference{
  constructor(root) {
    this.root=root;
  }

  getTreeItem(element) {
    // get from db?
    return element;
  }

  getChildren(element) {

    if (element) {
      return Promise.resolve([]);
    } else {
      let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))
      return Promise.resolve(this.getRefItems(data));
    }
  }

  getRefItems(database) {
    const toRep = (label)=> {
      return new topRef(
        label,
        vscode.TreeItemCollapsibleState.None
      );
    }

    let refs = new Array
    for (let dataRef in database){
      refs.push(toRep(database[dataRef]['id']))
    }
    return refs
    }
}
exports.hootReference = hootReference;
class topRef extends vscode.TreeItem {
  constructor(
    label,
    collapsibleState
  ) {
    super(label, collapsibleState);
  }
}

// class refMeta extends vscode.TreeItem {
//   constructor(
//     label,
//     string,
//     collapsibleState
//   ) {
//     super(label, collapsibleState);
//     this.tooltip = `${this.label}-${this.version}`;
//     this.description = this.version;
//   }
// }
// class subRef extends vscode.TreeItem {
//   constructor(
//     label,
//     string,
//     collapsibleState
//   ) {
//     super(label, collapsibleState);
//     this.tooltip = `${this.label}-${this.version}`;
//     this.description = this.version;
//   }
// }