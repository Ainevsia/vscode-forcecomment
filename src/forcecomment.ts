import * as vscode from 'vscode';

import { COMMAND_DASHBOARD, LogLevel } from './constants';
import { Logger } from './logger';

export class ForceComment {
  private appNames = {
    'Visual Studio Code': 'vscode',
  };
  private statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
  );
  private disposable: vscode.Disposable | undefined;
  private lastFile: string | undefined;
  private lastHeartbeat: number = 0;
  private extensionPath: string;
  private logger: Logger;
  private fetchTodayInterval: number = 60000;
  private lastFetchToday: number = 0;


  constructor(extensionPath: string, logger: Logger) {
    this.lastHeartbeat = 0;
    this.extensionPath = extensionPath;
    this.logger = logger;
  }

  public initialize(): void {
    
    this.statusBar.command = COMMAND_DASHBOARD;

    this.statusBar.text = '$(clock) ForceComment working...';
    this.statusBar.show();

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // subscribe to selection change and editor activation events
    let subscriptions: vscode.Disposable[] = [];
    vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscriptions);
    vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscriptions);
    vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscriptions);

    // create a combined disposable from both event subscriptions
    this.disposable = vscode.Disposable.from(...subscriptions);
  }

  private onChange(): void {
    this.onEvent(false);
  }

  private onSave(): void {
    this.onEvent(true);
  }

  private onEvent(isWrite: boolean): void {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
      let doc = editor.document;
      if (doc) {
        let file: string = doc.fileName;
        if (file) {
          let time: number = Date.now();
          if (isWrite || this.lastFile !== file) {
            this.updateHeartbeat(file, isWrite);
            this.lastFile = file;
            this.lastHeartbeat = time;
          }
        }
      }
    }
  }
  private updateHeartbeat(file: string, isWrite: boolean): void {
    this.lastHeartbeat ++;
    if (this.lastHeartbeat >= 100) {
        vscode.window.showInformationMessage('comment!!!!!!!!');
        this.lastHeartbeat = 0;
    }
  }

  public clearHeartbeat(): void {
    this.lastHeartbeat = 0;
  }

  public dispose() {
    this.statusBar.dispose();
  }
}
