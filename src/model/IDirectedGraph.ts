import {
  ICategory,
  Link,
  IProperty,
  IStyle,
  Node
} from '@model';

// https://schemas.microsoft.com/vs/2009/dgml/dgml.xsd
export interface IDirectedGraph {
  title: string;
  background: string;
  backgroundImage: string;
  graphDirection: string;
  layout: string;
  butterflyMode: boolean;
  neighborhoodDistance: number;
  zoomLevel: number;

  nodes: Node[];
  links: Link[];
  categories: ICategory[];
  properties: IProperty[];
  styles: IStyle[];
}
