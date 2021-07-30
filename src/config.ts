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

  public readonly dgmlZoomLevel = '-1';
  public get defaultNodeBackgroundColor(): string { return this.getSetting<string>('defaultNodeBackgroundColor', '#D2E5FF'); }
  public get defaultLayout(): string { return this.getSetting<string>('defaultLayout', 'preset'); }
  public get nodeShape(): string { return this.getSetting<string>('nodeShape', 'box'); }
  public get edgeArrowToType(): string { return this.getSetting<string>('edgeArrowToType', 'triangle'); }
  public get graphSelectionGuidelineColor(): string { return this.getSetting<string>('graphSelectionGuidelineColor', 'blue'); }
  public get graphSelectionGuidelineWidth(): number { return this.getSetting<number>('graphSelectionGuidelineWidth', 1); }
  public get graphSelectionColor(): string { return this.getSetting<string>('graphSelectionColor', 'red'); }
  public get graphSelectionWidth(): number { return this.getSetting<number>('graphSelectionWidth', 2); }
  public get dgmlViewerPngFilename(): string { return this.getSetting<string>('pngFilename', 'DirectedGraph.png'); }
  public get showPopupsOverNodesAndEdges(): boolean { return this.getSetting<boolean>('showPopupsOverNodesAndLinks', true); }
}
