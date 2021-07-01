import { ICategory } from '@model';
import { BaseElement } from './BaseElement';
// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Link extends BaseElement {
  public source: string | undefined;
  public target: string | undefined;
  public mutualLinkCount: number = 1;
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

  public showPopupsOverNodesAndLinks: boolean = true;

  public toJsString(): string {
    const jsStringProperties: string[] = ['arrows: "triangle"'];
    const titleElements: string[] = [];
    if (this.label !== undefined) {
      jsStringProperties.push(`label: "${this.label}"`);
      titleElements.push(`Label: ${this.label}`);
    }
    if (this.source !== undefined) {
      jsStringProperties.push(`source: "${this.source}"`);
      titleElements.push(`Source: ${this.source}`);
    }
    if (this.target !== undefined) {
      jsStringProperties.push(`target: "${this.target}"`);
      titleElements.push(`Target: ${this.target}`);
    }
    if (this.mutualLinkCount > 1) {
      jsStringProperties.push(`smooth: {type: 'curvedCW', roundness: 0.2}`);
    } else {
      jsStringProperties.push(`smooth: false`);
    }
    if (this.strokeThickness !== undefined) { jsStringProperties.push(`width: ${this.strokeThickness}`); }
    if (this.visibility !== undefined) { jsStringProperties.push(`hidden: ${this.visibility}`); }
    const jsStringColorProperties: string[] = [];
    if (this.stroke !== undefined) { jsStringColorProperties.push(`color: "${this.convertColorValue(this.stroke)}"`); }
    if (this.categoryRef !== undefined){
      titleElements.push(`Category: ${this.categoryRef.id}`);
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
    if (this.showPopupsOverNodesAndLinks &&titleElements.length > 0) {
      let title = titleElements.join('\\n');
      jsStringProperties.push(`title: "${title}"`);
    }
    return `{ data: {${jsStringProperties.join(', ')}}}`;
  }
}