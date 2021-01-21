var fs = require('fs');
var parse = require('xml-parser');
import * as vscode from 'vscode';

import {
  ICategory,
  ICondition,
  IDirectedGraph,
  Link,
  Node,
  IProperty,
  ISetter,
  IStyle,
  IXmlNode
} from '@model';

export class DgmlParser {
  
  public parseDgmlFile(filename: string): IDirectedGraph | undefined {
    const xml = fs.readFileSync(filename, 'utf8');
    const obj = parse(xml);
    if (obj.root.name.toLowerCase() !== 'directedgraph') {
      vscode.window.showErrorMessage(`The file is not a Directed Graph Markup Language file: ${filename}. The root element should be <DirectedGraph ...>`);
      return undefined;
    }
    const directedGraph: IDirectedGraph = {} as IDirectedGraph;
    // Create a dictionary with all keys in lowercase, because we don't know the casing of the dgml file
    const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(obj.root.attributes);
    directedGraph.title = attributesCopy['title'];
    directedGraph.graphDirection = attributesCopy['graphdirection'];
    directedGraph.layout = attributesCopy['layout'];
    directedGraph.backgroundImage = attributesCopy['backgroundImage'];
    directedGraph.background = attributesCopy['background'];
    directedGraph.butterflyMode = attributesCopy['butterflymode'] !== undefined ? attributesCopy['butterflymode'].toLowerCase() === 'true' : false;
    directedGraph.neighborhoodDistance = attributesCopy['neighborhooddistance'] !== undefined ? +attributesCopy['neighborhooddistance'] : -1;
    directedGraph.zoomLevel = attributesCopy['zoomlevel'] !== undefined ? +attributesCopy['zoomlevel'] : -1;
    if (obj.root.children !== undefined) {
      const children: IXmlNode[] = obj.root.children as IXmlNode[];
      children.forEach(xmlNode => {
        if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'nodes') {
          directedGraph.nodes = this.convertXmlToNodes(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'links') {
          directedGraph.links = this.convertXmlToLinks(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'categories') {
          directedGraph.categories = this.convertXmlToCategories(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'properties') {
          directedGraph.properties = this.convertXmlToProperties(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'styles') {
          directedGraph.styles = this.convertXmlToStyles(xmlNode.children);
        }
      });
      this.addCategoryStylingToNodes(directedGraph);
      this.addCategoryStylingToLinks(directedGraph);
    }
    return directedGraph;
  }

  private toLowercaseDictionary(dict: { [key: string]: string }): { [key: string]: string } {
    const dictKeys = Object.keys(dict);
    let dictKeysCopy: { [key: string]: string } = {};
    let n = dictKeys.length;
    let key = '';
    while (n--) {
      key = dictKeys[n];
      dictKeysCopy[key.toLowerCase()] = dict[key];
    }
    return dictKeysCopy;
  }

  private convertXmlToNodes(xmlNodes: IXmlNode[]): Node[] {
    const nodes: Node[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newNode = new Node();
          newNode.id = attributesCopy['id'];
          newNode.category = attributesCopy['category'];
          newNode.description = attributesCopy['description'];
          newNode.reference = attributesCopy['reference'];
          newNode.isVertical = attributesCopy['isvertical'] !== undefined ? attributesCopy['isvertical'] === 'true' : undefined;
          newNode.group = attributesCopy['group'];
          newNode.label = attributesCopy['label'];
          newNode.visibility = attributesCopy['visibility'];
          newNode.background = attributesCopy['background'];
          newNode.fontSize = attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined;
          newNode.fontFamily = attributesCopy['fontfamily'];
          newNode.fontStyle = attributesCopy['fontstyle'];
          newNode.fontWeight = attributesCopy['fontweight'];
          newNode.stroke = attributesCopy['stroke'];
          newNode.strokeThickness = attributesCopy['strokethickness'];
          newNode.strokeDashArray = attributesCopy['strokedasharray'];
          newNode.icon = attributesCopy['icon'];
          newNode.shape = attributesCopy['shape'];
          newNode.style = attributesCopy['style'];
          newNode.horizontalAlignment = attributesCopy['horizontalalignment'];
          newNode.verticalAlignment = attributesCopy['verticalalignment'];
          newNode.minWidth = attributesCopy['minwidth'] !== undefined ? +attributesCopy['minwidth'] : undefined;
          newNode.maxWidth = attributesCopy['maxwidth'] !== undefined ? +attributesCopy['maxwidth'] : undefined;
          newNode.nodeRadius = attributesCopy['noderadius'] !== undefined ? +attributesCopy['noderadius'] : undefined;
          if (newNode.category === undefined) {
            newNode.category = this.createCategoryRef(xmlNode);
          }
          nodes.push(newNode);
        }
      });
    }
    return nodes;
  }

  private convertXmlToLinks(xmlNodes: IXmlNode[]): Link[] {
    const links: Link[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newLink = new Link();
          newLink.source = attributesCopy['source'];
          newLink.target = attributesCopy['target'];
          newLink.category = attributesCopy['category'];
          newLink.visibility = attributesCopy['visibility'] !== undefined ? attributesCopy['visibility'] === 'hidden' : false;
          newLink.background = attributesCopy['background'];
          newLink.fontSize = attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined;
          newLink.fontFamily = attributesCopy['fontfamily'];
          newLink.fontStyle = attributesCopy['fontstyle'];
          newLink.fontWeight = attributesCopy['fontweight'];
          newLink.stroke = attributesCopy['stroke'];
          newLink.strokeThickness = attributesCopy['strokethickness'];
          newLink.strokeDashArray = attributesCopy['strokedasharray'];
          newLink.seeder = attributesCopy['seeder'] !== undefined ? attributesCopy['seeder'] === 'true' : undefined;
          newLink.attractConsumers = attributesCopy['attractconsumers'] !== undefined ? attributesCopy['attractconsumers'] === 'true' : undefined;
          if (newLink.category === undefined) {
            newLink.category = this.createCategoryRef(xmlNode);
          }
          links.push(newLink);
        }
      });
    }
    return links;
  }

  private createCategoryRef(xmlNode: IXmlNode): string | undefined {
    let categoryRef: string | undefined = undefined;
    if (xmlNode.children !== undefined) {
      xmlNode.children.forEach(childNode => {
        if (childNode.name.toLowerCase() === 'category' && childNode.attributes !== undefined && categoryRef === undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(childNode.attributes);
          categoryRef = attributesCopy['ref'];
        }
      });
    }
    return categoryRef;
  }

  private convertXmlToCategories(xmlNodes: IXmlNode[]): ICategory[] {
    const categories: ICategory[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newCategory = {
            id: attributesCopy['id'],
            basedOn: attributesCopy['basedon'],
            canLinkedNodesBeDataDriven: attributesCopy['canlinkednodesbedatadriven'],
            canBeDataDriven: attributesCopy['canbedatadriven'],
            defaultAction: attributesCopy['defaultaction'],
            incomingActionLabel: attributesCopy['incomingactionlabel'],
            isProviderRoot: attributesCopy['isproviderroot'] !== undefined ? attributesCopy['isproviderroot'] === 'true' : undefined,
            isContainment: attributesCopy['iscontainment'] !== undefined ? attributesCopy['iscontainment'] === 'true' : undefined,
            isTag: attributesCopy['istag'] !== undefined ? attributesCopy['istag'] === 'true' : undefined,
            navigationActionLabel: attributesCopy['navigationactionlabel'],
            outgoingActionLabel: attributesCopy['outgoingactionlabel'],
            sourceCategory: attributesCopy['sourcecategory'],
            targetCategory: attributesCopy['targetcategory'],
            details: attributesCopy['details'],
            inboundName: attributesCopy['inboundname'],
            outboundName: attributesCopy['outboundname'],
            label: attributesCopy['label'],
            visibility: attributesCopy['visibility'],
            background: attributesCopy['background'],
            fontSize: attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined,
            fontFamily: attributesCopy['fontfamily'],
            fontStyle: attributesCopy['fontstyle'],
            fontWeight: attributesCopy['fontweight'],
            stroke: attributesCopy['stroke'],
            strokeThickness: attributesCopy['strokethickness'],
            strokeDashArray: attributesCopy['strokedasharray'],
            icon: attributesCopy['icon'],
            shape: attributesCopy['shape'],
            style: attributesCopy['style'],
            horizontalAlignment: attributesCopy['horizontalalignment'],
            verticalAlignment: attributesCopy['verticalalignment'],
            minWidth: attributesCopy['minwidth'] !== undefined ? +attributesCopy['minwidth'] : undefined,
            maxWidth: attributesCopy['maxwidth'] !== undefined ? +attributesCopy['maxwidth'] : undefined,
            nodeRadius: attributesCopy['noderadius'] !== undefined ? +attributesCopy['noderadius'] : undefined,
          } as ICategory;
          categories.push(newCategory);
        }
      });
    }
    return categories;
  }

  private convertXmlToProperties(xmlNodes: IXmlNode[]): IProperty[] {
    const properties: IProperty[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newProperty = {
            id: attributesCopy['id'],
            isReference: attributesCopy['isreference'] !== undefined ? attributesCopy['isreference'] === 'true' : undefined,
            label: attributesCopy['label'],
            dataType: attributesCopy['datatype'],
            description: attributesCopy['description'],
            group: attributesCopy['group'],
            referenceTemplate: attributesCopy['referencetemplate']
          } as IProperty;
          properties.push(newProperty);
        }
      });
    }
    return properties;
  }

  private convertXmlToStyles(xmlNodes: IXmlNode[]): IStyle[] {
    const styles: IStyle[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newProperty = {
            targetType: attributesCopy['targettype'],
            isEnabled: attributesCopy['isenabled'] !== undefined ? attributesCopy['isenabled'] === 'true' : undefined,
            groupLabel: attributesCopy['grouplabel'],
            valueLabel: attributesCopy['valuelabel'],
            toolTip: attributesCopy['tooltip'],
            condition: this.createCondition(xmlNode),
            setter: this.createSetter(xmlNode)
          } as IStyle;
          styles.push(newProperty);
        }
      });
    }
    return styles;
  }

  private createCondition(xmlNode: IXmlNode): ICondition | undefined {
    let condition: ICondition | undefined = undefined;
    if (xmlNode.children !== undefined) {
      xmlNode.children.forEach(childNode => {
        if (childNode.name.toLowerCase() === 'condition' && childNode.attributes !== undefined && condition === undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(childNode.attributes);
          const newCondition = {
            expression: attributesCopy['expression']
          } as ICondition;
          condition = newCondition;
        }
      });
    }
    return condition;
  }

  private createSetter(xmlNode: IXmlNode): ISetter | undefined {
    let setter: ISetter | undefined = undefined;
    if (xmlNode.children !== undefined) {
      xmlNode.children.forEach(childNode => {
        if (childNode.name.toLowerCase() === 'setter' && childNode.attributes !== undefined && setter === undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(childNode.attributes);
          const newSetter = {
            expression: attributesCopy['expression'],
            property: attributesCopy['property'],
            value: attributesCopy['value']
          } as ISetter;
          setter = newSetter;
        }
      });
    }
    return setter;
  }

  private addCategoryStylingToNodes(directedGraph: IDirectedGraph): void {
    if (directedGraph.nodes !== undefined &&
      directedGraph.nodes.length > 0 &&
      directedGraph.categories !== undefined &&
      directedGraph.categories.length > 0) {
      directedGraph.nodes.forEach(node => {
        if (node.category !== undefined) {
          const category = directedGraph.categories.find(category => category.id.toLowerCase() === node.category?.toLowerCase());
          node.setCategoryRef(category);
        }
      });
    }
  }

  private addCategoryStylingToLinks(directedGraph: IDirectedGraph): void {
    if (directedGraph.links !== undefined &&
      directedGraph.links.length > 0 &&
      directedGraph.categories !== undefined &&
      directedGraph.categories.length > 0) {
      directedGraph.links.forEach(link => {
        if (link.category !== undefined) {
          const category = directedGraph.categories.find(category => category.id.toLowerCase() === link.category?.toLowerCase());
          link.setCategoryRef(category);
        }
      });
    }
  }
}