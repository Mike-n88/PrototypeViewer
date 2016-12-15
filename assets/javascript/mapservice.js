//Create layer for mapservice(wms)
export function createMapserverLayer (layerId, dataSource){
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
}