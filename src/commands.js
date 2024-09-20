const vscode = require('vscode')
const fs = require('fs')
// const hootTree = require('./webOfRef')

async function findArticle(){
    let search = await vscode.window.showInputBox({prompt:'enter in search params'})
    let resp = await getJson({
        engine: "google_scholar",
        api_key: "9779a8042dce2f0545408e1fac4755b5d09edf3ee537b735806e0239a8e017ef",
        q: search,
    })
    console.log(resp['organic_results'][0])
    let searchRes = new Array
    for (let i=0;i<5;i++){
        searchRes.push(resp['organic_results'][i]['title'])
    }
    let pickTitle = await vscode.window.showQuickPick(searchRes)
    let pickInd = resp['organic_results'].findIndex((result)=>{
        return result.title == pickTitle
    })
    let article = resp['organic_results'][pickInd]
    console.log(article)
    vscode.env.openExternal(article.link)
    let id = article.result_id
    

    let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath+'/project_db.json','utf-8'))

    data.push(
        {
            id:id,
            title:article.title,
            
        }
    )

    fs.writeFileSync(vscode.workspace.rootPath+'/project_db.json',JSON.stringify(data))
    
    // record selected in bib and open link
    // have a notification pop up saying the name of the reference

}

function addCategory (){
    let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))
    data["categories"].push({name:"New Category"})
    save_db(data)
    vscode.commands.executeCommand("hoot.refresh")

}
function viewItem(item){
    console.log(item)
    item.detailview.viewCat(item)
    // if (item instanceof hootTree.refCat){
    // }
}
function renameCategory(old,new_label){
    let data = JSON.parse(fs.readFileSync(vscode.workspace.rootPath +"/project_db.json"))
    for (let cat in data["categories"]){
        if (data["categories"][cat].name==old){
            data["categories"][cat].name=new_label
            break
        }
    }
    save_db(data)


}

function save_db(data){
    let db_path = vscode.workspace.rootPath+'/project_db.json'
    fs.writeFileSync(db_path,JSON.stringify(data,null,4))
}

module.exports={addCategory,findArticle,viewItem,renameCategory,save_db};