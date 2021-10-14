import { Category } from "@model";

export class BaseElement {

  protected convertColorValue(colorValue: string) {
    const regex = /#(\w{2})(\w{2})(\w{2})(\w{2})/i;
    const match = regex.exec(colorValue);
    if (match) {
      let a = this.toNum(match[1]);
      a = a / 255;
      return `rgba(${this.toNum(match[2])}, ${this.toNum(match[3])}, ${this.toNum(match[4])}, ${a})`;
    } else {
      return colorValue;
    }
  }
  private toNum(hex: string): number {
    return parseInt(Number('0x' + hex).toString(), 10);
  }


  protected pushValueStyling(
    propertyValue: string | number | undefined,
    categoryRef: Category | undefined,
    categoryProperty: string | number | undefined,
    targetType: string,
    setterProperty: string,
    jsStringProperties: string[],
    jsProperty: string,
    defaultValue: string) {
    if (propertyValue !== undefined) {
      jsStringProperties.push(`${jsProperty}: '${propertyValue}'`);
    }
    else {
      if (categoryRef !== undefined &&
        categoryRef?.styleRef !== undefined &&
        categoryRef?.styleRef.targetType !== undefined &&
        categoryRef?.styleRef.targetType.toLowerCase() === targetType) {
        const styleValue = categoryRef?.styleRef.setters.find(setter => setter.property.toLowerCase() === setterProperty);
        if (styleValue !== undefined) {
          jsStringProperties.push(`${jsProperty}: '${styleValue.value}'`);
        }
        else {
          if (categoryRef !== undefined &&
            categoryProperty !== undefined) {
            jsStringProperties.push(`${jsProperty}: '${categoryProperty}'`);
          }
          else {
            jsStringProperties.push(`${jsProperty}: '${defaultValue}'`);
          }
        }
      }
      else {
        jsStringProperties.push(`${jsProperty}: '${defaultValue}'`);
      }
    }
  }

  protected pushColorStyling(
    propertyValue: string | number | undefined,
    categoryRef: Category | undefined,
    categoryProperty: string | number | undefined,
    targetType: string,
    setterProperty: string,
    jsStringProperties: string[],
    jsProperty: string,
    defaultValue: string,
    valuePostFix: string = '',
    defaultValuePostFix: string = '') {
    if (propertyValue !== undefined) {
      jsStringProperties.push(`${jsProperty}: '${propertyValue}'`);
    }
    else {
      if (categoryRef !== undefined &&
        categoryRef?.styleRef !== undefined &&
        categoryRef?.styleRef.targetType !== undefined &&
        categoryRef?.styleRef.targetType.toLowerCase() === targetType) {
        const styleColor = categoryRef?.styleRef.setters.find(setter => setter.property.toLowerCase() === setterProperty);
        if (styleColor !== undefined) {
          jsStringProperties.push(`${jsProperty}: '${this.convertColorValue(styleColor.value)}'${valuePostFix}`);
        }
        else {
          if (categoryRef !== undefined &&
            categoryProperty !== undefined) {
            jsStringProperties.push(`${jsProperty}: '${this.convertColorValue(categoryProperty as string)}'${valuePostFix}`);
          }
          else {
            jsStringProperties.push(`${jsProperty}: '${this.convertColorValue(defaultValue)}'${defaultValuePostFix}`);
          }
        }
      }
      else {
        jsStringProperties.push(`${jsProperty}: '${this.convertColorValue(defaultValue)}'${defaultValuePostFix}`);
      }
    }
  }

  protected pushDashArrayStyling(
    propertyValue: string | number | undefined,
    categoryRef: Category | undefined,
    categoryProperty: string | number | undefined,
    targetType: string,
    jsStringProperties: string[],
    jsProperty: string) {
    if (propertyValue !== undefined) {
      jsStringProperties.push(`${jsProperty}: 'dashed'`);
    }
    else {
      if (categoryRef !== undefined &&
        categoryRef?.styleRef !== undefined &&
        categoryRef?.styleRef.targetType !== undefined &&
        categoryRef?.styleRef.targetType.toLowerCase() === targetType) {
        const dashed = categoryRef?.styleRef.setters.find(setter => setter.property.toLowerCase() === 'strokedasharray');
        if (dashed !== undefined) {
          jsStringProperties.push(`${jsProperty}: 'dashed'`);
        }
        else {
          if (categoryRef !== undefined &&
            categoryProperty !== undefined) {
            jsStringProperties.push(`${jsProperty}: 'dashed'`);
          }
          else {
            jsStringProperties.push(`${jsProperty}: 'solid'`);
          }
        }
      }
      else {
        jsStringProperties.push(`${jsProperty}: 'solid'`);
      }
    }
  }
}