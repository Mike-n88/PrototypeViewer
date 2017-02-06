// requires
var $ = require('jQuery');
var ol = require('openlayers');

// import functions from other js files
import {createLegend} from './legend.js';
import {createMapserverLayer} from './mapservice.js';
import {createFeatureLayer} from './featureservice.js';
import {onClickWFS} from './featureservice.js';
// import {onClickWMS} from './mapservice.js'; // not working

// All variables
var dataSource;
var capabilities;
var legend;
var layers;
var map = ol.map;
var mapserverLayersArray = [];
var featureserverLayersArray = [];
var raster = new ol.layer.Tile({
  source: new ol.source.XYZ({
    attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  })
});

//create a basic map
export function createMap() {
  map = new ol.Map({
    layers: [
      raster
    ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([5.86731, 52.03194], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10
    })
  });
    //map.on('pointermove', onMouseMove);
  map.on('click', onMouseClick);
}
//Get data from the serviceURL as JSON format
//After collecting the data start fillMenu() with the collected data
export function getDataSource(url) {
  dataSource = url;
  getCapabilities(dataSource);
  getLegend(dataSource);
    //Fill in menu with information from the dataSource
  fillMenu();
}

// getter for the dataSource (url)
export function getUrl() {
  return dataSource;
}
// getter for the mapserverLayersArray
export function getMLayersA() {
  return mapserverLayersArray;
}
// getter for the featureserverLayersArray
export function getFLayersA() {
  return featureserverLayersArray;
}
// getter for the map
export function getMap() {
  return map;
}

//Fill the javascript variable @capabilities with JSON
function getCapabilities(url) {
  var capabilitiesURL = url + '?f=pjson';
  $.ajax({
    type: 'GET',
    url: capabilitiesURL,
    async: false,
    dataType: 'json',
    success: function(data) {
      capabilities = data;
    }
  });
}

//Fill the javascript variable @legend with JSON
function getLegend(url) {
  if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
    var mapLegendURL = url + '/legend?f=pjson';
    $.ajax({
      type: 'GET',
      url: mapLegendURL,
      async: false,
      dataType: 'json',
      success: function(data) {
        legend = data;
      }
    });
    createLegend(legend, 'wms');
  }  else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
    var featureLegendURL = url + '/layers?f=pjson';
    $.ajax({
      type: 'GET',
      url: featureLegendURL,
      async: false,
      dataType: 'json',
      success: function(data) {
        legend = data;
      }
    });
    createLegend(legend, 'wfs');
  }
}

//fill the menu and then add the layers to the map
function fillMenu() {
  getLayersFromDataSource('#setLayer');
  getLayersFromDataSource('#layerSelect');
  getLayersFromDataSource('#filterLayerSelect');
  addLayersToMap();
}

//Get layers from datasource and add them in the in the given div id
function getLayersFromDataSource(divId) {
  layers = capabilities.layers;
    //remove old options
  if (divId == '#filterLayerSelect') {
    $(divId)
          .find('option:gt(0)').remove()
          .end();
  }  else if (divId != '#filterLayerSelect') {
    $(divId)
        .find('option').remove()
        .end();
  }
  //iterate through all layers and add them to the select list where value is id and name is name
  for (var i = 0; i < layers.length; i++) {
    var aname = layers[i].name;
    var aid = layers[i].id;

    $(divId).append('<option value="' + aid + '">' + aname + '</option>');
  }
}

//add a single layer to the map
export function addSingleLayerToMap(layer) {
  map.addLayer(layer);
}

//Add all layers to the map
function addLayersToMap() {
  for (var i = 0; i < layers.length; i++) {
    var aid = layers[i].id;
    if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
      mapserverLayersArray[i] = createMapserverLayer(dataSource, aid);
      map.addLayer(mapserverLayersArray[i]);
      mapserverLayersArray[i].setVisible(false);
    }      else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
      featureserverLayersArray[i] = createFeatureLayer(dataSource, aid);
      map.addLayer(featureserverLayersArray[i]);
      featureserverLayersArray[i].setVisible(false);
    }
  }
}

//Show selected layer
export function showLayer(layerId) {
  if (mapserverLayersArray.length > 0) {
    mapserverLayersArray[layerId].setVisible(true);
  } else if (featureserverLayersArray.length > 0) {
    featureserverLayersArray[layerId].setVisible(true);
  }
}

//Hide unselected layer
export function hideLayer(layerId) {
  if (mapserverLayersArray.length > 0) {
    mapserverLayersArray[layerId].setVisible(false);
  }  else if (featureserverLayersArray.length > 0) {
    featureserverLayersArray[layerId].setVisible(false);
  }
}

// when the user clicks the mouse, get the name property
// from each feature under the mouse and display it
function onMouseClick(browserEvent) {
  var evt = browserEvent;
  //if(){
  if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
      //onClickWMS(evt);
  }  else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
    onClickWFS(evt);
  }
  //}
}
