const vscode = require('vscode')
const fs = require('fs')

class hootReference extends vscode.TreeDataProvider{
  constructor() {  }

  getTreeItem(element) {
    // get from db?
    return element;
  }

  getChildren(element) {

    if (element) {
      return undefined;
    } else {
      let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"project_db.json"))
      return this.getRefItems(data)
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
      refs.push(toRep(dataRef['id']))
    }
    return refs
    }
}

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