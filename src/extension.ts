import * as vscode from 'vscode';

import { DgmlViewer, FileInfo, Test } from '@commands';

export function activate(context: vscode.ExtensionContext) {

  const cmdPrefix = 'vscode-dgmlviewer';

	let dgmlViewerDisposable = vscode.commands.registerCommand(`${cmdPrefix}.${DgmlViewer.commandName}`, () => {
    const dgmlViewerPanel = vscode.window.createWebviewPanel(
      'dgmlViewer_DgmlViewer',
      'Dgml Viewer',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    const command = new DgmlViewer(context);
    command.execute(dgmlViewerPanel.webview);
	});
  context.subscriptions.push(dgmlViewerDisposable);
  
  let fileInfoDisposable = vscode.commands.registerCommand(`${cmdPrefix}.${FileInfo.commandName}`, () => {
    const command = new FileInfo();
    command.execute();
  });
  context.subscriptions.push(fileInfoDisposable);

  let testingDisposable = vscode.commands.registerCommand(`${cmdPrefix}.${Test.commandName}`, () => {
    const command = new Test();
    command.execute();
  });
  context.subscriptions.push(testingDisposable);

}

export function deactivate() {}
