import * as vscode from 'vscode';

import { Tracer } from './tracer'


class BlameViewStatProvider implements vscode.Disposable {
    private _disposables: vscode.Disposable[] = [];
    constructor(private _owner: BlameViewProvider) {
        this._disposables.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, this));
    }

    dispose(): void {
        vscode.Disposable.from(...this._disposables).dispose();
    }

    async provideHover(document: vscode.TextDocument, position:vscode. Position): Promise<vscode.Hover> {
        
        let markdown = new vscode.MarkdownString(`*\`Committed Files\`*\r\n>\r\n`);
        markdown.appendMarkdown('>');
        return new vscode.Hover(markdown);
    }
}

export class BlameViewProvider implements vscode.Disposable {
    private _statProvider: BlameViewStatProvider;
    private _decoration = vscode.window.createTextEditorDecorationType({
        after: {
            color: new vscode.ThemeColor('forcecomment.blameView.info'),
            fontStyle: 'italic'
        }
    });
    private _disposables: vscode.Disposable[] = [];
    
    constructor() {
        this._statProvider = new BlameViewStatProvider(this);
        vscode.window.onDidChangeTextEditorSelection(e => {
            this._onDidChangeSelection(e.textEditor);
        }, null, this._disposables);

        this._disposables.push(this._statProvider);
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

        let contentText = '\u00a0\u00a0\u00a0\u00a0 NotCommitted';

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
