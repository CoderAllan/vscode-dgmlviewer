import { IStyle } from "@model";

export class Category {
  constructor(id: string) {
    this.id = id;
  }
  public id: string;
  public basedOn?: string | undefined;
  public canLinkedNodesBeDataDriven?: string | undefined;
  public canBeDataDriven?: string | undefined;
  public defaultAction?: string | undefined;
  public incomingActionLabel?: string | undefined;
  public isProviderRoot?: boolean | undefined;
  public isContainment?: boolean | undefined;
  public isTag?: boolean | undefined;
  public navigationActionLabel?: string | undefined;
  public outgoingActionLabel?: string | undefined;
  public sourceCategory?: string | undefined;
  public targetCategory?: string | undefined;
  public details?: string | undefined;
  public inboundName?: string | undefined;
  public outboundName?: string | undefined;
  public label?: string | undefined;
  public visibility?: string | undefined;
  public background?: string | undefined;
  public fontSize?: number | undefined;
  public fontFamily?: string | undefined;
  public fontStyle?: string | undefined;
  public fontWeight?: string | undefined;
  public stroke?: string | undefined;
  public strokeThickness?: string | undefined;
  public strokeDashArray?: string | undefined;
  public icon?: string | undefined;
  public shape?: string | undefined;
  public style?: string | undefined;
  public styleTargetType?: string | undefined;
  public horizontalAlignment?: string | undefined;
  public verticalAlignment?: string | undefined;
  public minWidth?: number | undefined;
  public maxWidth?: number | undefined;
  public nodeRadius?: number | undefined;
  
  public nodeStyleRef: IStyle | undefined;
  public linkStyleRef: IStyle | undefined;
  
}