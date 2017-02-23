var ol = require('openlayers');
var proj4 = require('proj4');

proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.4171,50.3319,465.5524,-0.398957388243134,0.343987817378283,-1.87740163998045,4.0725 +units=m +no_defs');
ol.proj.setProj4(proj4);
//import {getMLayersA} from './map.js';
//import {getMap} from './map.js';
//import {getUrl} from './map.js';


//Create layer for mapservice(wms)
export function createMapserverLayer(dataSource, layerId) {
  var url = dataSource;
  var imageLayer =
      new ol.layer.Tile({
        source: new ol.source.TileArcGISRest({
          ratio: 1.5,
          params: {
            'layers': 'show:' + layerId
          },
          url: url
        })
      });
  return imageLayer;
}

//Code for reference not working.

// function getFeatureInfoWMS() {
//   var url1 = getUrl();
//   var url = url1 + '/WMSServer?&service=WMS&version=1.1.0&request=GetFeatureInfo&layers=fields&query_layers=fields&styles=&bbox=47.130647,8.931116,48.604188,29.54223&srs=EPSG:4326&feature_count=10&x=562&y=193';
//
//   return url;
//
// }

//Onclick behavior
export function onClickWMS(evt) {
  //var map = getMap();
  //var mapLayersArray = getMLayersA();
  //var wmsSource = mapLayersArray[0].getSource();
  //var view = map.getView();
  // var coordinate = proj4('EPSG:3857','EPSG:28992',evt.coordinate);
  // var pixel = map.getPixelFromCoordinate(coordinate);
  //
  // map.forEachFeatureAtPixel(pixel, function(feature) {
  //   console.log(feature);
  // });

  // document.getElementById('info').innerHTML = '';
  // var viewResolution = /** @type {number} */ (view.getResolution());
  // url = wmsSource.getGetFeatureInfoUrl(
  //     evt.coordinate, viewResolution, 'EPSG:3857',
  //     {'INFO_FORMAT': 'text/html'});
  // if (url) {
  //   document.getElementById('info').innerHTML =
  //       '<iframe seamless src="' + url + '"></iframe>';
  // }
}
