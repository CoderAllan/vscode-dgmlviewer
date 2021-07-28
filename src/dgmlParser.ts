var fs = require('fs');
var parse = require('xml-parser');
import * as vscode from 'vscode';

import {
  ICategory,
  ICondition,
  IDirectedGraph,
  IPath,
  IProperty,
  ISetter,
  IStyle,
  IXmlNode,
  Link,
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
          directedGraph.nodes = this.convertXmlToNodes(xmlNode.children, filename, config.showPopupsOverNodesAndLinks);
        } else if (xmlNode.name !== undefined && xmlNode.name.toLowerCase() === 'links') {
          directedGraph.links = this.convertXmlToLinks(xmlNode.children, config.showPopupsOverNodesAndLinks);
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
      this.addCategoryStylingToLinks(directedGraph);
      this.enrichNodes(directedGraph);
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

  private convertXmlToNodes(xmlNodes: IXmlNode[], filename: string, showPopupsOverNodesAndLinks: boolean): Node[] {
    const nodes: Node[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const newNode = new Node(filename);
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          newNode.id = this.getAttributeValue(attributesCopy, 'id');
          newNode.showPopupsOverNodesAndLinks = showPopupsOverNodesAndLinks;
          newNode.category = this.getAttributeValue(attributesCopy, 'category');
          newNode.description = this.getAttributeValue(attributesCopy, 'description');
          newNode.reference = this.getAttributeValue(attributesCopy, 'reference');
          const isVertical = this.getAttributeValue(attributesCopy, 'isvertical');
          newNode.isVertical = isVertical !== undefined ? isVertical === 'true' : undefined;
          newNode.group = this.getAttributeValue(attributesCopy, 'group');
          newNode.label = this.getAttributeValue(attributesCopy, 'label');
          newNode.visibility = this.getAttributeValue(attributesCopy, 'visibility');
          newNode.background = this.getAttributeValue(attributesCopy, 'background');
          const fontsize = this.getAttributeValue(attributesCopy, 'fontsize');
          newNode.fontSize = fontsize !== undefined ? +fontsize : undefined;
          newNode.fontFamily = this.getAttributeValue(attributesCopy, 'fontfamily');
          newNode.fontStyle = this.getAttributeValue(attributesCopy, 'fontstyle');
          newNode.fontWeight = this.getAttributeValue(attributesCopy, 'fontweight');
          newNode.stroke = this.getAttributeValue(attributesCopy, 'stroke');
          newNode.strokeThickness = this.getAttributeValue(attributesCopy, 'strokethickness');
          newNode.strokeDashArray = this.getAttributeValue(attributesCopy, 'strokedasharray');
          newNode.icon = this.getAttributeValue(attributesCopy, 'icon');
          newNode.shape = this.getAttributeValue(attributesCopy, 'shape');
          newNode.style = this.getAttributeValue(attributesCopy, 'style');
          newNode.horizontalAlignment = this.getAttributeValue(attributesCopy, 'horizontalalignment');
          newNode.verticalAlignment = this.getAttributeValue(attributesCopy, 'verticalalignment');
          newNode.filePath = this.getAttributeValue(attributesCopy, 'filepath');
          const minWidth = this.getAttributeValue(attributesCopy, 'minwidth');
          newNode.minWidth = minWidth !== undefined ? +minWidth : undefined;
          const maxWidth = this.getAttributeValue(attributesCopy, 'maxwidth');
          newNode.maxWidth = maxWidth !== undefined ? +maxWidth : undefined;
          const nodeRadius = this.getAttributeValue(attributesCopy, 'noderadius');
          newNode.nodeRadius = nodeRadius !== undefined ? +nodeRadius : undefined;
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

  private convertXmlToLinks(xmlNodes: IXmlNode[], showPopupsOverNodesAndLinks: boolean): Link[] {
    const links: Link[] = [];
    if (xmlNodes.length > 0) {
      xmlNodes.forEach(xmlNode => {
        if (xmlNode.attributes !== undefined) {
          const attributesCopy: { [key: string]: string } = this.toLowercaseDictionary(xmlNode.attributes);
          const newLink = new Link();
          newLink.showPopupsOverNodesAndLinks = showPopupsOverNodesAndLinks;
          newLink.source = attributesCopy['source'];
          newLink.target = attributesCopy['target'];
          newLink.label = attributesCopy['label'];
          newLink.category = attributesCopy['category'];
          newLink.visibility = attributesCopy['visibility'] !== undefined ? attributesCopy['visibility'].toLowerCase() === 'hidden' : false;
          newLink.background = attributesCopy['background'];
          newLink.fontSize = attributesCopy['fontsize'] !== undefined ? +attributesCopy['fontsize'] : undefined;
          newLink.fontFamily = attributesCopy['fontfamily'];
          newLink.fontStyle = attributesCopy['fontstyle'];
          newLink.fontWeight = attributesCopy['fontweight'];
          newLink.stroke = attributesCopy['stroke'];
          newLink.strokeThickness = attributesCopy['strokethickness'];
          newLink.strokeDashArray = attributesCopy['strokedasharray'];
          newLink.seeder = attributesCopy['seeder'] !== undefined ? attributesCopy['seeder'] === 'true' : undefined;
          newLink.attractConsumers = attributesCopy['attractconsumers'] !== undefined ? attributesCopy['attractconsumers'].toLowerCase() === 'true' : undefined;
          if (newLink.category === undefined) {
            newLink.category = this.createCategoryRef(xmlNode);
          }
          const mutualLinks = links.filter(l => l.target === newLink.source && l.source === newLink.target);
          if (mutualLinks.length > 0) {
            newLink.mutualLinkCount += 1;
            mutualLinks.forEach(l => l.mutualLinkCount += 1 );
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
            isProviderRoot: attributesCopy['isproviderroot'] !== undefined ? attributesCopy['isproviderroot'].toLowerCase() === 'true' : undefined,
            isContainment: attributesCopy['iscontainment'] !== undefined ? attributesCopy['iscontainment'].toLowerCase() === 'true' : undefined,
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
            targetType: attributesCopy['targettype'],
            isEnabled: attributesCopy['isenabled'] !== undefined ? attributesCopy['isenabled'].toLowerCase() === 'true' : undefined,
            groupLabel: attributesCopy['grouplabel'],
            valueLabel: attributesCopy['valuelabel'],
            toolTip: attributesCopy['tooltip'],
            condition: this.createCondition(xmlNode),
            setters: this.createSetter(xmlNode)
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
            let category = directedGraph.categories.find(category => category.id.toLowerCase() === categoryName.toLowerCase());
            if (!category) {
              category = { id: categoryName };
              directedGraph.categories.push(category);
            }
            style.setters.forEach(setter => {
              if (category && setter.property !== undefined) {
                if (setter.property.toLowerCase() === 'stroke') {
                  category.stroke = setter.value;
                }
                if (setter.property.toLowerCase() === 'strokethickness') {
                  category.strokeThickness = setter.value;
                }
                if (setter.property.toLowerCase() === 'strokedasharray') {
                  category.strokeDashArray = setter.value;
                }
                if (setter.property.toLowerCase() === 'strokedasharray') {
                  category.strokeDashArray = setter.value;
                }
                if (setter.property.toLowerCase() === 'fontfamily') {
                  category.fontFamily = setter.value;
                }
                if (setter.property.toLowerCase() === 'fontsize') {
                  category.fontSize = +setter.value;
                }
                if (setter.property.toLowerCase() === 'fontstyle') {
                  category.fontStyle = setter.value;
                }
                if (setter.property.toLowerCase() === 'fontweight') {
                  category.fontWeight = setter.value;
                }
                if (setter.property.toLowerCase() === 'background') {
                  category.background = setter.value;
                }
                if (setter.property.toLowerCase() === 'horizontalalignment') {
                  category.horizontalAlignment = setter.value;
                }
                if (setter.property.toLowerCase() === 'verticalalignment') {
                  category.verticalAlignment = setter.value;
                }
                if (setter.property.toLowerCase() === 'minwidth') {
                  category.minWidth = +setter.value;
                }
                if (setter.property.toLowerCase() === 'maxwidth') {
                  category.maxWidth = +setter.value;
                }
              }
            });
          }
        }
      });
    }
  }

  private enrichNodes(directedGraph: IDirectedGraph): void {
    const containmentCategories = directedGraph.categories.filter(category=> category.isContainment).map(category => category.id);
    const containmentLinks = directedGraph.links.filter(link => link.category !== undefined && containmentCategories.includes(link.category));
    directedGraph.nodes.forEach(node => {
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
      if(containmentLinks.length > 0) {
        const targetLink = containmentLinks.find(link => link.target === node.id);
        if(targetLink !== undefined) {
          node.parent = targetLink.source;
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
        fixedFilepath = fixedFilepath?.replace(`\$(${path.id})`, path.value);
      });
    }
    return fixedFilepath;
  }
}