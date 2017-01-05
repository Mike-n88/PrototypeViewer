var $ = require('jQuery');
import {createMap} from './map.js';
import {getDataSource} from './map.js';
import {showLayer} from './map.js';
import {hideLayer} from './map.js';
import {showWindow} from './window.js'
import {getFeatureName} from './formValues.js';
import {filter} from './filter.js';

//Create the openlayers map with OSM as background
createMap();

window.onload = function() {

    //Eventlistener going off clicking the "Koppel" button, connects to the datasource and collect the information(getCapabilities,getLegend,getDataSource)
    document.getElementById('buttonConnect').addEventListener('click', function() {
        getDataSource(document.getElementById('serviceURL').value);
    });

    //Eventlistener going off clicking "start" button, which will show each selected layer on the map and hide not selected layers
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

    //Eventlistener going off clicking "Filters" button, will show filters window
    document.getElementById('buttonFilters').addEventListener('click', function() {
        showWindow("filter");
    });

    //Eventlistener going off when the user changes layers at filters window, which will trigger an event to get the features of the chosen layer
    document.getElementById('filterLayerSelect').addEventListener('change',function() {
      getFeatureName(document.getElementById('layerSelect').value);
    });

    //Eventlistener going off clicking "Filters" button, will show filters window
    document.getElementById('buttonFilterApply').addEventListener('click', function() {
        filter(document.getElementById('filterLayerSelect').value,document.getElementById('featureNameSelect').value,document.getElementById('operatorSelect1').value,document.getElementById('checkWaarde1').value);
    });

    //Eventlistener going off clicking "Zoeken" button, will show Zoeken window
    document.getElementById('buttonSearch').addEventListener('click', function() {
        showWindow("search");
    });

}
