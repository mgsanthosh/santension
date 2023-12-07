// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "santension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('santension.runPythonScript', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('The Extension Has Started');
		runPythonScript();

	});

	context.subscriptions.push(disposable);
}

function runPythonScript() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        const document = activeTextEditor.document;
        if (document.languageId === 'python') {
            const scriptPath = document.uri.fsPath;
            const terminal = vscode.window.createTerminal('Python Terminal');
            terminal.sendText(`python ${scriptPath}`);
            terminal.show();
        } else {
            vscode.window.showErrorMessage('The active file is not a Python script.');
        }
    } else {
        vscode.window.showErrorMessage('No active text editor.');
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
