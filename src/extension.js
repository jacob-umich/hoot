"use strict"
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {getJson} = require("serpapi")
const fs = require("fs")
const hootReference = require("./webOfRef")
const detailView = require("./webviewtest")
const {addBib,loadAllBibs}=require("./addArticle"); 
const hootCommands = require("./commands")


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log(context.extensionPath)
	console.log(context.extensionUri)
	const dataPath = vscode.workspace.rootPath+'/project_db.json'
	if (!fs.existsSync(vscode.workspace.rootPath+'/project_db.json')){
		fs.writeFileSync(vscode.workspace.rootPath+'/project_db.json','{"categories":[],"references":[]}')
	}

	const detailsView = new detailView(context)
	const dragDrop = new hootReference.dragDrop(dataPath)
	const treeviewObj = new hootReference.hootReference(vscode.workspace.rootPath,detailsView)

	vscode.window.registerTreeDataProvider('hootRef', treeviewObj)
    vscode.window.createTreeView('hootRef', {
        treeDataProvider: treeviewObj,
		dragAndDropController:dragDrop
     });

	 
	let db_path = vscode.workspace.rootPath+'/project_db.json';
	let detailViewRegister = vscode.window.registerWebviewViewProvider('hoot.detailsView',detailsView)
	let findArticleComm = vscode.commands.registerCommand('hoot.findArticle',hootCommands.findArticle)
	vscode.commands.registerCommand('hoot.refresh', () => treeviewObj.refresh());
	let addArticleComm = vscode.commands.registerCommand('hoot.addArticle',()=>{addBib(db_path,treeviewObj)});
	let addBibsComm = vscode.commands.registerCommand('hoot.addBibs',async ()=>{
		let ref_path = await vscode.window.showInputBox({prompt:'enter .bib path'})
		ref_path = vscode.workspace.rootPath + "/" +ref_path;
		loadAllBibs(db_path,treeviewObj,ref_path)
	});
	let viewCatCommand = vscode.commands.registerCommand('hoot.viewCat',hootCommands.viewItem)
	let editCatCommand = vscode.commands.registerCommand('hoot.editCat',hootCommands.renameCategory)
	let showNotesCommand = vscode.commands.registerCommand('hoot.showNotes',hootCommands.openNote)
	vscode.commands.registerCommand('hoot.addCat',hootCommands.addCategory)
	context.subscriptions.push(detailViewRegister);
	context.subscriptions.push(findArticleComm);
	context.subscriptions.push(addArticleComm);
	context.subscriptions.push(addBibsComm);
	context.subscriptions.push(vscode.languages.registerDocumentDropEditProvider({language:"latex"},hootReference.docudrop))
}

function deactivate() {


}

module.exports = {
	activate,
	deactivate
}

