// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {LogLevel} from './constants';
import { Logger } from './logger';
var logger = new Logger(LogLevel.INFO);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-forcecomment" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.forcecomment.startForceComment', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World! Please Comment from time to time!');
	});

	context.subscriptions.push(disposable);

	let hitcomment = vscode.commands.registerCommand('extension.forcecomment.hitComment', () => {
		let editor = vscode.window.activeTextEditor as vscode.TextEditor;
		editor.edit(edit => {
			edit.insert(editor.selection.active, '/');
		});
		vscode.window.showInformationMessage('You hit \/!');
	});

	context.subscriptions.push(hitcomment);

}

// this method is called when your extension is deactivated
export function deactivate() {
	logger.info('ForceComment has been disabled!');
}
