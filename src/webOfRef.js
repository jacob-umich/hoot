"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hootReference = void 0;

const vscode = require('vscode')
const fs = require('fs')

class hootReference{
  _onDidChangeTreeData = new vscode.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event
  constructor(root,detailview) {
    this.root=root;
    this.detailview=detailview
    // re arrange data so category is on top
  }
  refresh(){
    this._onDidChangeTreeData.fire();
  }

  
  getTreeItem(element) {
  // get from db?
  return element;
  }
  
  getChildren(element) {
    
    // if element is a reference
    if (element instanceof topRef) {
      
      return Promise.resolve(this.getRefMeta(element.meta));
    } else if (element instanceof refCat){
      return Promise.resolve(this.getRefItems(element));
    } else {
      // root case
      this.data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))

      return Promise.resolve(this.getRefCategory());
    }
  }
  getRefCategory(){
    const toCat = (cat,id)=>{
      return new refCat(cat,vscode.TreeItemCollapsibleState.Collapsed,this.detailview,id)
    }
    let cats = new Array
    let id=0
    for (let cat in this.data["categories"]){

      cats.push(toCat(this.data["categories"][cat],id))
      id++
    } 
    return cats
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
  getRefItems(category) {
    const toRep = (data)=> {
      return new topRef(
        data,
        vscode.TreeItemCollapsibleState.Collapsed
      );
    }

    let refs = new Array
    for (let dataRef in this.data["references"]){
      if (this.data["references"][dataRef].category==category.id){
        refs.push(toRep(this.data["references"][dataRef]))
        
      } else if (category.id==0 && typeof(this.data["references"][dataRef].category)=="undefined"){
        refs.push(toRep(this.data["references"][dataRef]))
      }
    }
    return refs
    }
  // getCatItem()
}
exports.hootReference = hootReference;

class refCat extends vscode.TreeItem {
  constructor(
    data,
    collapsibleState,
    detailview,
    id
  ) {
    let label = data['name']
    super(label, collapsibleState);
    this.detailview=detailview;
    this.id=id
  }
}
exports.refCat=refCat
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