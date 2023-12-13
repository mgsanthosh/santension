import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import OpenAI from "openai";
const openai = new OpenAI({apiKey: "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"});


export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-vscode-extension" is now active!');
    vscode.window.showInformationMessage("Extension Activated 2");


    let disp = vscode.workspace.onDidChangeTextDocument(async (event) => {
        // vscode.window.showInformationMessage("Key Strokes ", event.contentChanges.map((change) => change.text).join(""));
        const addedText = event.contentChanges.map((change) => change.text).join('');  
        // Check if the "Enter" key is pressed
        if (addedText.includes('\n') || addedText.includes('\r')) {
            vscode.window.showInformationMessage('Enter key pressed!');
            const editor = vscode.window.activeTextEditor;
            const cursorPosition = editor.selection.active;
            const documentText = editor.document.getText(new vscode.Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character));
            vscode.window.showInformationMessage('Document Text ', documentText);
            if(documentText.startsWith("//") && documentText.endsWith("##$")) {
                vscode.window.showInformationMessage("Extension Regex Matched ");
                let promptString = documentText.replaceAll("//", "");
                promptString = promptString.replaceAll("##$", "");
                const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptString }],
                max_tokens: 1999
            });
            vscode.window.showInformationMessage("RESP ");
            editor?.edit((editBuilder) => {
                const currentPosition = editor.selection.active;
                                const newPosition = currentPosition.with(currentPosition.line + 2, 0);
                                editBuilder.insert(newPosition, stream.choices[0].message.content!); 
            })


            // for await (const chunk of stream) {
            //     editor?.edit((editBuilder) => {
            //             // if(editor.selection.isEmpty) {
            //                     const currentPosition = editor.selection.active;
            //                     const newPosition = currentPosition.with(currentPosition.line + 2, 0);
            //                     editBuilder.insert(newPosition, chunk.choices[0]?.delta?.content || ""); 
            //             // }  else {
            //                 // editBuilder.replace(editor.selection,  chunk.choices[0]?.delta?.content || "");
            //             // }
            //     })
            // }
            }
        }
    })
    // vscode.window.onDidChangeTextEditorSelection(async (event) => {
    //     const editor = vscode.window.activeTextEditor;
    //     const cursorPosition = editor.selection.active;
    //     const documentText = editor.document.getText(new vscode.Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character)); 

    //     vscode.window.showInformationMessage("Extension Changes Happeded " + documentText);

    //     if(documentText.startsWith("//") && documentText.endsWith("##$")) {
    //         vscode.window.showInformationMessage("Extension Regex Matched ");

    //         // @Author Santhosh Commented this python code, Because its not supporting in my machine

    //         // const inputString = documentText;
    //         // const pythonScriptPath = path.join(context.extensionPath, 'pythonScript.py');
    //         // const command = `python ${pythonScriptPath} "${inputString}"`;
    //         // cp.exec(command, (error, stdout, stderr) => {
    //         //     if (error) {
    //         //         vscode.window.showErrorMessage(`Error: ${error.message}`);
    //         //     } else {
    //         //         vscode.window.showInformationMessage(`Transformed Output: ${stdout}`);
    //         //         editor.edit((editBuilder) => {
    //         //             if(editor.selection.isEmpty) {
    //         //                 const currentPosition = editor.selection.active;
    //         //                 const newPosition = currentPosition.with(currentPosition.line + 2, 10);
    //         //                 editBuilder.insert(newPosition, stdout); 
    //         //             }  else {
    //         //                 editBuilder.replace(editor.selection, stdout);
    //         //             }
    //         //         })
    //         //     }
    //         // });

    //         let promptString = documentText.replaceAll("//", "");
    //         promptString = promptString.replaceAll("##$", "");
    //         const stream = await openai.chat.completions.create({
    //             model: "gpt-3.5-turbo",
    //             messages: [{ role: "user", content: promptString }],
    //             stream: true,
    //         })
    //         console.log("CHATGPT OP", stream)
        
    // for await (const chunk of stream) {
    //     editor?.edit( (editBuilder) => {
    //                            if(editor.selection.isEmpty) {
    //                             const currentPosition = editor.selection.active;
    //                             const newPosition = currentPosition.with(currentPosition.line + 2, 10);
    //                             editBuilder.insert(newPosition, chunk.choices[0]?.delta?.content || ""); 
    //                     }  else {
    //                         editBuilder.replace(editor.selection,  chunk.choices[0]?.delta?.content || "");
    //                     }


    //     })
    // }

        


    //     }


    // })
}
