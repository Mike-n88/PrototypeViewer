var $ = require('jQuery');

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
