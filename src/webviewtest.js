const vscode = require('vscode')
const fs = require('fs')


class DetailsViewProvider {

	constructor(
		_extensionContext,
	) { 
		this._extensionContext = _extensionContext
		this._extensionUri=_extensionContext.extensionUri
	}

	resolveWebviewView(
		webviewView,
		context,
		_token,
	) {
		this._view = webviewView;
        this.viewType = 'hoot.detailsView';
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			vscode.commands.executeCommand("hoot.editCat",data.old,data.label)
			vscode.commands.executeCommand("hoot.refresh")
		});
	}
	viewCat(cat){
		console.log(cat.label)
		this._view.webview.postMessage({
			type: 'showcat',
			data: {label:cat.label}
		})
	}
	// addColor() {
	// 	if (this._view) {
	// 		this._view.show.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
	// 		this._view.webview.postMessage({ type: 'addColor' });
	// 	}
	// }

	clearColors() {
		if (this._view) {
			this._view.webview.postMessage({ type: 'clearColors' });
		}
	}

	_getHtmlForWebview(webview) {


		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		// i think i need to learn about file paths mor
		let mainHtml = fs.readFileSync(this._extensionContext.extensionPath+"\\media"+"\\details.html",{"encoding":'utf-8'})
		mainHtml=mainHtml.replace("reset_css",styleResetUri)
		mainHtml=mainHtml.replace("vscode_css",styleVSCodeUri)
		mainHtml=mainHtml.replace("main_css",styleMainUri)
		mainHtml=mainHtml.replace("main_js",scriptUri)
		console.log(mainHtml)
		return mainHtml
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

module.exports=DetailsViewProvider