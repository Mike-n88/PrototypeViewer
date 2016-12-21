var $ = require('jQuery');
import {createMap} from './map.js';
import {getDataSource} from './map.js';
import {showLayer} from './map.js';
import {hideLayer} from './map.js';
import {onMouseMove} from './featureservice.js';

createMap();

window.onload = function() {
    document.getElementById('buttonConnect').addEventListener('click', function() {
        getDataSource(document.getElementById('serviceURL').value);
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
