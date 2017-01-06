
import {
    getFLayersA
} from './map.js';


export function filterWFS(layerId, featureName1, operatorName1, checkWaarde1) {

  var featureLayersArray = getFLayersA();


    // featureservice filter
  var vectorSource = featureLayersArray[layerId].getSource();
  var features = vectorSource.getFeatures();
  var filtered = features.filter(function(feature) {
        //console.log(feature.values_);
    return feature.values_[featureName1] == checkWaarde1;
  });
  vectorSource.clear();
  var length = filtered.length;
  for (var i = 0; i < length; i++) {
    vectorSource.addFeature(filtered[i]);
  }

}
