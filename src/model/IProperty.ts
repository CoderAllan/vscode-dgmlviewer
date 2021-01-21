// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export interface IProperty {
  id: string;
  isReference: boolean;
  label: string;
  dataType: string;
  description: string;
  group: string;
  referenceTemplate: string;
}