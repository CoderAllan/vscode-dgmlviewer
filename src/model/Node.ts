import { ICategory } from "@model";

// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Node {
  public id: string | undefined;
  public category: string | undefined;
  public description: string | undefined;
  public reference: string | undefined;
  public isVertical: boolean | undefined;
  public group: string | undefined;
  // CommonAttributes
  public label: string | undefined;
  public visibility: string | undefined;
  public background: string | undefined;
  public fontSize: number | undefined;
  public fontFamily: string | undefined;
  public fontStyle: string | undefined;
  public fontWeight: string | undefined;
  public stroke: string | undefined;
  public strokeThickness: string | undefined;
  public strokeDashArray: string | undefined;
  // CategorizableNodeProperties
  public icon: string | undefined;
  public shape: string | undefined;
  public style: string | undefined;
  public horizontalAlignment: string | undefined;
  public verticalAlignment: string | undefined;
  public minWidth: number | undefined;
  public maxWidth: number | undefined;
  public nodeRadius: number | undefined;
  // CodeSchemaAttributes - Not included
  // Visual Studio generated properties
  public boundsX: number | undefined;
  public boundsY: number | undefined;
  public boundsWidth: number | undefined;
  public boundsHeight: number | undefined;

  private categoryRef: ICategory | undefined;
  public setCategoryRef(categoryRef: ICategory | undefined) {
    this.categoryRef = categoryRef;
  }
  
  public toJsString(): string {
    const jsStringProperties: string[] = [];
    if (this.id !== undefined) { jsStringProperties.push(`id: "${this.id}"`); }
    const label = this.convertNewlines(this.label);
    if (this.label !== undefined) {
      jsStringProperties.push(`label: "${label}"`);
    } else {
      jsStringProperties.push(`label: "${this.id}"`);
    }
    const description = this.convertNewlines(this.description);
    if (this.description !== undefined) { jsStringProperties.push(`title: "${description}"`); }
    if (this.strokeThickness !== undefined) { jsStringProperties.push(`borderWidth: "${this.strokeThickness}"`); }
    const jsStringColorProperties: string[] = [];
    if (this.stroke !== undefined) { jsStringColorProperties.push(`border: "${this.stroke}"`); }
    if (this.background !== undefined) { jsStringColorProperties.push(`background: "${this.background}"`); }
    if (this.categoryRef !== undefined && this.background === undefined && this.categoryRef.background !== undefined) { jsStringColorProperties.push(`background: "${this.categoryRef.background}"`); }
    if (this.categoryRef !== undefined && this.stroke === undefined && this.categoryRef.stroke !== undefined) { jsStringColorProperties.push(`border: "${this.categoryRef.stroke}"`); }
    if (jsStringColorProperties.length > 0) { jsStringProperties.push(`color: { ${jsStringColorProperties.join(', ')} }`); }
    if (this.boundsX !== undefined && this.boundsY !== undefined) { jsStringProperties.push(`x: ${this.boundsX}, y: ${this.boundsY}, fixed: { x: true, y: true}`); }
    if (this.boundsWidth !== undefined) { jsStringProperties.push(`widthConstraint: { minimum: ${this.boundsWidth} }`) }
    if (this.boundsHeight !== undefined) { jsStringProperties.push(`heightConstraint: { minimum: ${this.boundsHeight}, valign: top }`) }
    return `{${jsStringProperties.join(', ')}}`;
  }

  private convertNewlines(text: string | undefined): string {
    if(text === undefined || text.length === 0) {
      return '';
    }
    text = text.replace('&#xD;&#xA;', '\\n');
    text = text.replace('&#xA;', '\\n');
    text = text.replace('&#xD;', '\\n');
    return text;
  }
}
