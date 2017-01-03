var $ = require('jQuery');
import {createMap} from './map.js';
import {getDataSource} from './map.js';
import {showLayer} from './map.js';
import {hideLayer} from './map.js';
import {showWindow} from './window.js'
import {getFeatureName} from './formValues.js';

createMap();

window.onload = function() {
    document.getElementById('buttonConnect').addEventListener('click', function() {
        getDataSource(document.getElementById('serviceURL').value);
    });

    document.getElementById('buttonFilters').addEventListener('click', function() {
        showWindow("filter");
    });

    document.getElementById('filterLayerSelect').addEventListener('change',function() {
      getFeatureName(document.getElementById('layerSelect').value);
    });

    document.getElementById('buttonLayers').addEventListener('click', function() {
        var temp = document.getElementById('setLayer').options;
        $(temp).each(function(index, element) {
          if(temp[index].selected ==true){
            showLayer(temp[index].value);
            }
          else{
            hideLayer(temp[index].value);
          }
        });
    });

}
