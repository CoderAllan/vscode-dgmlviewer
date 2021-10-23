import { Category, IProperty } from "@model";
import path = require("path");
import { Config, FileSystemUtils } from "@src";
import { BaseElement } from "./BaseElement";

// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Node extends BaseElement {
  public filename: string;
  public id: string = '';
  public category: string | undefined;
  public description: string | undefined;
  public reference: string | undefined;
  public isVertical: boolean | undefined;
  public group: string | undefined;
  // Cytoscape specific attributes
  public parent: string | undefined;
  public hasChildren: boolean = false;
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
  // CodeSchemaAttributes - Not all included
  public filePath: string | undefined;
  // Visual Studio generated properties
  public boundsX: number | undefined;
  public boundsY: number | undefined;
  public boundsWidth: number | undefined;
  public boundsHeight: number | undefined;

  public categoryRef: Category | undefined;
  public basedOnCategoryRef: Category | undefined;

  public customProperties: IProperty[] = [];
  public showPopupsOverNodesAndEdges: boolean = true;

  private config = new Config();

  constructor(filename: string) {
    super();
    this.filename = filename;
  }

  public toJsString(): string {
    const jsStringProperties: string[] = [];
    const titleElements: string[] = [];
    if (this.id !== undefined) { jsStringProperties.push(`id: '${this.id}'`); }
    let label = this.convertNewlines(this.label);
    if (label !== '' && label !== undefined) {
      jsStringProperties.push(`label: '${label}'`);
      titleElements.push(`Label: ${this.removeNewLines(label)}`);
    } else {
      jsStringProperties.push(`label: '${this.id}'`);
      titleElements.push(`Label: ${this.id}`);
    }
    const description = this.convertNewlines(this.description);
    if (this.description !== undefined) {
      titleElements.push(`Description: ${this.removeNewLines(description)}`);
    }
    if (this.categoryRef !== undefined) { titleElements.push(`Category: ${this.categoryRef.id}`); }
    
    this.pushColorStyling(this.background, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.background, 'node', 'background', jsStringProperties, 'background', this.config.defaultNodeBackgroundColor);
    this.pushColorStyling(this.stroke, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.stroke, 'node', 'stroke', jsStringProperties, 'borderColor', 'rgba(75, 133, 227, 1)');
    this.pushValueStyling(this.strokeThickness, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.strokeThickness, 'node', 'strokethickness', jsStringProperties, 'borderWidth', '1');
    this.pushDashArrayStyling(this.strokeDashArray, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.strokeDashArray, 'node', jsStringProperties, 'borderStyle');
    this.pushValueStyling(this.fontWeight, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.fontWeight, 'node', 'fontweight', jsStringProperties, 'fontWeight', 'normal');
    this.pushValueStyling(this.fontFamily, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.fontFamily, 'node', 'fontfamily', jsStringProperties, 'fontFamily', 'sans-serif');
    this.pushValueStyling(this.fontSize, this.categoryRef, this.basedOnCategoryRef, this.categoryRef?.fontSize, 'node', 'fontsize', jsStringProperties, 'fontSize', '1em');
    
    let position = '';
    if (this.boundsX !== undefined && this.boundsY !== undefined) {
      position = `, position: { x: ${Math.round(this.boundsX)}, y: ${Math.round(this.boundsY)}}`;
    }
    if (this.boundsWidth !== undefined) { jsStringProperties.push(`width: ${Math.round(this.boundsWidth)}`); }
    if (this.boundsHeight !== undefined) { jsStringProperties.push(`height: ${Math.round(this.boundsHeight)}`); }
    let referencePropertyValue: string | undefined;
    if (this.filePath !== undefined) {
      referencePropertyValue = this.getReferenceFilename(this.filePath);
    }
    if (referencePropertyValue === undefined && this.customProperties.length > 0) {
      const firstReferenceProperty = this.customProperties.find(property => property.isReference === true);
      if (firstReferenceProperty !== undefined && firstReferenceProperty.value !== undefined) {
        referencePropertyValue = this.getReferenceFilename(firstReferenceProperty.value);
      }
      this.customProperties.forEach(property => {
        titleElements.push(`${property.id}: ${property.value?.split('\\').join('/')}`);
      });
    }
    if (referencePropertyValue !== undefined) {
      jsStringProperties.push(`filepath: '${referencePropertyValue}'`);
      titleElements.push(`Filepath: ${referencePropertyValue}`);
    }
    else {
      jsStringProperties.push(`filepath: ''`);
    }
    if (this.parent !== undefined) {
      jsStringProperties.push(`parent: '${this.parent}'`);
    }
    if (this.hasChildren) {
      jsStringProperties.push(`labelvalign: 'top'`);
    }
    else {
      jsStringProperties.push(`labelvalign: 'center'`);
    }
    if (this.showPopupsOverNodesAndEdges && titleElements.length > 0) {
      let title = titleElements.join('<br>\\n').replace("'", "\\'");
      jsStringProperties.push(`title: '${title}'`);
    }
    return `{ data: {${jsStringProperties.join(', ')}}${position}}`;
  }

  private getReferenceFilename(propertyValue: string): string | undefined {
    let referenceFilename: string | undefined = undefined;
    const fsUtil = new FileSystemUtils();
    if (fsUtil.fileExists(propertyValue)) {
      referenceFilename = propertyValue.split('\\').join('/');
    } else {
      const currentDocumentFolder = path.dirname(this.filename);
      referenceFilename = path.join(currentDocumentFolder, propertyValue);
      if (fsUtil.fileExists(referenceFilename)) {
        referenceFilename = referenceFilename.split('\\').join('/');
      } else {
        referenceFilename = undefined;
      }
    }
    return referenceFilename;
  }

  private convertNewlines(text: string | undefined): string {
    if (text === undefined || text.length === 0) {
      return '';
    }
    text = text.split('&#xD;&#xA;').join('\\n');
    text = text.split('&#xA;').join('\\n');
    text = text.split('&#xD;').join('\\n');
    return text;
  }

  private removeNewLines(text: string | undefined): string {
    if (text === undefined || text.length === 0) {
      return '';
    }
    text = text.split('\\n').join(' ');
    return text;
  }
}
