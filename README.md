# DGMLViewer - Visual Studio Code extension

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/coderAllan.vscode-dgmlviewer) ![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/coderAllan.vscode-dgmlviewer) ![GitHub top language](https://img.shields.io/github/languages/top/CoderAllan/vscode-dgmlviewer.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/CoderAllan/vscode-dgmlviewer.svg) ![GitHub](https://img.shields.io/github/license/CoderAllan/vscode-dgmlviewer.svg)

The [Directed Graph Markup Language (dgml)](https://en.wikipedia.org/wiki/DGML) can be used to visualize things like processes, hierarchies, flows and many other things.

This extension for Visual Studio Code can be used to render a *.dgml file into a graphical representation of the graph. Find it on the [Visual Studio Code marketplace](https://marketplace.visualstudio.com/items?itemName=coderAllan.vscode-dgmlviewer).

## Visualize DGML files

To visualize a dgml file in Visual Studio Code you click on the file to open it, then you select the "DGMLViewer: Render the dgml graph" command from the command pallette to render the graph.

When the dgml file has been rendered you can save the representation as a Png, Jpg or Svg image file or save the internal Cytoscape json object if you need to extract data from the graph.

![DGML save graph to a Png, Jpg, Svg or Json file](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_save.gif)

You can also choose to only save part of the graph. You do this by clicking the 'Save selection as png' button, then right-click and drag to select the area you want to save. The selection is saved when you let go of the mouse button.

![DGML save selection to Png file](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_saveSelection.gif)

In a DirectedGraph file you can [link a node to  an external file](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/modeling/customize-code-maps-by-editing-the-dgml-files?view=vs-2015#to-link-a-document-or-url-to-a-code-element"). DGMLViewer will determine if the file is accessible on the disk and if it is then the node is clickable and will open the file in vscode when the node is clicked.

![DGML click on a node](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_clickOnNodes.gif)

You can change the rendered layout of the directed graph by clicking the 'Change layout' checkbox and the choose a layout in the dropdown box. It will not change the dgml file itself, it will only change the rendering of the graph.

![DGML change layout](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_changeLayout.gif)

## Show information about the DGML file

The file-info command of the extension shows some metadata about the dgml file:

![DGML file info](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_fileinfo.gif)

## Extension Settings

In the Visual Studio Code settings you find under File --> Preferences --> Settings, under Extensions, there is a section with all the settings for DGMLViewer. It is possible to change the default filenames used when the extension saves a file to the workspace folder. You can change how the graph nodes are rendered, the edge endings, the color of the root nodes and more.

See the full list of settings below the screenshot.

![DGMLViewer settings](https://github.com/CoderAllan/vscode-dgmlviewer/raw/main/images/dgmlViewer_settings.gif)

| Setting | Description |
| --- | --- |
| dgmlViewer.defaultNodeBackgroundColor | The color of the nodes of the directed graph. The string should be in rgb format. |
| dgmlViewer.edgeArrowToType | The default ending of the edges. |
| dgmlViewer.nodeShape | The shape of the nodes in the directed graph. Notice that 'ellipse','circle','database','box' and 'text' have the label inside the shape, the rest have the label outside the shape. |
| dgmlViewer.graphSelectionGuidelineColor | The color of the guidelines used when selecting part of a directed graph. The string should be in rgba format or standard css color names. |
| dgmlViewer.graphSelectionGuidelineWidth | The width of the guide lines shown when selecting part of a directed graph |
| dgmlViewer.graphSelectionColor | The color of the selection rectangle used when selecting part of a directed graph. The string should be in rgba format or standard css color names. |
| dgmlViewer.graphSelectionWidth | The width of the selection rectangle shown when selecting part of a directed graph. |
| dgmlViewer.saveAsFilename | The default name used when saving the directed graph as a Png, Jpg, Svg or Json file. |
| dgmlViewer.showPopupsOverNodesAndLinks | When the setting is set to true a popup with various information from node or edge will be shown when the mouse pointer hovers over nodes and edges. |

## Known Issues

The [Directed Graph Markup Language (dgml)](https://en.wikipedia.org/wiki/DGML) has the ability to specify conditional rendering of the graph. This is done by using the Style elements in the specification. In the current version of this DGMLViewer extension for Visual Studio code this conditional rendering is very limited. Only the 'HasCategory(...)' condition is evaluated.

## Third party components and resources

* [Cytoscape.js](https://js.cytoscape.org/) - Used for rendering the directed graph.
* Icons are from [Icon8](https://icons8.com/)
