"use strict";

import * as vscode from "vscode";

export class Timer {
    private _timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
    private _timerEndEventEmitter = new vscode.EventEmitter<void>();
    private _timerChangedEventEmitter = new vscode.EventEmitter<TimerChangedEventArgs>();

    private _elapsedSeconds: number = 0;
    private _timerSeconds: number;
    private _interval: NodeJS.Timer | undefined;
    private _state: TimerState = TimerState.Stopped;

    // Default timer time is set to 5 min
    private static _DEFAULT_TIMER_SECONDS = 0.5 * 60;

    constructor(timerSeconds = Timer._DEFAULT_TIMER_SECONDS) {
        this._timerSeconds = timerSeconds;

        // To wait for the event handler to register
        // Take a little time to reset
        setTimeout(() => {
            this.reset();
        }, 100);
    }

    get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
        return this._timeChangedEventEmitter.event;
    }

    get onTimerEnd(): vscode.Event<void> {
        return this._timerEndEventEmitter.event;
    }

    get onTimerChanged(): vscode.Event<TimerChangedEventArgs> {
        return this._timerChangedEventEmitter.event;
    }

    get state(): TimerState {
        return this._state;
    }

    private clearTimerLoop() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }

    private fireTimeChangedEvent(remainingSeconds: number): void {
        const args: TimeChangedEventArgs = {
            remainingSeconds: remainingSeconds
        };
        this._timeChangedEventEmitter.fire(args);
    }

    // TODO: Reduce interval intervals to determine time lapse by subtraction
    // TODO: Make dispose method
    start() {
        this._state = TimerState.Running;
        this._interval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    public get remainingSeconds() {
        return Math.max(this._timerSeconds - this._elapsedSeconds, 0);
    }

    private tick() {
        this._elapsedSeconds += 1;

        const remainingSeconds = this.remainingSeconds;
        if (remainingSeconds <= 0) {
            // When the timer ends
            this._elapsedSeconds = this._timerSeconds;
            // Issue timer end event
            this._timerEndEventEmitter.fire();

            // After the timer is finished, reset and return to the initial state.
            this.reset();
            if (this._interval !== undefined) clearInterval(this._interval);
        } else {
            // If the timer continues
            this.fireTimeChangedEvent(remainingSeconds);
        }
    }

    pause() {
        this._state = TimerState.Paused;
        this.clearTimerLoop();
    }

    reset() {
        this._state = TimerState.Stopped;
        this.clearTimerLoop();
        this._elapsedSeconds = 0;

        this.fireTimeChangedEvent(this.remainingSeconds);
    }

    setTimer(seconds: number) {
        if (seconds <= 0) throw new Error();

        this._timerSeconds = seconds;
        this.fireTimeChangedEvent(this.remainingSeconds);
        this._timerChangedEventEmitter.fire({
            timerSeconds: seconds
        });
    }
}

export enum TimerState {
    /**
     * Timer pauses
     * The timer can be resumed
     * [Possible state transitions]
     * Paused -> Running
     */
    Paused,

    /**
     * The timer is in a working state
     * [Possible state transitions]
     * Running -> Stopped
     * Running -> Paused
     */
    Running,

    /**
     * The timer is not working
     * It is also the initial state in which the timer was created.
     * [Possible state transitions]
     * Stopped -> Running
     */
    Stopped
}

export interface TimeChangedEventArgs {
    remainingSeconds: number;
}

export interface TimerChangedEventArgs {
    timerSeconds: number;
}
