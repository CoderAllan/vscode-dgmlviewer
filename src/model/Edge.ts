import { ICategory } from '@model';
import { BaseElement } from './BaseElement';
// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Edge extends BaseElement {
  public source: string = '';
  public sourceLabel: string | undefined;
  public target: string = '';
  public targetLabel: string | undefined;
  public mutualEdgeCount: number = 1;
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

  public showPopupsOverNodesAndEdges: boolean = true;

  public toJsString(): string {
    const jsStringProperties: string[] = [];
    const titleElements: string[] = [];
    if (this.label !== undefined) {
      jsStringProperties.push(`label: "${this.label}"`);
      titleElements.push(`Label: ${this.label}`);
    }
    if (this.fontWeight !== undefined) {
      jsStringProperties.push(`fontWeight: '${this.fontWeight}'`);
    }
    else if (this.categoryRef !== undefined &&
      this.categoryRef.fontWeight !== undefined) {
      jsStringProperties.push(`fontWeight: '${this.categoryRef.fontWeight}'`);
    }
    else {
      jsStringProperties.push(`fontWeight: 'normal'`);
    }
    if (this.fontFamily !== undefined) {
      jsStringProperties.push(`fontFamily: '${this.fontFamily}'`);
    }
    else if (this.categoryRef !== undefined &&
      this.categoryRef.fontFamily !== undefined) {
      jsStringProperties.push(`fontFamily: '${this.categoryRef.fontFamily}'`);
    }
    else{
      jsStringProperties.push(`fontFamily: 'sans-serif'`);
    }
    if (this.fontSize !== undefined) {
      jsStringProperties.push(`fontSize: '${this.fontSize}'`);
    }
    else if (this.categoryRef !== undefined &&
      this.categoryRef.fontSize !== undefined) {
      jsStringProperties.push(`fontSize: '${this.categoryRef.fontSize}'`);
    }
    else {
      jsStringProperties.push(`fontSize: '1em'`);
    }
    if (this.source !== undefined) {
      jsStringProperties.push(`source: "${this.source}"`);
      titleElements.push(`Source: ${this.sourceLabel !== undefined ? this.sourceLabel : this.source}`);
    }
    if (this.target !== undefined) {
      jsStringProperties.push(`target: "${this.target}"`);
      titleElements.push(`Target: ${this.targetLabel !== undefined ? this.targetLabel : this.target}`);
    }
    // if (this.visibility !== undefined) { jsStringProperties.push(`hidden: ${this.visibility}`); }
    if (this.categoryRef !== undefined) {
      titleElements.push(`Category: ${this.categoryRef.id}`);
    }
    if (this.categoryRef !== undefined && this.categoryRef.background !== undefined) {
      jsStringProperties.push(`backgroundColor: \'${this.convertColorValue(this.categoryRef.background)}\'`);
    }
    else {
      jsStringProperties.push(`backgroundColor: \'rgba(63, 124, 227, 1)\'`);
    }
    if (this.categoryRef !== undefined && this.categoryRef.stroke !== undefined) {
      jsStringProperties.push(`color: \'${this.convertColorValue(this.categoryRef.stroke)}\'`);
    }
    else {
      if (this.stroke !== undefined) {
        jsStringProperties.push(`color: \'${this.convertColorValue(this.stroke)}\'`);
      }
      else {
        jsStringProperties.push(`color: \'rgba(63, 124, 227, 1)\'`);
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
        jsStringProperties.push(`width: 1`);
      }
    }
    if (this.showPopupsOverNodesAndEdges && titleElements.length > 0) {
      let title = titleElements.join('<br>\\n');
      jsStringProperties.push(`title: "${title}"`);
    }
    if (this.categoryRef !== undefined && this.categoryRef .isContainment) {
      return ''; // if the edge has a containment category then no edge element should be created
    }
    return `{ data: {${jsStringProperties.join(', ')}}}`;
  }
}