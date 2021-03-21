import { ICategory } from '@model';
import { BaseElement } from './BaseElement';
// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Link extends BaseElement {
  public source: string | undefined;
  public target: string | undefined;
  public category: string | undefined;
  // CommonAttributes
  public label: string | undefined;
  public visibility: boolean | undefined;
  public background: string | undefined;
  public fontSize: number | undefined;
  public fontFamily: string | undefined;
  public fontStyle: string | undefined;
  public fontWeight: string | undefined;
  public stroke: string | undefined;
  public strokeThickness: string | undefined;
  public strokeDashArray: string | undefined;
  // GroupingAttributes
  public seeder: boolean | undefined;
  public attractConsumers: boolean | undefined;

  private categoryRef: ICategory | undefined;
  public setCategoryRef(categoryRef: ICategory | undefined) {
    this.categoryRef = categoryRef;
  }

  public toJsString(): string {
    const jsStringProperties: string[] = ['arrows: arrowAttr'];
    if (this.source !== undefined) { jsStringProperties.push(`from: "${this.source}"`); }
    if (this.target !== undefined) { jsStringProperties.push(`to: "${this.target}"`); }
    if (this.label !== undefined) { jsStringProperties.push(`label: "${this.label}"`); }
    if (this.strokeThickness !== undefined) { jsStringProperties.push(`width: ${this.strokeThickness}`); }
    if (this.visibility !== undefined) { jsStringProperties.push(`hidden: ${this.visibility}`); }
    const jsStringColorProperties: string[] = [];
    if (this.stroke !== undefined) { jsStringColorProperties.push(`color: "${this.convertColorValue(this.stroke)}"`); }
    if (this.categoryRef !== undefined){
      if (this.categoryRef.background !== undefined) {
        jsStringProperties.push(`color: "${this.convertColorValue(this.categoryRef.background)}"`);
      }
      if (this.categoryRef.stroke !== undefined) {
        jsStringProperties.push(`color: "${this.convertColorValue(this.categoryRef.stroke)}"`);
      }
      if (this.categoryRef.strokeDashArray !== undefined) {
        jsStringProperties.push(`dashes: true`);
      }
      if (this.categoryRef.strokeThickness !== undefined) {
        jsStringProperties.push(`width: ${this.categoryRef.strokeThickness}`);
      }
    }
    if (jsStringColorProperties.length > 0) { jsStringProperties.push(`color: { ${jsStringColorProperties.join(', ')} }`); }
    return `{${jsStringProperties.join(', ')}}`;
  }
}