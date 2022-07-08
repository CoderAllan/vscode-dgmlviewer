# Change Log

## Version 2.2.4

- Bugfix: Removing illegal character from the dgml file before parsing it.
- Showing a graceful error message if the parsing of the dgml file fails.

## Version 2.2.3

- Maintenance: Bump packages to latest

## Version 2.2.2

- Bugfix: Style is now set correctly depending on style targettype
- Bugfix: Category label is now shown correctly when hovering above an edge in the graph
- Bugfix: Fixed bug in package.py
- Removed redundant logging.

## Version 2.2.1

- Bugfix: When no bounds are specified for any node it is now possible to change layout correctly

## Version 2.2.0

- If no nodes has a position/bounds defined then the layout of the graph is changed to 'cose'
- Bugfix: Can now render graphs without categories correctly.
- Bugfix: Styling now respects the TargetType property of the Style tags.
- Fixed various linting errors and warnings

## Version 2.1.0

- It is now possible to save the graph as Png, Jpg, Svg and as Json.
- Added Refresh button to re-layout the graph when the chosen layout is either Cose or Random.

## Version 2.0.0

- The core Javascript library used for rendering the directed graph has been changed from Vis.js to Cytoscape.js. The change was done because Cytoscape.js can render nested nodes which Vis.js was not capable of.

## Version 1.3.4

- Maintenance: Bump packages to latest

## Version 1.3.3

- Bugfix: When edges have the same source and target the edges no longer overlap.

## Version 1.3.2

- When the mouse pointer is hovering over a node or an edge a popup is shown with various information about the node or edge.
- Bugfix: Settings are now read correctly and the values are used when rendering the graph.

## Version 1.3.1

- Paths are now parsed from the dgml file and substituted into the reference properties.
- The FilePath attribute on a node is now parsed and used as a reference property.

## Version 1.3.0

- If nodes contain attributes that are defined as a reference property the node is now clickable and will open the referenced file in vscode.
- Bugfix: Styling is now applied correctly for styles without a defined category

## Version 1.2.1

- Bugfix: The GraphDirection attribute is now used correctly when rendering the graph.
- Bugfix: It is now possible to moved nodes when Fixed direction is used.

## Version 1.2.0

- The width and height from the bounds-attribute on the nodes are now used if the attribute is present.
- Improved the layout to better avoid overlapping nodes.
- Styling from the styles nodes are node applied to the nodes and edges.
- Bugfix: Nodes and edges was not colored correctly when the background tag used the format #aarrggbb.
- Bugfix: Label on edges are now rendered correctly.

## Version 1.1.0

- New layout: Fixed. If the nodes in the dgml file has bounds-attributes then the nodes are laid out using these coordinates.
- Bugfix: The parsing of the dgml file no longer fails if the dgml file contains multiple nodes with the same id.
- Bugfix: If the nodes in the dgml file does not have a label attribute, then the id attribute value is used for the graph label.

- ## Version 1.0.4

- Newlines in label and description are now rendered correctly.

## Version 1.0.3

- Now using webpack to reduce size of extension.

## Version 1.0.2

- Improved the layout of the graph when no graph direction is specified in the dgml file.

## Version 1.0.1

- Updated package references.
- Added keywords to package.json

## Version 1.0.0

- Initial release
