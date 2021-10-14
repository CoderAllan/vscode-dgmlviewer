var fs = require('fs');
var parse = require('xml-parser');
import * as vscode from 'vscode';

import {
  Category,
  Edge,
  ICondition,
  IDirectedGraph,
  IPath,
  IProperty,
  ISetter,
  IStyle,
  IXmlNode,
  Node
} from '@model';
import { Config } from '@src';

export class DgmlParser {

  public parseDgmlFile(filename: string, config: Config): IDirectedGraph | undefined {
    const xml = fs.readFileSync(filename, 'utf8');
    const obj = parse(xml);
    if (obj.root.name.toLowerCase() !== 'directedgraph') {
      vscode.window.showErrorMessage(`The file is not a Directed Graph Markup Language file: ${filename}. The root element should be <DirectedGraph ...>`);
      return undefined;
    }
    const directedGraph: IDirectedGraph = {} as IDirectedGraph;
    // Create a dictionary with all keys in lowercase, because we don't know the casing of the dgml file
    const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(obj.root.attributes);
    directedGraph.background = attributesCopy['background'];
    directedGraph.backgroundImage = attributesCopy['backgroundImage'];
    directedGraph.butterflyMode = attributesCopy['butterflymode'] !== undefined ? attributesCopy['butterflymode'].toLowerCase() === 'true' : false;
    directedGraph.graphDirection = attributesCopy['graphdirection'];
    directedGraph.layout = attributesCopy['layout'];
    directedGraph.neighborhoodDistance = attributesCopy['neighborhooddistance'] !== undefined ? +attributesCopy['neighborhooddistance'] : -1;
    directedGraph.title = attributesCopy['title'];
    directedGraph.zoomLevel = attributesCopy['zoomlevel'] !== undefined ? +attributesCopy['zoomlevel'] : -1;
    if (obj.root.children !== undefined) {
      const children: IXmlNode[] = obj.root.children as IXmlNode[];
      children.forEach(xmlNode => {
        if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'nodes') {
          directedGraph.nodes = this.convertXmlToNodes(xmlNode.children, filename, config.showPopupsOverNodesAndEdges);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'links') {
          directedGraph.edges = this.convertXmlToEdges(xmlNode.children, config.showPopupsOverNodesAndEdges);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'categories') {
          directedGraph.categories = this.convertXmlToCategories(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'properties') {
          directedGraph.properties = this.convertXmlToProperties(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'styles') {
          directedGraph.styles = this.convertXmlToStyles(xmlNode.children);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'paths') {
          directedGraph.paths = this.convertXmlToPaths(xmlNode.children);
        }
      });
      this.addStylingToCategories(directedGraph);
      this.addCategoryStylingToNodes(directedGraph);
      this.addCategoryStylingToEdges(directedGraph);
      this.enrichNodes(directedGraph);
      this.enrichEdges(directedGraph);
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

  private convertXmlToNodes(xmlNodes: IXmlNode[], filename: string, showPopupsOverNodesAndEdges: boolean): Node[] {
    const nodes: Node[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const newNode = new Node(filename);
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          newNode.background = this.getAttributeValue(attributesCopy, 'background');
          newNode.category = this.getAttributeValue(attributesCopy, 'category');
          newNode.description = this.getAttributeValue(attributesCopy, 'description');
          newNode.filePath = this.getAttributeValue(attributesCopy, 'filepath');
          newNode.fontFamily = this.getAttributeValue(attributesCopy, 'fontfamily');
          const fontsize = this.getAttributeValue(attributesCopy, 'fontsize');
          newNode.fontSize = fontsize !== undefined ? +fontsize : undefined;
          newNode.fontStyle = this.getAttributeValue(attributesCopy, 'fontstyle');
          newNode.fontWeight = this.getAttributeValue(attributesCopy, 'fontweight');
          newNode.group = this.getAttributeValue(attributesCopy, 'group');
          newNode.horizontalAlignment = this.getAttributeValue(attributesCopy, 'horizontalalignment');
          newNode.icon = this.getAttributeValue(attributesCopy, 'icon');
          newNode.id = this.getAttributeValue(attributesCopy, 'id');
          const isVertical = this.getAttributeValue(attributesCopy, 'isvertical');
          newNode.isVertical = isVertical !== undefined ? isVertical === 'true' : undefined;
          newNode.label = this.getAttributeValue(attributesCopy, 'label');
          const maxWidth = this.getAttributeValue(attributesCopy, 'maxwidth');
          newNode.maxWidth = maxWidth !== undefined ? +maxWidth : undefined;
          const minWidth = this.getAttributeValue(attributesCopy, 'minwidth');
          newNode.minWidth = minWidth !== undefined ? +minWidth : undefined;
          const nodeRadius = this.getAttributeValue(attributesCopy, 'noderadius');
          newNode.nodeRadius = nodeRadius !== undefined ? +nodeRadius : undefined;
          newNode.reference = this.getAttributeValue(attributesCopy, 'reference');
          newNode.shape = this.getAttributeValue(attributesCopy, 'shape');
          newNode.showPopupsOverNodesAndEdges = showPopupsOverNodesAndEdges;
          newNode.stroke = this.getAttributeValue(attributesCopy, 'stroke');
          newNode.strokeDashArray = this.getAttributeValue(attributesCopy, 'strokedasharray');
          newNode.strokeThickness = this.getAttributeValue(attributesCopy, 'strokethickness');
          newNode.style = this.getAttributeValue(attributesCopy, 'style');
          newNode.verticalAlignment = this.getAttributeValue(attributesCopy, 'verticalalignment');
          newNode.visibility = this.getAttributeValue(attributesCopy, 'visibility');
          if (newNode.category === undefined) {
            newNode.category = this.createCategoryRef(xmlNode);
          }
          const boundsValue = this.getAttributeValue(attributesCopy, 'bounds');
          if (boundsValue !== undefined && boundsValue.indexOf(',') !== -1) {
            const bounds = boundsValue.split(',');
            newNode.boundsX = +bounds[0];
            newNode.boundsY = +bounds[1];
            newNode.boundsWidth = +bounds[2];
            newNode.boundsHeight = +bounds[3];
          }
          const customProperties = Object.keys(attributesCopy);
          if (customProperties.length > 0) {
            customProperties.forEach(property => {
              newNode.customProperties.push({ id: property, value: attributesCopy[property] });
            });
          }
          if (nodes.filter(n => n.id === newNode.id).length === 0) {
            nodes.push(newNode);
          }
        }
      });
    }
    return nodes;
  }

  private getAttributeValue(attributes: { [key: string]: string }, attributeName: string): string {
    const value = attributes[attributeName];
    delete attributes[attributeName];
    return value;
  }

  private convertXmlToEdges(xmlNodes: IXmlNode[], showPopupsOverNodesAndEdges: boolean): Edge[] {
    const edges: Edge[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newEdge = new Edge();
          newEdge.attractConsumers = attributesCopy['attractconsumers'] !== undefined ? attributesCopy['attractconsumers'].toLowerCase() === 'true' : undefined;
          newEdge.background = attributesCopy['background'];
          newEdge.category = attributesCopy['category'];
          newEdge.fontFamily = attributesCopy['fontfamily'];
          newEdge.fontSize = attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined;
          newEdge.fontStyle = attributesCopy['fontstyle'];
          newEdge.fontWeight = attributesCopy['fontweight'];
          newEdge.label = attributesCopy['label'];
          newEdge.seeder = attributesCopy['seeder'] !== undefined ? attributesCopy['seeder'] === 'true' : undefined;
          newEdge.showPopupsOverNodesAndEdges = showPopupsOverNodesAndEdges;
          newEdge.source = attributesCopy['source'];
          newEdge.stroke = attributesCopy['stroke'];
          newEdge.strokeDashArray = attributesCopy['strokedasharray'];
          newEdge.strokeThickness = attributesCopy['strokethickness'];
          newEdge.target = attributesCopy['target'];
          newEdge.visibility = attributesCopy['visibility'] !== undefined ? attributesCopy['visibility'].toLowerCase() === 'hidden' : false;
          if (newEdge.category === undefined) {
            newEdge.category = this.createCategoryRef(xmlNode);
          }
          const mutualEdges = edges.filter(l => l.target === newEdge.source && l.source === newEdge.target);
          if (mutualEdges.length > 0) {
            newEdge.mutualEdgeCount += 1;
            mutualEdges.forEach(l => l.mutualEdgeCount += 1);
          }
          edges.push(newEdge);
        }
      });
    }
    return edges;
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

  private convertXmlToCategories(xmlNodes: IXmlNode[]): Category[] {
    const categories: Category[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newCategory = new Category(attributesCopy['id']);
          newCategory.background = attributesCopy['background'];
          newCategory.basedOn = attributesCopy['basedon'];
          newCategory.canBeDataDriven = attributesCopy['canbedatadriven'];
          newCategory.canLinkedNodesBeDataDriven = attributesCopy['canlinkednodesbedatadriven'];
          newCategory.defaultAction = attributesCopy['defaultaction'];
          newCategory.details = attributesCopy['details'];
          newCategory.fontFamily = attributesCopy['fontfamily'];
          newCategory.fontSize = attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined;
          newCategory.fontStyle = attributesCopy['fontstyle'];
          newCategory.fontWeight = attributesCopy['fontweight'];
          newCategory.horizontalAlignment = attributesCopy['horizontalalignment'];
          newCategory.icon = attributesCopy['icon'];
          newCategory.inboundName = attributesCopy['inboundname'];
          newCategory.incomingActionLabel = attributesCopy['incomingactionlabel'];
          newCategory.isContainment = attributesCopy['iscontainment'] !== undefined ? attributesCopy['iscontainment'].toLowerCase() === 'true' : undefined;
          newCategory.isProviderRoot = attributesCopy['isproviderroot'] !== undefined ? attributesCopy['isproviderroot'].toLowerCase() === 'true' : undefined;
          newCategory.isTag = attributesCopy['istag'] !== undefined ? attributesCopy['istag'] === 'true' : undefined;
          newCategory.label = attributesCopy['label'];
          newCategory.maxWidth = attributesCopy['maxwidth'] !== undefined ? +attributesCopy['maxwidth'] : undefined;
          newCategory.minWidth = attributesCopy['minwidth'] !== undefined ? +attributesCopy['minwidth'] : undefined;
          newCategory.navigationActionLabel = attributesCopy['navigationactionlabel'];
          newCategory.nodeRadius = attributesCopy['noderadius'] !== undefined ? +attributesCopy['noderadius'] : undefined;
          newCategory.outboundName = attributesCopy['outboundname'];
          newCategory.outgoingActionLabel = attributesCopy['outgoingactionlabel'];
          newCategory.shape = attributesCopy['shape'];
          newCategory.sourceCategory = attributesCopy['sourcecategory'];
          newCategory.stroke = attributesCopy['stroke'];
          newCategory.strokeDashArray = attributesCopy['strokedasharray'];
          newCategory.strokeThickness = attributesCopy['strokethickness'];
          newCategory.style = attributesCopy['style'];
          newCategory.targetCategory = attributesCopy['targetcategory'];
          newCategory.verticalAlignment = attributesCopy['verticalalignment'];
          newCategory.visibility = attributesCopy['visibility'];
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
            isReference: attributesCopy['isreference'] !== undefined ? attributesCopy['isreference'].toLowerCase() === 'true' : undefined,
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
            condition: this.createCondition(xmlNode),
            groupLabel: attributesCopy['grouplabel'],
            isEnabled: attributesCopy['isenabled'] !== undefined ? attributesCopy['isenabled'].toLowerCase() === 'true' : undefined,
            setters: this.createSetter(xmlNode),
            targetType: attributesCopy['targettype'],
            toolTip: attributesCopy['tooltip'],
            valueLabel: attributesCopy['valuelabel']
          } as IStyle;
          styles.push(newProperty);
        }
      });
    }
    return styles;
  }

  private convertXmlToPaths(xmlNodes: IXmlNode[]): IPath[] {
    const paths: IPath[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newProperty = {
            id: attributesCopy['id'],
            value: attributesCopy['value'],
          } as IPath;
          paths.push(newProperty);
        }
      });
    }
    return paths;
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

  private createSetter(xmlNode: IXmlNode): ISetter[] | undefined {
    let setters: ISetter[] | undefined = undefined;
    if (xmlNode.children !== undefined) {
      xmlNode.children.forEach(childNode => {
        if (childNode.name.toLowerCase() === 'setter' && childNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(childNode.attributes);
          const newSetter = {
            expression: attributesCopy['expression'],
            property: attributesCopy['property'],
            value: attributesCopy['value']
          } as ISetter;
          if (!setters) {
            setters = [];
          }
          setters?.push(newSetter);
        }
      });
    }
    return setters;
  }

  private addCategoryStylingToNodes(directedGraph: IDirectedGraph): void {
    if (directedGraph.nodes !== undefined &&
      directedGraph.nodes.length > 0 &&
      directedGraph.categories !== undefined &&
      directedGraph.categories.length > 0) {
      directedGraph.nodes.forEach(node => {
        if (node.category !== undefined) {
          const category = directedGraph.categories.find(category => category.id.toLowerCase() === node.category?.toLowerCase() && (category.styleTargetType === undefined || category.styleTargetType.toLowerCase() === 'node'));
          node.setCategoryRef(category);
        }
      });
    }
  }

  private addCategoryStylingToEdges(directedGraph: IDirectedGraph): void {
    if (directedGraph.edges !== undefined &&
      directedGraph.edges.length > 0 &&
      directedGraph.categories !== undefined &&
      directedGraph.categories.length > 0) {
      directedGraph.edges.forEach(edge => {
        if (edge.category !== undefined) {
          const category = directedGraph.categories.find(category => category.id.toLowerCase() === edge.category?.toLowerCase() && (category.styleTargetType === undefined || category.styleTargetType.toLowerCase() === 'link'));
          edge.setCategoryRef(category);
        }
      });
    }
  }

  private addStylingToCategories(directedGraph: IDirectedGraph): void {
    if (directedGraph.categories !== undefined &&
      directedGraph.categories.length > 0 &&
      directedGraph.styles !== undefined &&
      directedGraph.styles.length > 0) {
      directedGraph.styles.forEach(style => {
        if (style.condition !== undefined &&
          style.condition.expression !== undefined &&
          style.setters !== undefined &&
          style.setters.length > 0) {
          const regex = /HasCategory\(['"](.+)['"]\)+/ig;
          const match = regex.exec(style.condition.expression);
          if (match) {
            const categoryName = match[1];
            let category = directedGraph.categories.find(category => category.id.toLowerCase() === categoryName.toLowerCase() && (category.styleTargetType === undefined || category.styleTargetType === style.targetType));
            if (!category) {
              category = new Category(categoryName);
              directedGraph.categories.push(category);
            }
            category.styleTargetType = style.targetType;
            category.setStyleRef(style);
          }
        }
      });
    }
  }

  private enrichNodes(directedGraph: IDirectedGraph): void {
    const containmentCategories = directedGraph.categories?.filter(category => category.isContainment).map(category => category.id);
    const containmentEdges = directedGraph.edges?.filter(edge => edge.category !== undefined && containmentCategories?.includes(edge.category));
    directedGraph.nodes?.forEach(node => {
      if (node.filePath !== undefined) {
        node.filePath = this.replacePaths(node.filePath, directedGraph);
      }
      if (node.customProperties !== undefined && node.customProperties.length > 0) {
        directedGraph.properties.forEach(property => {
          const existingPropertyIdx = node.customProperties.findIndex(nodeProperty => nodeProperty.id.toLowerCase() === property.id.toLowerCase());
          if (existingPropertyIdx !== -1) {
            Object.assign(node.customProperties[existingPropertyIdx], property);
            if (node.customProperties[existingPropertyIdx].isReference) {
              node.customProperties[existingPropertyIdx].value = this.replacePaths(node.customProperties[existingPropertyIdx].value, directedGraph);
            }
          }
        });
      }
      if (containmentEdges !== undefined && containmentEdges.length > 0) {
        const targetEdge = containmentEdges.find(edge => edge.target === node.id);
        if (targetEdge !== undefined) {
          node.parent = targetEdge.source;
          var parentNode = directedGraph.nodes.find(pNode => pNode.id === node.parent);
          if (parentNode) {
            parentNode.hasChildren = true;
          }
        }
      }
    });
  }

  private replacePaths(filePath: string | undefined, directedGraph: IDirectedGraph): string | undefined {
    let fixedFilepath = filePath;
    if (fixedFilepath !== undefined && directedGraph.paths !== undefined && directedGraph.paths.length > 0) {
      directedGraph.paths.forEach(path => {
        fixedFilepath = fixedFilepath?.replace(`$(${path.id})`, path.value);
      });
    }
    return fixedFilepath;
  }

  private enrichEdges(directedGraph: IDirectedGraph): void {
    const nodeLabelDict = Object.assign({}, ...directedGraph.nodes.map((node) => ({ [node.id]: node.label })));
    directedGraph.edges?.forEach(edge => {
      edge.sourceLabel = nodeLabelDict[edge.source];
      edge.targetLabel = nodeLabelDict[edge.target];
    });
  }
}