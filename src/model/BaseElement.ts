
export class BaseElement {
  
  public convertColorValue(colorValue: string) {
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
    return parseInt(Number('0x' + hex).toString(),10);
  }

}