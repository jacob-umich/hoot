// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {getJson} = require("serpapi")

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hoot" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hoot.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Hoot!');
	});

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
		const panel = vscode.window.createWebviewPanel(
			article.title,
			article.title,
			vscode.ViewColumn.One,
			{}
		)
		panel.webview.html = getWebviewContent(article.link)
		vscode.env.openExternal(article.link)
		
		// record selected in bib and open link
		// have a notification pop up saying the name of the reference

	}

	let findArticleComm = vscode.commands.registerCommand('hoot.searchArticle',findArticle)

	context.subscriptions.push(disposable);
	context.subscriptions.push(findArticleComm);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function getWebviewContent(link) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
  	<iframe src="${link}" frameborder="0" style="width:100vw; height:100vh"></iframe>
  </body>
  </html>`;
  }