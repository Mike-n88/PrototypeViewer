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
import {
    getLayerId
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


// Feature mode checker
function featureMode(boolFeatures, browserEvent, map, pixel, feature, dataSource, vectorSource, layerId) {
  if (boolFeatures === true) {
    if (document.getElementById('deleteFeature').checked) {
      deleteFeature(browserEvent, map, feature, dataSource, vectorSource, layerId);
    }
  }  else if (boolFeatures === false) {
    if (document.getElementById('addFeature').checked) {
      addFeature(browserEvent, dataSource, map, vectorSource, layerId);
    }
  }
}

// Function to change the feature information
export function changeFeatureInfo(feature, layerId, map) {
  if (layerId.length < 2) {
    var str = {};
    str = feature.getProperties();
    var dataSource = getUrl();
    var url = dataSource + '/' + layerId[0] + '/updateFeatures';
    var changes = {};

    var payload = '[' + esrijsonFormat.writeFeature(feature, {
      featureProjection: map.getView().getProjection(),
      dataProjection: projection
    }) + ']';

    for (var s in str) {
      if (typeof str[s] != 'object' && s != 'objectid') {
        str[s] = document.getElementById('' + s + '1').value;
        changes[s] = document.getElementById('' + s + '1').value;
      }
    }
    //changes = JSON.stringify(changes);
    $.post(url, {
      f: 'json',
      features: payload
    }).done(function(data) {
      var result = JSON.parse(data);
      if (result.updateResults && result.updateResults.length > 0) {
        if (result.updateResults[0].success === true) {
          feature.setProperties(
            changes
            // 'relcp86d_': str.relcp86d_,
            // 'relcp86d_i': str.relcp86d_i,
            // 'symbol': str.symbol,
            // 'polygonid': str.polygonid,
            // 'scale': str.scale,
            // 'angle': str.angle,
            // 'omschrijvi': str.omschrijvi
          );

        } else {
          var error = result.addResults[0].error;
          alert(error.description + ' (' + error.code + ')');
        }

      }
    });
  } else if (layerId.length >= 2) {
    alert('2 of meer lagen zijn geselecteerd, om een feature te wijzigen selecteer 1 laag.');
  }
}

function deleteFeature(evt, map, feature, dataSource, vectorSource, layerId) {
  //delete feature
  if (layerId.length < 2) {
    var url = dataSource + '/' + layerId[0] + '/deleteFeatures';
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
  }  else if (layerId.length >= 2) {
    alert('2 of meer lagen zijn geselecteerd, om een feature te verwijderen selecteer 1 laag.');
  }
}

function addFeature(browserEvent, dataSource, map, vectorSource, layerId) {
  //add feature
  if (layerId.length < 2) {
    var r = confirm('Wilt u hier een nieuwe feature aanmaken?');
    if (r == true) {
      var url = dataSource + '/' + layerId[0] + '/addFeatures';

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
      vectorSource.clear();
    }
  }
}

//Onclick behavior
export function onClickWFS(browserEvent) {
  var map = getMap();
  var dataSource = getUrl();
  var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);
  var featureLayersArray = getFLayersA();
  var layerId = getLayerId();
  var vectorSource = featureLayersArray[layerId[0]].getSource();
  var textInfoFeature;
  var headerInfoFeature;
  if (document.getElementById('info-feature')) {
    textInfoFeature = document.getElementById('info-feature');
    headerInfoFeature = document.getElementById('info-header');
  }
  textInfoFeature.innerHTML = '';
  headerInfoFeature.innerHTML = 'Feature informatie';

  //First check if the user wants to add a feature this has to be done before the map.forEachFeatureAtPixel function
  //because the user would click in an empty area on the map with no features
  featureMode(false, browserEvent, map, pixel, 'feature not available', dataSource, vectorSource, layerId);
  vectorSource.refresh();
  map.forEachFeatureAtPixel(pixel, function(feature) {

    //Second check what feature mode is selected giving the extra possible parameters and the boolFeatures true
    featureMode(true, browserEvent, map, pixel, feature, dataSource, vectorSource, layerId);


    var table = $('<table></table>').addClass('table1');
    var str = feature.getProperties();
    for (var s in str) {
      if (typeof str[s] != 'object' && s != 'objectid') {
        var row = ('<tr><td><label for="' + s + '">' + s + ': </label></td><td><input type="text" id="' + s + '1" name="' + s + '" value="' + str[s] + '" /></td></tr>');
        table.append(row);
      }
    }
    $('#info-feature').append(table);
    $('#info-feature').append('<button type="button" id="saveButton">Save</button><br /> <br />');
    document.getElementById('saveButton').addEventListener('click', function() {
      changeFeatureInfo(feature, layerId, map);
      var r = confirm('Wilt u de feature wijzigen?');
      if (r == true) {
        changeFeatureInfo(feature, layerId, map);
      }
    });
  });
}
