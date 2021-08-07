import { ICategory, IProperty } from "@model";
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

  private categoryRef: ICategory | undefined;
  public setCategoryRef(categoryRef: ICategory | undefined) {
    this.categoryRef = categoryRef;
  }

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
    titleElements.push(`Label: ${this.removeNewLines(label)}`);
    const description = this.convertNewlines(this.description);
    if (this.description !== undefined) {
      titleElements.push(`Description: ${this.removeNewLines(description)}`);
    }
    if (this.categoryRef !== undefined) { titleElements.push(`Category: ${this.categoryRef.id}`); }
    if (this.background === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.background !== undefined) {
      jsStringProperties.push(`background: '${this.convertColorValue(this.categoryRef.background)}'`);
    }
    else {
      if (this.background !== undefined) {
        jsStringProperties.push(`background: "${this.convertColorValue(this.background)}"`);
      }
      else {
        jsStringProperties.push(`background: '${this.convertColorValue(this.config.defaultNodeBackgroundColor)}'`);
      }
    }
    if (this.stroke === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.stroke !== undefined) {
      jsStringProperties.push(`borderColor: '${this.convertColorValue(this.categoryRef.stroke)}'`);
    }
    else {
      if (this.stroke !== undefined) {
        jsStringProperties.push(`borderColor: '${this.stroke}'`);
      }
      else {
        jsStringProperties.push(`borderColor: 'rgba(75, 133, 227, 1)'`);
      }
    }
    if (this.strokeThickness === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.strokeThickness !== undefined) {
      jsStringProperties.push(`borderWidth: ${this.categoryRef.strokeThickness}`);
    }
    else {
      if (this.strokeThickness !== undefined) {
        jsStringProperties.push(`borderWidth: ${this.strokeThickness}`);
      }
      else {
        jsStringProperties.push(`borderWidth: 1`);
      }
    }
    if (this.strokeDashArray === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.strokeDashArray !== undefined) {
      jsStringProperties.push(`borderStyle: 'dashed'`);
    }
    else {
      if (this.strokeDashArray !== undefined) {
        jsStringProperties.push(`borderStyle: 'dashed'`);
      }
      else {
        jsStringProperties.push(`borderStyle: 'solid'`);
      }
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
    if (label !== '') {
      jsStringProperties.push(`label: '${label}'`);
    } else {
      jsStringProperties.push(`label: '${this.id}'`);
    }
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
