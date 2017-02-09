var $ = require('jQuery');
var ol = require('openlayers');
var proj4 = require('proj4');

proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.4171,50.3319,465.5524,-0.398957388243134,0.343987817378283,-1.87740163998045,4.0725 +units=m +no_defs');
ol.proj.setProj4(proj4);
import {
    getMap
} from './map.js';
import {
    getUrl
} from './map.js';
import {
    getFLayersA
} from './map.js';

var esrijsonFormat = new ol.format.EsriJSON();
var projection = new ol.proj.Projection({
  code: 'EPSG:28992'
});

// Function to create a feature layer
export function createFeatureLayer(dataSource, layer) {
  var vectorSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = dataSource + '/' + layer + '/query/?f=json&' +
                'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                    extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                    ',"spatialReference":{"wkid":3857}}') +
                '&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*' +
                '&outSR=28992';
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(response) {
          if (response.error) {
            alert(response.error.message + '\n' +
                            response.error.details.join('\n'));
          } else {
            // dataProjection will be read from document
            var features = esrijsonFormat.readFeatures(response, {
              featureProjection: projection
            });
            if (features.length > 0) {
              vectorSource.addFeatures(features);
            }
          }
        }
      });
    },
    //Projection handling for vector (has no projection: option)
    format: new ol.format.GeoJSON({
      defaultDataProjection:projection
    }),
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      tileSize: 512
    }))
  });

  var vector = new ol.layer.Vector({
    source: vectorSource
  });
  return vector;

}

// Function to change the feature information
export function changeFeatureInfo(feature, payload) {
  var str = {};
  str = feature.getProperties();
  var dataSource = getUrl();
  var url = dataSource + '/0/updateFeatures';
  var changes = {};


  for (var s in str) {
    if (typeof str[s] != 'object' || str[s] === 'geometry') {
      str[s] = document.getElementById('' + s + '1').value;
      changes[s] = document.getElementById('' + s + '1').value;
    }
  }

  changes = JSON.stringify(changes);


  $.post(url, {
    f: 'json',
    features: payload
  }).done(function(data) {
    var result = JSON.parse(data);
    if (result.updateResults && result.updateResults.length > 0) {
      if (result.updateResults[0].success === true) {
        feature.setProperties({
          'relcp86d_': str.relcp86d_,
          'relcp86d_i': str.relcp86d_i,
          'symbol': str.symbol,
          'polygonid': str.polygonid,
          'scale': str.scale,
          'angle': str.angle,
          'omschrijvi': str.omschrijvi
        });

      } else {
        var error = result.addResults[0].error;
        alert(error.description + ' (' + error.code + ')');
      }

    }
  });
}

// Feature mode checker
function featureMode(boolFeatures, browserEvent, map, pixel, payload, feature, dataSource) {
  if (boolFeatures === true) {
    if (document.getElementById('deleteFeature').checked) {
      deleteFeature(browserEvent, map, payload, feature, dataSource);
    }    else if (document.getElementById('selectFeature').checked) {
      selectFeature(browserEvent);
    }  else if (document.getElementById('changeFeature').checked) {
      changeFeature(browserEvent);
    }
  }  else if (boolFeatures === false) {
    if (document.getElementById('addFeature').checked) {
      addFeature(browserEvent, dataSource);
    }
  }
}

function deleteFeature(evt, map, payload, feature, dataSource) {
  //delete feature
  var url = dataSource + '/0/deleteFeatures';
  var featureLayersArray = getFLayersA();
  var vectorSource = featureLayersArray[0].getSource();
  var fid = feature.getId();
  //console.log(feature);
  var r = confirm('Weet u zeker dat u de feature met id ' + fid + ' wil verwijderen?');
  if (r == true) {
    vectorSource.removeFeature(feature);

    var jsonTemp = {'objectIds': fid};
    jsonTemp = JSON.parse(JSON.stringify(jsonTemp));

    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: jsonTemp,
      success: function(data) {

      },
      error: function(xhr, ajaxOptions, thrownError) {

      }
    });
  }
}

function addFeature(browserEvent, dataSource) {
  //add feature
  var url = dataSource + '/0/addFeatures';

  var coordinate = proj4('EPSG:3857','EPSG:28992',browserEvent.coordinate);
  var x = coordinate[0];
  var y = coordinate[1];
  //console.log('De locatie is ' + coordinate);

  var jsonTemp = [{
    'geometry': {
      'x': x,
      'y': y
    },
    'attributes': {
      'relcp86d_': 0,
      'relcp86d_i': 99999,
      'symbol': 77,
      'polygonid': 1,
      'scale': 1,
      'angle': 10,
      'omschrijvi': 'Testobject'
    }
  }];

  var jsonTempStringified = JSON.stringify(jsonTemp);

  $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    data: 'f=json&features=' + jsonTempStringified,
    success: function(data) {

    },
    error: function(xhr, ajaxOptions, thrownError) {

      //console.warn(ajaxOptions);
    }
  });
}
function selectFeature() {
  //select feature
}
function changeFeature() {
  //delete feature
}

//Onclick behavior
export function onClickWFS(browserEvent) {
  var map = getMap();
  var dataSource = getUrl();
  var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);
  var featureLayersArray = getFLayersA();
  var vectorSource = featureLayersArray[0].getSource();
  var el;

  if (document.getElementById('info-feature')) {
    el = document.getElementById('info-feature');
  }
  el.innerHTML = '';

  //First check if the user wants to add a feature this has to be done before the map.forEachFeatureAtPixel function
  //because the user would click in an empty area on the map with no features
  featureMode(false, browserEvent, map, pixel, 'payload not available', 'feature not available', dataSource);
  vectorSource.refresh();
  map.forEachFeatureAtPixel(pixel, function(feature) {
    var payload = '[' + esrijsonFormat.writeFeature(feature, {
      featureProjection: map.getView().getProjection(),
      dataProjection: projection
    }) + ']';

    //Second check what feature mode is selected giving the extra possible parameters and the boolFeatures true
    featureMode(true, browserEvent, map, pixel, payload, feature, dataSource);

    $('#info-feature').append('<form>');
    $('#info-feature form').append('<br><button type="button" id="saveButton">Save</button><br />');

    document.getElementById('saveButton').addEventListener('click', function() {
      changeFeatureInfo(feature, payload);
    });

    var str = feature.getProperties();
    for (var s in str) {
      if (typeof str[s] != 'object') {
        $('#info-feature form').append('<label for="' + s + '">' + s + ': </label>');
        $('#info-feature form').append('<input type="text" id="' + s + '1" name="' + s + '" value="' + str[s] + '" /><br />');
      }
    }
  });
}
