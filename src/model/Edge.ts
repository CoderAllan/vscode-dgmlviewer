import { Category } from '@model';
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

  private categoryRef: Category | undefined;
  public setCategoryRef(categoryRef: Category | undefined) {
    this.categoryRef = categoryRef;
  }

  public showPopupsOverNodesAndEdges: boolean = true;

  public toJsString(): string {
    const jsStringProperties: string[] = [];
    const titleElements: string[] = [];
    if (this.label !== undefined) {
      jsStringProperties.push(`label: '${this.label.replace("'", "\\'")}'`);
      titleElements.push(`Label: ${this.label}`);
    }
    else {
      jsStringProperties.push(`label: ''`);
    }
    if (this.source !== undefined) {
      jsStringProperties.push(`source: '${this.source}'`);
      titleElements.push(`Source: ${this.sourceLabel !== undefined ? this.sourceLabel : this.source}`);
    }
    if (this.target !== undefined) {
      jsStringProperties.push(`target: '${this.target}'`);
      titleElements.push(`Target: ${this.targetLabel !== undefined ? this.targetLabel : this.target}`);
    }
    // if (this.visibility !== undefined) { jsStringProperties.push(`hidden: ${this.visibility}`); }
    if (this.categoryRef !== undefined && this.categoryRef?.label !== undefined) {
      titleElements.push(`Category: ${this.categoryRef?.label}`);
    }

    this.pushValueStyling(this.fontWeight, this.categoryRef, this.categoryRef?.fontWeight, 'link', 'fontweight', jsStringProperties, 'fontWeight', 'normal');
    this.pushValueStyling(this.fontFamily, this.categoryRef, this.categoryRef?.fontFamily, 'link', 'fontfamily', jsStringProperties, 'fontFamily', 'sans-serif');
    this.pushValueStyling(this.fontSize, this.categoryRef, this.categoryRef?.fontSize, 'link', 'fontsize', jsStringProperties, 'fontSize', '1em');
    this.pushColorStyling(this.background, this.categoryRef, this.categoryRef?.background, 'link', 'background', jsStringProperties, 'backgroundColor', 'rgba(0, 0, 0, 0)', ', backgroundOpacity: 1', ', backgroundOpacity: 0');
    this.pushColorStyling(this.stroke, this.categoryRef, this.categoryRef?.stroke, 'link', 'stroke', jsStringProperties, 'color', 'rgba(63, 124, 227, 1)');
    this.pushDashArrayStyling(this.strokeDashArray, this.categoryRef, this.categoryRef?.strokeDashArray, 'link', jsStringProperties, 'lineStyle');
    this.pushValueStyling(this.strokeThickness, this.categoryRef, this.categoryRef?.strokeThickness, 'link', 'strokethickness', jsStringProperties, 'width', '1');

    if (this.showPopupsOverNodesAndEdges && titleElements.length > 0) {
      let title = titleElements.join('<br>\\n').replace("'", "\\'");
      jsStringProperties.push(`title: '${title}'`);
    }
    if (this.categoryRef !== undefined && this.categoryRef.isContainment) {
      return ''; // if the edge has a containment category then no edge element should be created
    }
    return `{ data: {${jsStringProperties.join(', ')}}}`;
  }
}
