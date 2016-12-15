var $ = require('jQuery');
var ol = require('openlayers');

var dataSource;
var capabilities;
var legend;
var map = ol.map;
var layersArray = [];

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
    var layers = capabilities.layers;
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
  var layers = capabilities.layers;
  for (var i = 0; i < layers.length; i++) {
      var aid = layers[i].id;
      layersArray[i] = createLayer(aid);
      map.addLayer(layersArray[i]);
      layersArray[i].setVisible(false);
  };
}

function createLayer(layerId) {
    if (dataSource.toLowerCase().indexOf('mapserver') >= 0) {
        var url = dataSource;
        var imageLayer =
            new ol.layer.Image({
                source: new ol.source.ImageArcGISRest({
                    ratio: 1.5,
                    params: {
                        'layers': 'show:'+layerId
                    },
                    url: url
                })
            });
        return imageLayer;
    } else if (dataSource.toLowerCase().indexOf('featureserver') >= 0) {
      
        console.log("System found out it is a Featureserver.")
    } else {
        console.log("System doesn't know what type it is :( ")
    }
}

//Show selected layer
export function showLayer(layerId) {
  layersArray[layerId].setVisible(true);
}
//Hide unselected layer
export function hideLayer(layerId) {
  layersArray[layerId].setVisible(false);
}
