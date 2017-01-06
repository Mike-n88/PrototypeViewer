var ol = require('openlayers');
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
