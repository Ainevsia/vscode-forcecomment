import { window } from 'vscode';
import { Timer } from "./tomatotime";

/**
 * Shows a pick list using window.showQuickPick().
 * Used for setting minutes of tomato clock
 */
export async function chooseMinutes(timer : Timer) {
	let i = 0;
	const result = await window.showQuickPick(['1', '2', '3' ,'4', '5', '10', '15', '20', '25', '30', '35', '40'], {
		placeHolder: 'choose mins for one tomato',
	});
	window.showInformationMessage(`Set Time Per Tomato: ${result} min`, 'OK');
	if (result) {
		timer.reset_without_addcnt();
		timer.setTimer(parseInt(result) * 60);
	}
}