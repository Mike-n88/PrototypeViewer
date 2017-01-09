var $ = require('jQuery');
var ol = require('openlayers');

import {
    createMapserverLayer
} from './mapservice.js';
import {
    createFeatureLayer
} from './featureservice.js';

import {changeFeature} from './featureservice.js';
//import {onClickWMS} from './mapservice.js';
import {onClickWFS} from './featureservice.js';

var dataSource;
var capabilities;
var legend;
var layers;
var map = ol.map;

var mapserverLayersArray = [];
var featureserverLayersArray = [];

//create a basic map
export function createMap() {
  map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
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
    //Todo onderstaande verwerken in 1 functie om de hoeveelheid code te verminderen
  getCapabilities(dataSource);
  getLegend(dataSource);
    //Fill in menu with information from the dataSource
  fillMenu();
}

export function getUrl() {
  return dataSource;
}

export function getMLayersA() {
  return mapserverLayersArray;
}

export function getFLayersA() {
  return featureserverLayersArray;
}

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
  var legendURL = url + '/legend?f=pjson';
  $.ajax({
    type: 'GET',
    url: legendURL,
    async: false,
    dataType: 'json',
    success: function(data) {
      legend = data;
    }
  });
}

function fillMenu() {
  getLayersFromDataSource('#setLayer');
  getLayersFromDataSource('#layerSelect');
  getLayersFromDataSource('#filterLayerSelect');
  addLayersToMap();
}

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
        //setLayer.append($('<option />').val(aid));
    $(divId).append('<option value="' + aid + '">' + aname + '</option>');
  }
}

export function addSingleLayerToMap(layer) {
  map.addLayer(layer);
}

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
  if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
    //onClickWMS(evt);
  }  else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
    onClickWFS(evt);
  }

}
