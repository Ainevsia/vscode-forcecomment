import * as vscode from 'vscode';

import { LogLevel } from './constants';
import { Logger } from './logger';
import { ForceComment } from './forcecomment';

var logger = new Logger(LogLevel.INFO);

export function activate(context: vscode.ExtensionContext) {

	let forcecomment = new ForceComment(context.extensionPath, logger);
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.forcecomment.startForceComment', () => {
		vscode.window.showInformationMessage(' Please Comment from time to time!');
	}));

	let hitcomment = vscode.commands.registerCommand('extension.forcecomment.hitComment', () => {
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		editor.edit(edit => {
			edit.insert(editor.selection.active, '/');
		});
		forcecomment.clearHeartbeat();
		// vscode.window.showInformationMessage('You hit \/!');
	});

	context.subscriptions.push(hitcomment);
	context.subscriptions.push(forcecomment);
	forcecomment.initialize();
}

// this method is called when your extension is deactivated
export function deactivate() {
	logger.info('ForceComment has been disabled!');
}
