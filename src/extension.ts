import * as vscode from 'vscode';

import Formatter from './formatter';
import { BlameViewProvider } from './blameview';

import * as moment from "moment";
import { Timer, TimerState } from "./tomatotime";
import { Commands, Messages } from "./constants";
require("moment-duration-format");

import { chooseMinutes } from './basicInput';

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

	// Create a status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left
	);
    statusBarItem.tooltip = "Tomato Timer";
    statusBarItem.command = Commands.TimerAction;
    statusBarItem.show();

    // Create a timer model
	const timer = new Timer(10);
	context.subscriptions.push(
		// reset the tomato timer
		vscode.commands.registerTextEditorCommand("extension.forcecomment.tomato", async () => {
			const options: { [key: string]: (timer: Timer) => Promise<void> } = {
				chooseMinutes,
				// showInputBox
			};
			const quickPick = vscode.window.createQuickPick();
			quickPick.items = Object.keys(options).map(label => ({ label }));
			quickPick.onDidChangeSelection(selection => {
				if (selection[0]) {
					options[selection[0].label](timer)
						.catch(console.error);
				}
			});
			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
			// timer.setTimer(123)
		})
	);

    timer.onTimeChanged((args) => {
        // Reflect in the UI every time the remaining time changes
        statusBarItem.text = '$(squirrel) ' + timer.getTomato +' Tomato : ' + formatSeconds(args.remainingSeconds);
    });
    timer.onTimerEnd(() => {
        // Issue a timer exit message to vscode
        vscode.window.showInformationMessage("One Tomato end! Have a break please...", "OK");
    });
    timer.onTimerChanged(({ timerSeconds }) => {
        // Save timer time changes
        context.globalState.update("vscode-timer.timer", timerSeconds);
    });

    context.subscriptions.push(statusBarItem);


    // Commands: TimerAction
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.TimerAction, () => {
            switch (timer.state) {
                case TimerState.Running:
                    timer.pause();
                    break;
                case TimerState.Paused:
                    timer.start();
                    break;
                case TimerState.Stopped:
                    timer.start();
                    break;
            }
		})
	);

    // Commands: Reset
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.Reset, () => {
            timer.reset();
		})
	);

    // Commands: Set timer
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.SetTimer, () => {
            if (timer.state == TimerState.Running) {
                // If the timer is running
                // Cancel the running timer to see if you want to set a new timer
                vscode.window.showQuickPick(["OK", "Cancel"], { placeHolder: Messages.ContinueTimerSet })
                    .then(selection => {
                        if (selection === "OK") {
                            showInputBox();
                        }
                    });
            } else {
                showInputBox();
            }

            function showInputBox() {
                vscode.window.showInputBox({ placeHolder: Messages.SetTimer })
                    .then(input => {
                        const seconds = moment.duration(input).asSeconds();
                        if (seconds <= 0) {
                            vscode.window.showErrorMessage(Messages.InvalidTimerDuration);
                            return;
                        }

                        timer.reset();
                        timer.setTimer(seconds);
                    });
            }
        }));
}

function formatSeconds(seconds: number) : string {
	const duration : moment.Duration = moment.duration(seconds, "seconds");
	let res : string = '';
	res += duration.minutes() + 'm ';
	res += duration.seconds() + 's';
	return res;
}

// this method is called when your extension is deactivated
export function deactivate() {}
