import * as vscode from 'vscode';

export class Config {
  public readonly dgmlViewerOutputChannel = 'DGML Viewer';

  private configuration = vscode.workspace.getConfiguration('dgmlViewer');
  private getSetting<T>(setting: string, defaultValue: T): T {
    let value = this.configuration.get<T>(setting);
    if (value === undefined) {
      value = defaultValue;
    }
    if (typeof value === 'string' && value.length === 0) {
      value = defaultValue;
    }
    return value as T;
  }

  public get dgmlGraphDirection(): string { return this.getSetting<string>('dgmlViewer.graphDirection', 'LeftToRight'); }
  public readonly dgmlZoomLevel = '-1';
  public get defaultNodeBackgroundColor(): string { return this.getSetting<string>('dgmlViewer.defaultNodeBackgroundColor', '#D2E5FF'); }
  public get nodeShape(): string { return this.getSetting<string>('dgmlViewer.nodeShape', 'box'); }
  public get edgeArrowToType(): string { return this.getSetting<string>('dgmlViewer.edgeArrowToType', 'triangle'); }
  public get graphSelectionGuidelineColor(): string { return this.getSetting<string>('dgmlViewer.graphSelectionGuidelineColor', 'blue'); }
  public get graphSelectionGuidelineWidth(): number { return this.getSetting<number>('dgmlViewer.graphSelectionGuidelineWidth', 1); }
  public get graphSelectionColor(): string { return this.getSetting<string>('dgmlViewer.graphSelectionColor', 'red'); }
  public get graphSelectionWidth(): number { return this.getSetting<number>('dgmlViewer.graphSelectionWidth', 2); }
  public get dgmlViewerPngFilename(): string { return this.getSetting<string>('dgmlViewer.pngFilename', 'DirectedGraph.png'); }
}