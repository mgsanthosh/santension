import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';


export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-vscode-extension" is now active!');
    vscode.window.showInformationMessage("Extension Activated");
    vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = vscode.window.activeTextEditor;
        const cursorPosition = editor.selection.active;
        const documentText = editor.document.getText(new vscode.Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character)); 

        vscode.window.showInformationMessage("Extension Changes Happeded " + documentText);

        if(documentText.includes("##$")) {
            vscode.window.showInformationMessage("Extension Regex Matched ");

            const inputString = documentText;
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


    })
}
