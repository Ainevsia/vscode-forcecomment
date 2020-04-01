import * as vscode from 'vscode';

import { Tracer } from './tracer'

export class BlameViewProvider implements vscode.Disposable {
    private readonly _max_line_of_block : number = 10;
    private _disposables: vscode.Disposable[] = [];
    private _decoration = vscode.window.createTextEditorDecorationType({
        after: {
            color: new vscode.ThemeColor('forcecomment.blameView.info'),
            fontStyle: 'italic'
        }
    });
    
    constructor() {
        vscode.window.onDidChangeTextEditorSelection(e => {
            this._onDidChangeSelection(e.textEditor);
        }, null, this._disposables);
        this._disposables.push(this._decoration);
    }

    dispose(): void {
        vscode.Disposable.from(...this._disposables).dispose();
    }

    private async _onDidChangeSelection(editor: vscode.TextEditor) {
        if (!editor) {
            Tracer.info('_onDidChangeSelection with null or undefined editor');
            return;
        }
        Tracer.verbose('Blame view: onDidChangeSelection');
        this._update(editor)
    }
    
    private async _update(editor: vscode.TextEditor): Promise<void> {
        const file = editor.document.uri;
        const line = editor.selection.active.line;
        Tracer.verbose(`Try to update blame. ${file.fsPath}: ${line}`);
        // if (file !== editor.document.uri || line != editor.selection.active.line || editor.document.isDirty) {
        //     // git blame could take long time and the active line has changed
        //     Tracer.info(`This update is outdated. ${file.fsPath}: ${line}, dirty ${editor.document.isDirty}`);
        //     return;
        // }

        let contentText = '\u00a0\u00a0\u00a0\u00a0';
        contentText += this._judge_has_comment(editor);
        const options: vscode.DecorationOptions = {
            range: new vscode.Range(line, Number.MAX_SAFE_INTEGER, line, Number.MAX_SAFE_INTEGER),
            renderOptions: { after: { contentText } }
        };
        editor.setDecorations(this._decoration, [options]);
    }

    private _clear(editor: vscode.TextEditor): void {
        editor.setDecorations(this._decoration, []);
    }

    private _judge_has_comment(editor: vscode.TextEditor): string {
        let res : string = '';
        editor.selections.forEach((selection) => {
            if (selection.isSingleLine && editor.document.lineAt(selection.start.line).isEmptyOrWhitespace) {
                return; // forEach return
            }
            let start = selection.start.line;
            while (start > 0 && !editor.document.lineAt(start).isEmptyOrWhitespace) {
                start -- ;
            }
            let end = selection.end.line;
            while (end + 1 < editor.document.lineCount && !editor.document.lineAt(end).isEmptyOrWhitespace) {
                end ++ ;
            }
            let reg_2slash : RegExp = /\/\//;
            let reg_slash_star : RegExp = /\/\*/;
            let reg_star_slash : RegExp = /\*\//;
            const select_range : vscode.Range = new vscode.Range(
                new vscode.Position(start, 0),
                new vscode.Position(end, editor.document.lineAt(end).text.length)
            );
            
            let lines: string = editor.document.getText(select_range);
            if (lines.match(reg_2slash) || lines.match(reg_slash_star) || lines.match(reg_star_slash)) {
                if (end - start > this._max_line_of_block) {
                    res = 'Code block too long';
                } else {
                    res = '';
                }
            } else {
                if (end - start > this._max_line_of_block) {
                    res = 'Code block too long';
                } else {
                    res = 'What does this block of code do ?';
                }
            }
        });
        return res;
    }
}
