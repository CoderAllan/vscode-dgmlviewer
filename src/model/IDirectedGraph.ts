import {
  ICategory,
  IPath,
  IProperty,
  IStyle,
  Edge,
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
  edges: Edge[];
  categories: ICategory[];
  properties: IProperty[];
  styles: IStyle[];
  paths: IPath[];
}
