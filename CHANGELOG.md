# Change Log

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
