
export interface IXmlNode {
  name: string;
  attributes: { [key: string]: string };
  children: IXmlNode[];
}