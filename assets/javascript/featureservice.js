var $ = require('jQuery');
var ol = require('openlayers');

import {
    getMap
} from './map.js';

var esrijsonFormat = new ol.format.EsriJSON();

export function createFeatureLayer(serviceUrl, layer) {
  var vectorSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = serviceUrl + '/' + layer + '/query/?f=json&' +
                'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                    extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                    ',"spatialReference":{"wkid":102100}}') +
                '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
                '&outSR=102100';
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
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      tileSize: 512
    }))
  });

  var vector = new ol.layer.Vector({
    source: vectorSource
  });
  return vector;
}

export function changeFeature(feature) {
  var str = {};
  str = feature.getProperties();

  for (var s in str) {
    if (typeof str[s] != 'object' || str[s] === 'geometry') {
      str[s] = document.getElementById('' + s + '1').value;
      feature[s] = document.getElementById('' + s + '1').value;
    }
  }

  $.ajax({
    type: 'POST',
    url: 'http://192.168.216.56:6080/arcgis/rest/services/test/MyMapService/FeatureServer/0/applyEdits',
    data: str,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    processData: true,
    success: function(data, status, jqXHR) {
      alert('success...' + data);
    },
    error: function(xhr) {
      alert(xhr.responseText);
    }
  });
}


//     $.ajax({
//       type: "POST",
//       url: "http://192.168.216.56:6080/arcgis/rest/services/test/MyMapService/FeatureServer/0/applyEdits",
//       data: str,
//       dataType: "JSON",
//       success: function() {
//         alert("Thanks");
//       }
//   });
//
//}

//Onclick behavior
export function onClickWFS(browserEvent){
  var map = getMap();
  var coordinate = browserEvent.coordinate;
  var pixel = map.getPixelFromCoordinate(coordinate);
  var el;
  if (document.getElementById('info-feature')) {
    el = document.getElementById('info-feature');
  }
  el.innerHTML = '';
  map.forEachFeatureAtPixel(pixel, function(feature) {
    $('#info-feature').append('<form>');
    $('#info-feature form').append('<br><button type="button" id="saveButton">Save</button><br />');

    document.getElementById('saveButton').addEventListener('click', function() {
      changeFeature(feature);
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
