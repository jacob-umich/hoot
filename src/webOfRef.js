"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hootReference = void 0;

const hootCommands = require('./commands.js')
const vscode = require('vscode')
const fs = require('fs')

const documentDropEditProvider = {
    async provideDocumentDropEdits(document, position, dataTransfer) {
        let textItem
        for (const [mime, item] of dataTransfer) {
            if (mime === 'text/uri-list') {
                const file = await item.asString()
                let parts = file.split('/')
                let name = parts[parts.length-1].slice(0,-3)
                return {
                    insertText: '\\cite{' + name + '}',
                }
            }

            // make sure reference is in bib

            // if (mime === 'text/plain') {
            //     textItem = item
            //     continue
            // }
            // if (!mime.startsWith('image/')) {
            //     continue
            // }
            // const file = item.asFile()
            // if (!file) {
            //     continue
            // }
            // const additionalEdit = new WorkspaceEdit()
            // additionalEdit.createFile(Uri.joinPath(document.uri, '..', file.name), {
            //     contents: file,
            //     ignoreIfExists: true
            // })
            // return {
            //     insertText: '![](' + file.name + ')',
            //     additionalEdit
            // }
        }
        // if (textItem) {
        //     const string = await textItem.asString()
        //     return {insertText: string}
        // }
        // return {
        //     insertText: ''
        // }
    }
}



class dragDrop{
    dropMimeTypes = ['application/vnd.code.tree.hootref','test/uri-list'];
    dragMimeTypes = ['text/uri-list'];
    constructor(data_path){
        this.data_path = data_path
    }

    async handleDrop(target, sources, token){
        this.data = JSON.parse(fs.readFileSync(this.data_path))
		const transferItem = sources.get('application/vnd.code.tree.hootref').value;
		if (!transferItem) {
			return;
		}
        // get category id
        let new_category
        for (let i=0;i<this.data.categories.length;i++){
            if (this.data.categories[i].name==target.label){
                new_category=i
                break
            }
        }

        for (let i=0;i<transferItem.length;i++){
            let item = transferItem[i];
            for (let j=0;j<this.data.references.length;j++){
                let old_item = this.data.references[j];
                if (old_item.id==item.meta[1].id){
                    old_item.category=new_category
                }
            }

        }
        hootCommands.save_db(this.data)
        vscode.commands.executeCommand("hoot.refresh")
	}

	async handleDrag(source, treeDataTransfer, token){
        console.log(source)
        let file_name = `${source[0].label}.md`
        let path = vscode.workspace.rootPath +"/project_db/notes/"+file_name
        let uri = vscode.Uri.file(path).toString()
		treeDataTransfer.set('application/vnd.code.tree.hootref', new vscode.DataTransferItem(source));
		treeDataTransfer.set('text/uri-list', new vscode.DataTransferItem(uri));
	}
}
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
exports.dragDrop = dragDrop;
exports.docudrop = documentDropEditProvider

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

    asString(){
        return "test"
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




