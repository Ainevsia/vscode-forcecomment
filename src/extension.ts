import * as vscode from 'vscode';

// import { ForceComment } from './forcecomment';
import Formatter from './formatter';
import { BlameViewProvider } from './blameview';

export function activate(context: vscode.ExtensionContext) {

	console.log('[ForceComment] Extension start success');

	let formatter = new Formatter();

	context.subscriptions.push(
		// the format function
		vscode.commands.registerTextEditorCommand("extension.forcecomment.aligncode", (editor) => {
			formatter.process(editor);
		})
	);
	let blameViewProvider = new BlameViewProvider();

	context.subscriptions.push(blameViewProvider);
	// let forcecomment = new ForceComment(context.extensionPath);
	
	// context.subscriptions.push(vscode.commands.registerCommand('extension.forcecomment.startForceComment', () => {
	// 	vscode.window.showWarningMessage(' Please Comment from time to time!', 'sd', 'sd');
	// }));

	// let hitcomment = vscode.commands.registerCommand('extension.forcecomment.hitComment', () => {
	// 	let editor = vscode.window.activeTextEditor as vscode.TextEditor;
	// 	editor.edit(edit => {
	// 		edit.insert(editor.selection.active, '/');
	// 	});
	// 	forcecomment.clearHeartbeat();
	// 	// vscode.window.showInformationMessage('You hit \/!');
	// });

	// context.subscriptions.push(hitcomment);
	// context.subscriptions.push(forcecomment);
	// forcecomment.initialize();
}

// this method is called when your extension is deactivated
export function deactivate() {}
