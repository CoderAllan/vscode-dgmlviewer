var fs = require('fs');
import * as vscode from 'vscode';

import { IDirectedGraph } from '@model';
import { Config, DgmlParser } from '@src';


export class FileInfo {

  private config: Config = new Config();
  public static get commandName(): string { return 'dgmlFileInfo'; }

  public execute(): void {
    if (vscode.window.activeTextEditor !== undefined) {
      let doc = vscode.window.activeTextEditor.document;
      if (doc.fileName.toLowerCase().endsWith('.dgml')) {
        const dgmlParser = new DgmlParser();
        const directedGraph: IDirectedGraph | undefined = dgmlParser.parseDgmlFile(doc.fileName);
        if (directedGraph !== undefined) {
          const dgmlViewerOutput = vscode.window.createOutputChannel(this.config.dgmlViewerOutputChannel);
          dgmlViewerOutput.clear();
          dgmlViewerOutput.appendLine(`File info for ${doc.fileName}\n`);
          dgmlViewerOutput.appendLine(`Nodes: ${directedGraph.nodes.length}`);
          dgmlViewerOutput.appendLine(`Links: ${directedGraph.links.length}`);
          dgmlViewerOutput.appendLine(`Categories: ${directedGraph.categories.length}`);
          dgmlViewerOutput.appendLine(`Properties: ${directedGraph.properties.length}`);
          dgmlViewerOutput.appendLine(`Styles: ${directedGraph.styles.length}`);
          try {
            const stats = fs.statSync(doc.fileName);
            dgmlViewerOutput.appendLine(`Created: ${stats.birthtime}`);
            dgmlViewerOutput.appendLine(`Last modified: ${stats.mtime}`);
            dgmlViewerOutput.appendLine(`Size: ${stats.size} bytes`);
          } catch (error) {
            console.log(error);
          }
          dgmlViewerOutput.show();
        }
      }
    }
  }
}