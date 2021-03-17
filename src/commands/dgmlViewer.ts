
var fs = require('fs');
import path = require('path');
import * as vscode from 'vscode';
import { Base64 } from 'js-base64';

import { Config, DgmlParser, FileSystemUtils } from '@src';
import { IDirectedGraph } from '@model';

export class DgmlViewer {

  private static readonly _name: string = 'dgmlViewer';
  private extensionContext: vscode.ExtensionContext;
  private config = new Config();
  private fsUtils = new FileSystemUtils();
  public static get commandName(): string { return DgmlViewer._name; }

  constructor(context: vscode.ExtensionContext) {
    this.extensionContext = context;
  }

  public execute(webview: vscode.Webview): void {

    webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'saveAsPng':
            this.saveAsPng(message.text);
            return;
        }
      },
      undefined,
      this.extensionContext.subscriptions
    );

    if (vscode.window.activeTextEditor !== undefined) {
      let doc = vscode.window.activeTextEditor.document;
      if (doc.fileName.toLowerCase().endsWith('.dgml')) {
        const dgmlParser = new DgmlParser();
        const directedGraph: IDirectedGraph | undefined = dgmlParser.parseDgmlFile(doc.fileName);
        if (directedGraph !== undefined) {
          const nodesJson = directedGraph.nodes
            .map((node, index, arr) => { return node.toJsString(); })
            .join(',\n');
          const edgesJson = directedGraph.links
            .map((link, index, arr) => { return link.toJsString(); })
            .join(',\n');
          try {
            const jsContent = this.generateJavascriptContent(nodesJson, edgesJson, directedGraph);
            const outputJsFilename = DgmlViewer._name + '.js';
            let htmlContent = this.generateHtmlContent(webview, outputJsFilename);

            this.fsUtils.writeFile(this.extensionContext?.asAbsolutePath(path.join('.', DgmlViewer._name + '.html')), htmlContent, () => { }); // For debugging
            this.fsUtils.writeFile(
              this.extensionContext?.asAbsolutePath(path.join('.', outputJsFilename)),
              jsContent,
              () => {
                webview.html = htmlContent;
              }
            );
          } catch (ex) {
            console.log('Dgml Viewer Exception:' + ex);
          }
        }
      }
    }
  }

  private generateJavascriptContent(nodesJson: string, edgesJson: string, directedGraph: IDirectedGraph): string {
    const templateJsFilename = DgmlViewer._name + '_Template.js';
    let template = fs.readFileSync(this.extensionContext?.asAbsolutePath(path.join('templates', templateJsFilename)), 'utf8');
    let jsContent = template.replace('var nodes = new vis.DataSet([]);', `var nodes = new vis.DataSet([${nodesJson}]);`);
    jsContent = jsContent.replace('var edges = new vis.DataSet([]);', `var edges = new vis.DataSet([${edgesJson}]);`);
    jsContent = jsContent.replace('background: "#D2E5FF" // nodes default background color', `background: "${this.config.defaultNodeBackgroundColor}" // nodes default background color`);
    jsContent = jsContent.replace('shape: \'box\' // The shape of the nodes.', `shape: '${this.config.nodeShape}'// The shape of the nodes.`);
    jsContent = jsContent.replace('type: "triangle" // edge arrow to type', `type: "${this.config.edgeArrowToType}" // edge arrow to type}`);
    jsContent = jsContent.replace('ctx.strokeStyle = \'blue\'; // graph selection guideline color', `ctx.strokeStyle = '${this.config.graphSelectionGuidelineColor}'; // graph selection guideline color`);
    jsContent = jsContent.replace('ctx.lineWidth = 1; // graph selection guideline width', `ctx.lineWidth = ${this.config.graphSelectionGuidelineWidth}; // graph selection guideline width`);
    jsContent = jsContent.replace('selectionCanvasContext.strokeStyle = \'red\';', `selectionCanvasContext.strokeStyle = '${this.config.graphSelectionColor}';`);
    jsContent = jsContent.replace('selectionCanvasContext.lineWidth = 2;', `selectionCanvasContext.lineWidth = ${this.config.graphSelectionWidth};`);
    jsContent = jsContent.replace("var defaultGraphDirection = ''; // The graph direction from the dgml file itself", `var defaultGraphDirection = '${this.convertGraphDirectionToVisLayoutValues(directedGraph)}'; // The graph direction from the dgml file itself`);
    jsContent = jsContent.replace('layout: {} // The layout of the directed graph', `layout: {${this.getDirectedGraphLayoutJs(directedGraph)}} // The layout of the directed graph`);
    return jsContent;
  }

  private generateHtmlContent(webview: vscode.Webview, outputJsFilename: string): string {
    const templateHtmlFilename = DgmlViewer._name + '_Template.html';
    let htmlContent = fs.readFileSync(this.extensionContext?.asAbsolutePath(path.join('templates', templateHtmlFilename)), 'utf8');

    const visPath = vscode.Uri.joinPath(this.extensionContext.extensionUri, 'javascript', 'vis-network.min.js');
    const visUri = webview.asWebviewUri(visPath);
    htmlContent = htmlContent.replace('vis-network.min.js', visUri.toString());

    const cssPath = vscode.Uri.joinPath(this.extensionContext.extensionUri, 'stylesheets', DgmlViewer._name + '.css');
    const cssUri = webview.asWebviewUri(cssPath);
    htmlContent = htmlContent.replace(DgmlViewer._name + '.css', cssUri.toString());

    const nonce = this.getNonce();
    htmlContent = htmlContent.replace('nonce-nonce', `nonce-${nonce}`);
    htmlContent = htmlContent.replace(/<script /g, `<script nonce="${nonce}" `);
    htmlContent = htmlContent.replace('cspSource', webview.cspSource);

    const jsPath = vscode.Uri.joinPath(this.extensionContext.extensionUri, outputJsFilename);
    const jsUri = webview.asWebviewUri(jsPath);
    htmlContent = htmlContent.replace(DgmlViewer._name + '.js', jsUri.toString());
    return htmlContent;
  }

  private getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private convertGraphDirectionToVisLayoutValues(directedGraph: IDirectedGraph): string {
    let direction: string = '';
    if (directedGraph.graphDirection !== undefined) {
      switch (directedGraph.graphDirection.toLowerCase()) {
        case 'lefttoright': direction = 'LR'; break;
        case 'righttoleft': direction = 'RL'; break;
        case 'toptobottom': direction = 'UD'; break;
        case 'bottomtotop': direction = 'DU'; break;
        default: direction = 'LR'; break;
      }
    }
    return direction;
  }

  private getDirectedGraphLayoutJs(directedGraph: IDirectedGraph): string {
    if (directedGraph.graphDirection !== undefined) {
      let direction: string = this.convertGraphDirectionToVisLayoutValues(directedGraph);
      return `hierarchical: {enabled: true, direction: '${direction}', sortMethod: 'hubsize' }`;
    }
    return 'hierarchical: { enabled: false }';
  }

  private saveAsPng(messageText: string) {
    const dataUrl = messageText.split(',');
    if (dataUrl.length > 0) {
      const u8arr = Base64.toUint8Array(dataUrl[1]);

      const workspaceDirectory = this.fsUtils.getWorkspaceFolder();
      const newFilePath = path.join(workspaceDirectory, this.config.dgmlViewerPngFilename);
      this.fsUtils.writeFile(newFilePath, u8arr, () => { });

      vscode.window.showInformationMessage(`The file ${this.config.dgmlViewerPngFilename} has been created in the root of the workspace.`);
    }
  }

}