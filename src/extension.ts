// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "santension" is now active!');
	vscode.window.showInformationMessage('The Extension Has Activated');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('santension.readString', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('The Extension Has Started');
		const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Get the entire content of the document
            const documentText = editor.document.getText();
        
            vscode.window.showInformationMessage(context.extensionPath);


		vscode.window.showInformationMessage('The Extension path above');



            // Check for the trigger pattern (e.g., two spaces after #hello<name>)
            // const match = documentText.match(/#hello<([^>]+)>/i);
            const match = documentText;
                const inputString = match;
                // Use Python script to transform input
                const pythonScriptPath = path.join(context.extensionPath, 'pythonScript.py');
                const command = `python ${pythonScriptPath} "${inputString}"`;

                cp.exec(command, (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Error: ${error.message}`);
                    } else {
                        vscode.window.showInformationMessage(`Transformed Output: ${stdout}`);
                        editor.edit((editBuilder) => {
                            if(editor.selection.isEmpty) {
                                const currentPosition = editor.selection.active;
                                const newPosition = currentPosition.with(currentPosition.line + 2, 10);
                                editBuilder.insert(newPosition, stdout); 
                            }  else {
                                editBuilder.replace(editor.selection, stdout);
                            }
                        })
                    }
                });
            
        }
		// runPythonScript();

	});

	context.subscriptions.push(disposable);
}

    // // Subscribe to text document change events
    // vscode.workspace.onDidChangeTextDocument((event) => {
    //     // Only trigger the command when changes occur in a Python file
    //     if (event.document.languageId === 'python') {
    //         vscode.commands.executeCommand('extension.transformInput');
    //     }
    // });

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
