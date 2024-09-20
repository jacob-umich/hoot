const fs = require("fs"); 
const vscode = require('vscode')
const refext = require('./webOfRef')

function generateUUID () {
    let time = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        time += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let random = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
}

async function addArticle(db_path,treeviewObj){
    let search = await vscode.window.showInputBox({prompt:'enter new article name'});
    let id = generateUUID()

    let newData = {
        nickname:search,
        author:"",
        id:id,
        title:"",
        year:"",
        journal:"",
        pdfPath:"",
        abstract:"",
        notes:[],
        inlineNotes:[],
        tags:"",
        bibtex:bib
    }
    let data = JSON.parse(fs.readFileSync(db_path,'utf-8'));

    data.push(newData);

    fs.writeFileSync(db_path,JSON.stringify(data,null,4))
    treeviewObj.refresh();
}
async function  addBib(db_path,treeviewObj,bib=undefined){
    if (!bib){
        bib = await vscode.window.showInputBox({prompt:'enter new article bib'});
    }
    let id = generateUUID()
    let newData = {
        nickname:bib.match(/@[\S]+{(?<nickname>\w+),/).groups.nickname,
        author:bib.match(/author={(?<author>[\S ]+?)},/).groups.author,
        id:id,
        title:bib.match(/title={(?<title>[\S ]+?)},/).groups.title,
        year:bib.match(/year={(?<year>[\S ]+?)},/).groups.year,
        journal:bib.match(/journal={(?<journal>[\S ]+?)},/).groups?.journal,
        pdfPath:"",
        abstract:"",
        notes:[],
        inlineNotes:[],
        tags:"",
        bibtex:bib,
        category:0
    }
    let data = JSON.parse(fs.readFileSync(db_path,'utf-8'));

    data["references"].push(newData);

    fs.writeFileSync(db_path,JSON.stringify(data,null,4))
    treeviewObj.refresh();
}

async function loadAllBibs(db_path,treeviewObj, bibpath){
    let refsString = fs.readFileSync(bibpath,'utf-8')
    const refs = refsString.split("@")

    for (let i=1;i<refs.length;i++){
        addBib(db_path,treeviewObj,"@"+refs[i])
    }
}



module.exports={addBib,loadAllBibs};