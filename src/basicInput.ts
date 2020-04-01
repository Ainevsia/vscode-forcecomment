/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';
import { Timer } from "./tomatotime";
import { resolveNs } from 'dns';
/**
 * Shows a pick list using window.showQuickPick().
 */
export async function chooseMinutes(timer : Timer) {
	let i = 0;
	const result = await window.showQuickPick(['1', '2', '3' ,'4', '5', '10', '15', '20', '25', '30', '35', '40'], {
		placeHolder: 'choose mins for one tomato',
		// onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Set Time Per Tomato: ${result} min`, 'OK');
	if (result) {
		timer.reset_without_addcnt();
		timer.setTimer(parseInt(result) * 60);
	}
}

/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox() {
	const result = await window.showInputBox({
		value: 'abcdef',
		valueSelection: [2, 4],
		placeHolder: 'For example: fedcba. But not: 123',
		validateInput: text => {
			window.showInformationMessage(`Validating: ${text}`);
			return text === '123' ? 'Not 123!' : null;
		}
	});
	window.showInformationMessage(`Got: ${result}`);
}
