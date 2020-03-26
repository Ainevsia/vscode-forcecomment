import * as vscode from 'vscode';

import { Tracer } from './tracer'


export class BlameViewProvider implements vscode.Disposable {
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
        if (file !== editor.document.uri || line != editor.selection.active.line || editor.document.isDirty) {
            // git blame could take long time and the active line has changed
            Tracer.info(`This update is outdated. ${file.fsPath}: ${line}, dirty ${editor.document.isDirty}`);
            return;
        }

        let contentText = '\u00a0\u00a0\u00a0\u00a0What does this function do ?';

        const options: vscode.DecorationOptions = {
            range: new vscode.Range(line, Number.MAX_SAFE_INTEGER, line, Number.MAX_SAFE_INTEGER),
            renderOptions: { after: { contentText } }
        };
        editor.setDecorations(this._decoration, [options]);
    }

    private _clear(editor: vscode.TextEditor): void {
        editor.setDecorations(this._decoration, []);
    }
}
