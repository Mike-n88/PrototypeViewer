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

var esrijsonFormat = new ol.format.EsriJSON();
var projection = new ol.proj.Projection({
  code: 'EPSG:28992'
});
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

export function changeFeatureInfo(feature) {
  var str = {};
  str = feature.getProperties();
  var dataSource = getUrl();
  var url = dataSource + '/0/updateFeatures';
  var map = getMap();
  var payload = '[' + esrijsonFormat.writeFeature(feature, {
    featureProjection: map.getView().getProjection(),
    dataProjection: projection
  }) + ']';

  for (var s in str) {
    if (typeof str[s] != 'object' || str[s] === 'geometry') {
      str[s] = document.getElementById('' + s + '1').value;
    }
  }

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

// Edit feature info directly without openlayers
// export function changeFeature(feature) {
//   var str = {};
//   str = feature.getProperties();
//   var dataSource = getUrl();
//   var url = dataSource + '/0/updateFeatures?f=json';
//
//   for (var s in str) {
//     if (typeof str[s] != 'object' || str[s] === 'geometry') {
//       str[s] = document.getElementById('' + s + '1').value;
//       feature[s] = document.getElementById('' + s + '1').value;
//     }
//   }
//
// var jsonTemp = {
//   'attributes' : {
//     'objectid' : str.objectid,
//     'relcp86d_' : str.relcp86d_,
//     'relcp86d_i' : str.relcp86d_i,
//     'symbol' : str.symbol,
//     'polygonid' : str.polygonid,
//     'scale' : str.scale,
//     'angle' : str.angle,
//     'omschrijvi' : str.omschrijvi
//   },
//   'geometry' : {
//     'x' : str.geometry.flatCoordinates[0],
//     'y' : str.geometry.flatCoordinates[1]
//   }
// };

//   jsonTemp = JSON.parse(JSON.stringify(jsonTemp));
//   console.log('jsonTemp: ', jsonTemp);
//
//   $.ajax({
//     url: url,
//     type: 'POST',
//     data: jsonTemp,
//     dataType: 'json',
//     success: function(result) {
//
//       console.log(result);
//
//     },
//     error: function(xhr, ajaxOptions, thrownError) {
//       alert(xhr.status);
//       alert(thrownError);
//     }
//   });
//
//
// }


//Onclick behavior
export function onClickWFS(browserEvent) {
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
      changeFeatureInfo(feature);
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
