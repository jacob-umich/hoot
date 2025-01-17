const vscode = require('vscode');
const fs = require("fs")
const hootCommands = require("./commands")

const fileSaveListener = function(event){
    let fullpath = event.fileName
    if (fullpath.includes("project_db") && fullpath.includes("notes") && fullpath.includes(".md")){
        var filename = fullpath.replace(/^.*[\\/]/, '').replace(/.md/,'')
        let text = event.getText()
        let desc = text.match(/# Short Description\n(?<desc>[\w\s]*)\n# Relevance/)?.groups?.desc;
        let relev = text.match(/# Relevance\n(?<relev>[\w\s]*)\n# Details/)?.groups?.relev;
        let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))
        let refArray = data.references

        for (let i = 0;i<refArray.length;i++){
            if (refArray[i].nickname==filename){
                refArray[i].notes[0]={shrtDesc:desc}
                refArray[i].notes[1]={relevance:relev}
            }
        }
        hootCommands.save_db(data)

    }
}

let subscription = vscode.workspace.onDidSaveTextDocument(fileSaveListener)