var $ = require('jQuery');
//Create legend
export function createLegend(legend,service) {
  if (service === 'wms') {
    $('#legendInfo').append('<table>');
    for (let entry in legend.layers) {
      var wmsImageData = legend.layers[entry].legend[0].imageData;
      var wmsLayerName = legend.layers[entry].layerName;
      $('#legendInfo').append('<tr>');
      $('#legendInfo').append('<td>' + wmsLayerName + '</td>');
      $('#legendInfo').append('<td><img src="data:image/png;base64,' + wmsImageData + '" /></td>');
      $('#legendInfo').append('</tr>');
    }
    $('#legendInfo').append('</table>');
  }  else if (service === 'wfs') {
    if ((legend.layers[0].currentVersion == 10.41) && (legend.layers[0].drawingInfo.renderer.symbol.imageData)) {
      $('#legendInfo').append('<table>');
      for (let entry in legend.layers) {
        var wfsImageData = legend.layers[entry].drawingInfo.renderer.symbol.imageData;
        var wfsLayerName = legend.layers[entry].name;
        $('#legendInfo').append('<tr>');
        $('#legendInfo').append('<td>' + wfsLayerName + '</td>');
        $('#legendInfo').append('<td><img src="data:image/png;base64,' + wfsImageData + '" /></td>');
        $('#legendInfo').append('</tr>');
      }
      $('#legendInfo').append('</table>');
    }    else {
      $('#legendInfo').append('Either the version is not supported <br />or the map has no imageData');
    }
  }
}
