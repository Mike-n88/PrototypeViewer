var $ = require('jQuery');
var ol = require('openlayers');
import {getMLayersA} from './map.js';
import {getMap} from './map.js';
import {getUrl} from './map.js';


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

function getFeatureInfoWMS(){
  var url1 = getUrl();
  var url = url1+"/WMSServer?&service=WMS&version=1.1.0&request=GetFeatureInfo&layers=fields&query_layers=fields&styles=&bbox=47.130647,8.931116,48.604188,29.54223&srs=EPSG:4326&feature_count=10&x=562&y=193"

  return url;

}

//Onclick behavior
export function onClickWMS(evt){
  var map = getMap();
  var mapLayersArray = getMLayersA();
  var wmsSource = mapLayersArray[0].getSource();
  var view = map.getView();

  document.getElementById('info').innerHTML = '';
  var viewResolution = /** @type {number} */ (view.getResolution());
  url= wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, 'EPSG:3857',
      {'INFO_FORMAT': 'text/html'});
  if (url) {
    document.getElementById('info').innerHTML =
        '<iframe seamless src="' + url + '"></iframe>';
  }
}
