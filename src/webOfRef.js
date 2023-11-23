"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hootReference = void 0;

const vscode = require('vscode')
const fs = require('fs')

class hootReference{
  _onDidChangeTreeData = new vscode.EventEmitter;
  onDidChangeTreeData = this._onDidChangeTreeData.event
  constructor(root) {
    this.root=root;
  }
  refresh(){
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    // get from db?
    return element;
  }

  getChildren(element) {

    if (element instanceof topRef) {

      return Promise.resolve(this.getRefMeta(element.meta));
    } else {
      let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))
      return Promise.resolve(this.getRefItems(data));
    }
  }
  getRefMeta(ref){
    const toMeta = (obj)=>{
      let state
      if (obj["notes"]||obj["inlineNotes"]||obj["refs"]){
        state = vscode.TreeItemCollapsibleState.Collapsed
      } else
      state = vscode.TreeItemCollapsibleState.None
      return new refMeta(
        Object.keys(obj)[0],
        obj[Object.keys(obj)[0]],
        state
      )
    }
    let meta = new Array
    for (let dataRef in ref){
      meta.push(toMeta(ref[dataRef]))
    }
    return meta
  }
  getRefItems(database) {
    const toRep = (data)=> {
      return new topRef(
        data,
        vscode.TreeItemCollapsibleState.Collapsed
      );
    }

    let refs = new Array
    for (let dataRef in database){
      refs.push(toRep(database[dataRef]))
    }
    return refs
    }
  
}
exports.hootReference = hootReference;
class topRef extends vscode.TreeItem {
  constructor(
    data,
    collapsibleState
  ) {
    let label = data['nickname']
    super(label, collapsibleState);
    this.meta = [
      {author:data["author"]},
      {id:data["id"]},
      {title:data["title"]},
      {year:data["year"]},
      {journal:data["journal"]},
      {pdfPath:data["pdfPath"]},
      {tags:data["tags"]},
    ]
  }
}

class refMeta extends vscode.TreeItem {
  constructor(
    field,
    meta,
    collapsibleState
  ) {
    super(field, collapsibleState);
    this.meta=meta;
    this.field=field;
    this.tooltip = `${this.meta}`;
    this.description = this.meta;
  }
}
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