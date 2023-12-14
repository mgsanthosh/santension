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
        
            const editor = vscode.window.activeTextEditor!;
            const cursorPosition = editor.selection.active;
            const documentText = editor.document.getText(new vscode.Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character));
            vscode.window.showInformationMessage('Document Text ', documentText);
            // if(documentText.startsWith("//") && documentText.endsWith("##$")) {
            //     vscode.window.showInformationMessage("Extension Regex Matched ");
            //     let promptString = documentText.replaceAll("//", "");
            //     promptString = promptString.replaceAll("##$", "");
            //     const stream = await openai.chat.completions.create({
            //     model: "text-embedding-ada-002",
            //     messages: [{ role: "user", content: promptString }],
            //     max_tokens: 20000
            // }).catch((err) => {
            //     vscode.window.showInformationMessage("Error in openai API", err);
            // });
            // vscode.window.showInformationMessage("RESP ");
            // editor?.edit((editBuilder) => {
            //     const currentPosition = editor.selection.active;
            //                     const newPosition = currentPosition.with(currentPosition.line + 2, 0);
            //                     editBuilder.insert(newPosition, stream.choices[0].message.content!); 
            // })


            // }
            const inputStringTrimmed = documentText.trim();
            if (inputStringTrimmed.endsWith('-J')) {
                const result = await fetchJira(inputStringTrimmed, 'J');

                editor?.edit((editBuilder) => {
                    const currentPosition = editor.selection.active;
                    const newPosition = currentPosition.with(currentPosition.line + 2, 0);
                    editBuilder.insert(newPosition, result); 
                })
            } else if (inputStringTrimmed.endsWith('-G')) {
                vscode.window.showInformationMessage('COMPLETE CODE');
                const result = await completeCode(inputStringTrimmed, openai);
                vscode.window.showInformationMessage('The Result ', result.choices[0].message.content);

                editor?.edit((editBuilder) => {
                    const currentPosition = editor.selection.active;
                    const newPosition = currentPosition.with(currentPosition.line + 2, 0);
                    editBuilder.insert(newPosition,result.choices[0].message.content); 
                })
            } else if (inputStringTrimmed.endsWith('-S')) {
                const matches = inputStringTrimmed.match(/\[(.*?)\]/);
                let result: any = "";
                if (matches) {
                    const key = matches[1].trim();
                    result = fetchJira(key, 'S');
                } else {
                    console.log('Not found the Key');
                }
                editor?.edit((editBuilder) => {
                    const currentPosition = editor.selection.active;
                    const newPosition = currentPosition.with(currentPosition.line + 2, 0);
                    editBuilder.insert(newPosition, result); 
                })
            } else {
                const result = '';
            }
        }
    })

}
async function fetchJira(key: string, type: string) {
    const jiraBaseUrl = "https://pypilot.atlassian.net";
    const username = "k.developer.x@gmail.com";
    const apiToken = "ATATT3xFfGF0wACwo9PX10946TBUJGyfl-2LGgqTGOqnYYfBL0-v5PhDtlhOn5SHNoOO-ln49h5zwM90vPz4D-7EifqQGxzQ8LyJMZ_nYTp0oRBSVJjSZUtpPKP2m31NPUZunl7fzfAFSqc_Geacjn4fsfUMiF-49LruyX7ra043_dKuoSEaCN0=9304FDB4";

    const url = `${jiraBaseUrl}/rest/api/3/search`;
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    const query = {
        'jql': 'project = XYZKEY'
    };

    const response = await fetch(`${url}?${new URLSearchParams(query).toString()}`, {
        method: 'GET',
        headers: headers,
        auth: `${username}:${apiToken}`
    });

    const data = await response.json();
    const issues = data.issues;
    let story = "";

    for (const issue of issues) {
        if (type === "J") {
            if (issue.fields.issuetype.name === 'Story') {
                story += `\n// Story -  ${issue.key} : ${issue.fields.summary} -G`;
            } else {
                continue;
            }
        } else {
            if (issue.key === key) {
                story = `\n// Story : ${issue.fields.summary} -G`;
                break;
            } else {
                story = "Not found with this key!";
            }
        }
    }

    return story;
}

async function completeCode(promptString: string, openAI:any) {
    try {
        const stream: any= await openAI.chat.completions.create({
            model: "gpt-3.5-turbo-0613",
            messages: [{ role: "user", content: promptString }],
        });
        return stream;
    } catch(err) {
        vscode.window.showInformationMessage("Error in openai API");
        throw err;

    }
    // const stream: any= await openAI.chat.completions.create({
    //         model: "gpt-3.5-turbo-0613",
    //         messages: [{ role: "user", content: promptString }],
    //         max_tokens: 20000
    //     }).catch((err: any) => {
    //         vscode.window.showInformationMessage("Error in openai API", err);
    //         throw err;
    //     }).then((rep: any) => {
    //         return rep;
    //     })
}

