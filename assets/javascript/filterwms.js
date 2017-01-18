import {
    getMLayersA
} from './map.js';

//Creating the filter for a WMS layer
export function filterWMS(layerId, featureName1, operatorName1, checkWaarde1) {
  var mapLayersArray = getMLayersA();
  var imageSource = mapLayersArray[layerId].getSource();
  var layerDefString = layerDefFilter(featureName1, checkWaarde1, layerId, operatorName1);

  imageSource.updateParams({
    'layerDefs': layerDefString
  });

}

//Setting up the layer string for the layerdefs in filterWMS()
function layerDefFilter(featureName1,checkWaarde1,layerId,operatorName1) {
  var s = '{' + layerId + ':"' + featureName1 + operatorName1 + '\'' + checkWaarde1 + '\'"}';
  return s;
}
