import * as vscode from "vscode";

export default class Formatter {
    protected editor: vscode.TextEditor | undefined;

    public process(editor: vscode.TextEditor): void {
        this.editor = editor;
        editor.selections.forEach((selection) => {
            if (selection.isSingleLine) {
                // If this selection is single line. Look up and down to search for the similar neighbour
                return;
            } else {
                // Otherwise, narrow down the range where to align
                let start = selection.start.line;
                let end = selection.end.line;
                
                const select_range : vscode.Range = new vscode.Range(
                    new vscode.Position(start, 0),
                    new vscode.Position(end, editor.document.lineAt(end).text.length)
                );
                
                let lines: string[] = editor.document.getText(select_range).split('\n');
                let statics_lines_idx : [string, number][] = [];
                for (let line of lines) {
                    // search for comment `\/\/`
                    const len = line.length;
                    let found : boolean = false;
                    let i = 0;
                    for (; i + 1 < len; i ++) {
                        if (line.charAt(i) == '/' && line.charAt(i + 1) == '/') {
                            found = true;
                            break;
                        }
                    }
                    statics_lines_idx.push([line, found ? i : -1]);
                }

                let max_padding : number = -1;
                for ( let [_, num] of statics_lines_idx) {
                    if (num > max_padding) {
                        max_padding = num;
                    }
                }
                
                // Format Selected String
                let formatted : string[] = [];
                for (let [str, idx] of statics_lines_idx) {
                    if (idx > -1 && idx < max_padding) {
                        let formatted_str : string = str.slice(0,idx) + ' '.repeat(max_padding - idx) + str.slice(idx);
                        formatted.push(formatted_str);
                    } else {
                        formatted.push(str);
                    }
                }

                // Apply Changes
                editor.edit((editBuilder) => {
                    editBuilder.replace(select_range, formatted.join('\n'));
                })
            }
        });
    }
}
