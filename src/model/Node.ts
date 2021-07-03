import { ICategory, IProperty } from "@model";
import path = require("path");
import { FileSystemUtils } from "@src";
import { BaseElement } from "./BaseElement";

// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export class Node extends BaseElement {
  public filename: string;
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
  public showPopupsOverNodesAndLinks: boolean = true;

  constructor(filename: string) {
    super();
    this.filename = filename;
  }

  public toJsString(): string {
    const jsStringProperties: string[] = [];
    const titleElements: string[] = [];
    if (this.id !== undefined) { jsStringProperties.push(`id: "${this.id}"`); }
    let label = this.convertNewlines(this.label);
    titleElements.push(`Label: ${this.removeNewLines(label)}`);
    if (this.fontWeight !== undefined &&
      this.fontWeight.toLowerCase().startsWith('bold')) {
      label = `<b>${label}</b>`;
    }
    const description = this.convertNewlines(this.description);
    if (this.description !== undefined) {
      jsStringProperties.push(`title: "${description}"`);
      titleElements.push(`Description: ${this.removeNewLines(description)}`);
    }
    // const jsStringFontProperties: string[] = [];
    // if (this.fontFamily === undefined) { jsStringFontProperties.push(`face: ${this.fontFamily}`); }
    // if (this.fontSize === undefined) { jsStringFontProperties.push(`size: ${this.fontSize}`); }
    // if (this.categoryRef !== undefined) { titleElements.push(`Category: ${this.categoryRef.id}`); }
    if (this.background === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.background !== undefined) {
      jsStringProperties.push(`background: \'${this.convertColorValue(this.categoryRef.background)}\'`);
    }
    else {
      if (this.background !== undefined) {
        jsStringProperties.push(`background: "${this.convertColorValue(this.background)}"`);
      }
      else {
        jsStringProperties.push(`background: \'grey\'`);
      }
    }
    if (this.stroke === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.stroke !== undefined) {
      jsStringProperties.push(`borderColor: \'${this.convertColorValue(this.categoryRef.stroke)}\'`);
    }
    else {
      if (this.stroke !== undefined) {
        jsStringProperties.push(`borderColor: \'${this.stroke}\'`);
      }
      else {
        jsStringProperties.push(`borderColor: \'grey\'`);
      }
    }
    if (this.strokeThickness === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.strokeThickness !== undefined) {
      jsStringProperties.push(`borderWidth: ${this.categoryRef.strokeThickness}`);
    }
    else {
      if (this.strokeThickness !== undefined) {
        jsStringProperties.push(`borderWidth: "${this.strokeThickness}"`);
      }
      else {
        if (this.stroke !== undefined ||
          this.categoryRef !== undefined && this.categoryRef.stroke !== undefined ||
          this.strokeDashArray !== undefined ||
          this.categoryRef !== undefined && this.categoryRef.strokeDashArray !== undefined) {
            jsStringProperties.push(`borderWidth: 2`);
        }
        else {
          jsStringProperties.push(`borderWidth: 0`);
        }
      }
    }
    if (this.strokeDashArray === undefined &&
      this.categoryRef !== undefined &&
      this.categoryRef.strokeDashArray !== undefined) {
      jsStringProperties.push(`borderStyle: \'dashed\'`);
    }
    else {
      if (this.strokeDashArray !== undefined) {
        jsStringProperties.push(`borderStyle: \'dashed\'`);
      }
      jsStringProperties.push(`borderStyle: \'solid\'`);
    }
    // if (this.fontFamily === undefined &&
    //   this.categoryRef !== undefined &&
    //   this.categoryRef.fontFamily !== undefined) {
    //   jsStringFontProperties.push(`face: ${this.categoryRef.fontFamily}`);
    // }
    // if (this.fontSize === undefined &&
    //   this.categoryRef !== undefined &&
    //   this.categoryRef.fontSize !== undefined) {
    //   jsStringFontProperties.push(`size: ${this.categoryRef.fontSize}`);
    // }
    // if (this.fontWeight === undefined &&
    //   this.categoryRef !== undefined &&
    //   this.categoryRef.fontWeight !== undefined &&
    //   this.categoryRef.fontWeight.toLowerCase().startsWith('bold')) {
    //   label = `<b>${label}</b>`;
    // }
    // if (jsStringFontProperties.length > 0) {
    //   jsStringFontProperties.push(`multi: 'html'`);
    //   jsStringProperties.push(`font: { ${jsStringFontProperties.join(', ')} }`);
    // }
    if (this.label !== undefined) {
      jsStringProperties.push(`label: "${label}"`);
    } else {
      jsStringProperties.push(`label: "${this.id}"`);
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
      titleElements.push(`Filepath: ${referencePropertyValue}`);
    }
    if (referencePropertyValue === undefined && this.customProperties.length > 0) {
      const firstReferenceProperty = this.customProperties.find(property => property.isReference === true);
      if (firstReferenceProperty !== undefined && firstReferenceProperty.value !== undefined) {
        referencePropertyValue = this.getReferenceFilename(firstReferenceProperty.value);
      }
      this.customProperties.forEach(property => {
        titleElements.push(`${property.id}: ${property.value}`);
      });
    }
    if (referencePropertyValue !== undefined) {
      jsStringProperties.push(`filepath: "${referencePropertyValue}"`);
    }
    else {
      jsStringProperties.push(`filepath: \'\'`);
    }
    // if (this.showPopupsOverNodesAndLinks && titleElements.length > 0) {
    //   let title = titleElements.join('\\n');
    //   jsStringProperties.push(`title: "${title}"`);
    // }
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
