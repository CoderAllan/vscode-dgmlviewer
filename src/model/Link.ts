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
    const jsStringProperties: string[] = [];
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
    // if (this.visibility !== undefined) { jsStringProperties.push(`hidden: ${this.visibility}`); }
    // if (this.categoryRef !== undefined) {
    //   titleElements.push(`Category: ${this.categoryRef.id}`);
    // }
    if (this.categoryRef !== undefined && this.categoryRef.background !== undefined) {
      jsStringProperties.push(`backgroundColor: \'${this.convertColorValue(this.categoryRef.background)}\'`);
    }
    else {
      jsStringProperties.push(`backgroundColor: \'grey\'`);
    }
    if (this.categoryRef !== undefined && this.categoryRef.stroke !== undefined) {
      jsStringProperties.push(`color: \'${this.convertColorValue(this.categoryRef.stroke)}\'`);
    }
    else {
      if (this.stroke !== undefined) {
        jsStringProperties.push(`color: \'${this.convertColorValue(this.stroke)}\'`);
      }
      else {
        jsStringProperties.push(`color: \'grey\'`);
      }
    }
    if (this.categoryRef !== undefined && this.categoryRef.strokeDashArray !== undefined) {
      jsStringProperties.push(`lineStyle: 'dashed'`);
    }
    else {
      jsStringProperties.push(`lineStyle: 'solid'`);
    }
    if (this.categoryRef !== undefined && this.categoryRef.strokeThickness !== undefined) {
      jsStringProperties.push(`width: ${this.categoryRef.strokeThickness}`);
    }
    else {
      if (this.strokeThickness !== undefined) {
        jsStringProperties.push(`width: ${this.strokeThickness}`);
      }
      else {
        jsStringProperties.push(`width: 2`);
      }
    }
    // if (this.showPopupsOverNodesAndLinks && titleElements.length > 0) {
    //   let title = titleElements.join('\\n');
    //   jsStringProperties.push(`title: "${title}"`);
    // }
    return `{ data: {${jsStringProperties.join(', ')}}}`;
  }
}