var $ = require('jQuery');
var ol = require('openlayers');

import {createMapserverLayer} from './mapservice.js';
import {createFeatureLayer} from './featureservice.js';

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

//Fill the javascript variable @capabilities with JSON
function getCapabilities(url) {
    var capabilitiesURL = url + "?f=pjson";
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
    var legendURL = url + "/legend?f=pjson";
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

    getLayersFromDataSource("#setLayer");
    getLayersFromDataSource("#layerSelect");
    addLayersToMap();
}

function getLayersFromDataSource(divId) {
    layers = capabilities.layers;
    //remove old options
    $(divId)
        .find('option').remove()
        .end();
    //iterate through all layers and add them to the select list where value is id and name is name
    for (var i = 0; i < layers.length; i++) {
        var aname = layers[i].name;
        var aid = layers[i].id;
        //setLayer.append($('<option />').val(aid));
        $(divId).append('<option value="' + aid + '">' + aname + '</option>');
    };
}

function addLayersToMap(){
  if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
    for (var i = 0; i < layers.length; i++) {
        var aid = layers[i].id;
        mapserverLayersArray[i] = createLayer(aid);
        map.addLayer(mapserverLayersArray[i]);
        mapserverLayersArray[i].setVisible(false);
    };
  } else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
    for (var i = 0; i < layers.length; i++) {
        var aid = layers[i].id;
        mapserverLayersArray[i] = createFeatureLayer(dataSource,aid);
        map.addLayer(mapserverLayersArray[i]);
        mapserverLayersArray[i].setVisible(false);
      }
  }
}

function createLayer(layerId) {
    if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
        return createMapserverLayer(layerId, dataSource);
    } else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
        //First we need to create a layer, then we add the features and the information on that layer
        console.log("System found out it is a Featureserver.")

    } else {
        console.log("System doesn't know what type it is :( ")
    }
}

//Show selected layer
export function showLayer(layerId) {

  mapserverLayersArray[layerId].setVisible(true);
}
//Hide unselected layer
export function hideLayer(layerId) {

  mapserverLayersArray[layerId].setVisible(false);

}


// function createFeatureLayer(serviceUrl, layer) {
//     var vectorSource = new ol.source.Vector({
//         loader: function(extent, resolution, projection) {
//             var url = serviceUrl + '/' + layer + '/query/?f=json&' +
//                 'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
//                 encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
//                     extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
//                     ',"spatialReference":{"wkid":102100}}') +
//                 '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
//                 '&outSR=102100';
//             $.ajax({
//                 url: url,
//                 dataType: 'jsonp',
//                 success: function(response) {
//                     if (response.error) {
//                         alert(response.error.message + '\n' +
//                             response.error.details.join('\n'));
//                     } else {
//                         // dataProjection will be read from document
//                         var features = esrijsonFormat.readFeatures(response, {
//                             featureProjection: projection
//                         });
//                         if (features.length > 0) {
//                             vectorSource.addFeatures(features);
//                         }
//                     }
//                 }
//             });
//         },
//         strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
//             tileSize: 512
//         }))
//     });
//
//     var vector = new ol.layer.Vector({
//         source: vectorSource
//     });
//     return vector;
// }
