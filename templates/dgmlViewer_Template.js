(function () {

  var nodeElements = [];
  var edgeElements = [];
  var nodeCoordinates = [];
  const edgeArrowType = 'triangle'; // edge arrow to type
  const defaultZoom = 1.25;

  const defaultLayout = ''; // The graph layout from the dgml file itself
  const cyContainerDiv = document.getElementById('cy');
  const txtCanvas = document.createElement('canvas');
  const txtCtx = txtCanvas.getContext('2d');
  const layoutDiv = document.getElementById('layoutDiv');
  const showLayoutOptionsCheckbox = document.getElementById('showLayoutOptions');
  const layoutSelect = document.getElementById('layout');
  const saveAsPngButton = document.getElementById('saveAsPngButton');
  const saveSelectionAsPngButton = document.getElementById('saveSelectionAsPngButton');
  const selectionLayer = document.getElementById('selectionLayer');
  const helpTextDiv = document.getElementById('helpText');
  showHierarchicalOptions();

  const vscode = acquireVsCodeApi();
  let lastMouseX = lastMouseY = 0;
  let mouseX = mouseY = 0;
  let selection;
  // get the vis.js canvas
  var visDiv = cyContainerDiv.firstElementChild;
  var graphCanvas = visDiv.firstElementChild;
  const selectionCanvas = selectionLayer.firstElementChild;
  let selectionCanvasContext;

  // add button event listeners
  saveAsPngButton.addEventListener('click', saveAsPng);
  saveSelectionAsPngButton.addEventListener('click', saveSelectionAsPng);
  showLayoutOptionsCheckbox.addEventListener('click', showHierarchicalOptions);
  layoutSelect.addEventListener('change', setNetworkLayout);

  function mouseUpEventListener(event) {
    // Convert the canvas to image data that can be saved
    const aspectRatioX = graphCanvas.width / selectionCanvas.width;
    const aspectRatioY = graphCanvas.height / selectionCanvas.height;
    const finalSelectionCanvas = document.createElement('canvas');
    finalSelectionCanvas.width = selection.width;
    finalSelectionCanvas.height = selection.height;
    const finalSelectionCanvasContext = finalSelectionCanvas.getContext('2d');
    finalSelectionCanvasContext.drawImage(graphCanvas, selection.top * aspectRatioX, selection.left * aspectRatioY, selection.width * aspectRatioX, selection.height * aspectRatioY, 0, 0, selection.width, selection.height);

    // Call back to the extension context to save the selected image to the workspace folder.
    vscode.postMessage({
      command: 'saveAsPng',
      text: finalSelectionCanvas.toDataURL()
    });
    // Remove the temporary canvas
    finalSelectionCanvas.remove();
    // Reset the state variables
    selectionCanvasContext = undefined;
    selection = {};
    // hide the help text
    helpTextDiv.style['display'] = 'none';
    // hide selection layer and remove event listeners
    selectionLayer.removeEventListener('mouseup', mouseUpEventListener);
    selectionLayer.removeEventListener('mousedown', mouseDownEventListener);
    selectionLayer.removeEventListener('mousemove', mouseMoveEventListener);
    selectionLayer.style['display'] = 'none';
  }

  function mouseDownEventListener(event) {
    lastMouseX = parseInt(event.clientX - selectionCanvas.offsetLeft);
    lastMouseY = parseInt(event.clientY - selectionCanvas.offsetTop);
    selectionCanvasContext = selectionCanvas.getContext("2d");
  }

  function drawGuideLine(ctx, mouseX, mouseY) {
    ctx.beginPath();
    ctx.setLineDash([3, 7]);
    if (mouseX > -1) {
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, selectionCanvas.height);
    } else if (mouseY > -1) {
      ctx.moveTo(0, mouseY);
      ctx.lineTo(selectionCanvas.width, mouseY);
    }
    ctx.strokeStyle = 'blue'; // graph selection guideline color
    ctx.lineWidth = 1; // graph selection guideline width
    ctx.stroke();
  }

  function showGuideLines() {
    var tmpSelectionCanvasContext = selectionCanvas.getContext("2d");
    tmpSelectionCanvasContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    drawGuideLine(tmpSelectionCanvasContext, mouseX, -1);
    drawGuideLine(tmpSelectionCanvasContext, -1, mouseY);
  }

  function mouseMoveEventListener(event) {
    mouseX = parseInt(event.clientX - selectionCanvas.offsetLeft);
    mouseY = parseInt(event.clientY - selectionCanvas.offsetTop);
    showGuideLines();
    if (selectionCanvasContext != undefined) {
      selectionCanvasContext.beginPath();
      selectionCanvasContext.setLineDash([]);
      const width = mouseX - lastMouseX;
      const height = mouseY - lastMouseY;
      selectionCanvasContext.rect(lastMouseX, lastMouseY, width, height);
      selection = { // Save the current position and size to be used when the mouseup event is fired
        'top': lastMouseX,
        'left': lastMouseY,
        'height': height,
        'width': width
      };
      selectionCanvasContext.strokeStyle = 'red';
      selectionCanvasContext.lineWidth = 2;
      selectionCanvasContext.stroke();
    }
  }

  function saveSelectionAsPng() {
    visDiv = graphDiv.firstElementChild;
    graphCanvas = visDiv.firstElementChild;

    // show the help text
    helpTextDiv.style['display'] = 'block';

    // show the selection layer
    selectionLayer.style['display'] = 'block';

    // make sure the selection canvas covers the whole screen
    selectionCanvas.width = window.innerWidth;
    selectionCanvas.height = window.innerHeight;
    // reset the current context and selection
    selectionCanvasContext = undefined;
    selection = {};

    selectionLayer.addEventListener("mouseup", mouseUpEventListener, true);
    selectionLayer.addEventListener("mousedown", mouseDownEventListener, true);
    selectionLayer.addEventListener("mousemove", mouseMoveEventListener, true);
  }

  function openFileInVsCode(filepath) {
    vscode.postMessage({
      command: 'openFile',
      text: filepath
    });
  }

  function saveAsPng() {
    visDiv = graphDiv.firstElementChild;
    graphCanvas = visDiv.firstElementChild;

    // Calculate the bounding box of all the elements on the canvas
    const boundingBox = getBoundingBox();

    // copy the imagedata within the bounding box
    const finalSelectionCanvas = document.createElement('canvas');
    finalSelectionCanvas.width = boundingBox.width;
    finalSelectionCanvas.height = boundingBox.height;
    const finalSelectionCanvasContext = finalSelectionCanvas.getContext('2d');
    finalSelectionCanvasContext.drawImage(graphCanvas, boundingBox.top, boundingBox.left, boundingBox.width, boundingBox.height, 0, 0, boundingBox.width, boundingBox.height);

    // Call back to the extension context to save the image of the graph to the workspace folder.
    vscode.postMessage({
      command: 'saveAsPng',
      text: finalSelectionCanvas.toDataURL()
    });

    // Remove the temporary canvas
    finalSelectionCanvas.remove();
  }

  function getBoundingBox() {
    var ctx = graphCanvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, graphCanvas.width, graphCanvas.height);
    var bytesPerPixels = 4;
    var cWidth = graphCanvas.width * bytesPerPixels;
    var cHeight = graphCanvas.height;
    var minY = minX = maxY = maxX = -1;
    for (var y = cHeight; y > 0 && maxY === -1; y--) {
      for (var x = 0; x < cWidth; x += bytesPerPixels) {
        var arrayPos = x + y * cWidth;
        if (imgData.data[arrayPos + 3] > 0 && maxY === -1) {
          maxY = y;
          break;
        }
      }
    }
    for (var x = cWidth; x >= 0 && maxX === -1; x -= bytesPerPixels) {
      for (var y = 0; y < maxY; y++) {
        var arrayPos = x + y * cWidth;
        if (imgData.data[arrayPos + 3] > 0 && maxX === -1) {
          maxX = x / bytesPerPixels;
          break;
        }
      }
    }
    for (var x = 0; x < maxX * bytesPerPixels && minX === -1; x += bytesPerPixels) {
      for (var y = 0; y < maxY; y++) {
        var arrayPos = x + y * cWidth;
        if (imgData.data[arrayPos + 3] > 0 && minX === -1) {
          minX = x / bytesPerPixels;
          break;
        }
      }
    }
    for (var y = 0; y < maxY && minY === -1; y++) {
      for (var x = minX * bytesPerPixels; x < maxX * bytesPerPixels; x += bytesPerPixels) {
        var arrayPos = x + y * cWidth;
        if (imgData.data[arrayPos + 3] > 0 && minY === -1) {
          minY = y;
          break;
        }
      }
    }
    return {
      'top': minX,
      'left': minY,
      'width': maxX - minX,
      'height': maxY - minY
    };
  }

  function showHierarchicalOptions() {
    setDefaultLayout();
    setNetworkLayout();
  }

  function setDefaultLayout() {
    let selectedOption = '';
    selectedOption = defaultLayout === '' ? 'preset' : defaultLayout;
    for (var i, j = 0; i = layoutSelect.options[j]; j++) {
      if (i.value === selectedOption) {
        layoutSelect.selectedIndex = j;
        break;
      }
    }
  }


  function storeCoordinates(cy) {
    cy.elements().forEach(ele => {
      if (ele.isNode() && ele.position('x') !== 0 && ele.position('y') !== 0) {
        nodeCoordinates[ele.id()] = {
          'x': ele.position('x'),
          'y': ele.position('y')
        };
      }
    });
  }

  function restoreCoordinates(cy) {
    cy.elements().forEach(ele => {
      if (ele.isNode() && ele.id() in nodeCoordinates) {
        var nodeCoords = nodeCoordinates[ele.id()];
        ele.position(nodeCoords);
      }
    });
  }

  function calculateLabelWidths() {
    nodeElements.forEach(node => {
      if (node.data.label && node.data.label.length > 0) {
        node.data.width = txtCtx.measureText(node.data.label).width * 1.75; // Don't know why, but the width of node has to be about 75% bigger than the width of the label text.
      }
    });
  }

  function setNetworkLayout() {
    calculateLabelWidths();
    var cy = cytoscape({
      container: cyContainerDiv,

      style: [{
          selector: 'node',
          style: {
            'width': 'data(width)',
            'label': 'data(label)',
            'text-valign': 'center',
            'color': "white",
            'shape': 'round-rectangle',
            'background-color': 'data(background)',
            'border-style': 'data(borderStyle)',
            'border-width': 'data(borderWidth)',
            'border-color': 'data(borderColor)',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(width)',
            'line-color': 'data(color)',
            'curve-style': 'bezier',
            'target-arrow-shape': edgeArrowType,
            'target-arrow-color': 'data(color)',
            'line-style': 'data(lineStyle)',
          }
        }
      ],

      elements: {

        nodes: nodeElements,
        edges: edgeElements
      },

      layout: {
        name: 'preset',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      },
      pan: {
        x: 0,
        y: 0
      },
      minZoom: 0,
      maxZoom: 4,
      wheelSensitivity: 0.10,
    });

    layoutDiv.style['display'] = showLayoutOptionsCheckbox.checked ? 'block' : 'none';

    if (showLayoutOptionsCheckbox.checked) {
      let layout;
      if (layoutSelect.value) {
        layout = cy.layout({
          name: layoutSelect.value
        });
        if (layoutSelect.value === 'cose') {
          layout.name = layoutSelect.value;
          layout.options.randomize = true;
          layout.options.gravity = 1;
          layout.options.nestingFactor = 1.2;
          layout.options.nodeRepulsion = 1000000;
        } else if (layoutSelect.value && layoutSelect.value === 'preset') {
          restoreCoordinates(cy);
        } else {
          storeCoordinates(cy);
        }
        layout.run();
      } else {
        if (defaultLayout !== '' && defaultLayout !== 'preset') {
          storeCoordinates(cy);
        } else {
          restoreCoordinates(cy);
        }
      }
    } else {
      if (defaultLayout !== '' && defaultLayout !== 'preset') {
        storeCoordinates(cy);
      } else {
        restoreCoordinates(cy);
      }
    }

    cy.zoom(defaultZoom);
    cy.center();
    cy.on('dragfree', 'node', function (evt) {
      nodeId = evt.target.id();
      position = evt.target.position();
      nodeCoordinates[nodeId] = position;
      vscode.postMessage({
        command: 'nodeCoordinateUpdate',
        text: {
          nodeId: nodeId,
          position: position
        }
      });
    });
    cy.on('click', 'node', function (evt) {
      var filepath = evt.target.data().filepath;
      if (filepath && filepath.length > 0) {
        openFileInVsCode(filepath);
      }
    });
    cy.on('mouseover', 'node', function (evt) {
      var filepath = evt.target.data().filepath;
      if (filepath && filepath.length > 0) {
        evt.cy.container().style.cursor = 'pointer';
      }
    });
    cy.on('mouseout', 'node', function (evt) {
      evt.cy.container().style.cursor = 'default';
    });
    cy.on('zoom', function (evt) {
      vscode.postMessage({
        command: 'zoom',
        text: cy.zoom()
      });
    });
  }
}());