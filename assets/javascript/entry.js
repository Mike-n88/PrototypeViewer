var $ = require('jQuery');
import {createMap} from './map.js';
import {getDataSource} from './map.js';
import {showLayer} from './map.js';
import {hideLayer} from './map.js';
import {showWindow} from './window.js';
import {getFeatureName} from './formValues.js';
import {filterWMS} from './filterwms.js';
import {filterWFS} from './filterwfs.js';

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
      if (temp[index].selected == true) {
        showLayer(temp[index].value);
      }          else {
        hideLayer(temp[index].value);
      }
    });
  });
  //Eventlistener going off clicking "Legend" button, will show filters window
  document.getElementById('buttonLegend').addEventListener('click', function() {
    showWindow('legend');
  });
  //Eventlistener going off clicking "LegendClose" button, will show filters window
  document.getElementById('buttonLegendClose').addEventListener('click', function() {
    showWindow('legendClose');
  });
  //Eventlistener going off clicking "Filters" button, will show filters window
  document.getElementById('buttonFilter').addEventListener('click', function() {
    showWindow('filter');
  });
  //Eventlistener going off clicking "Filters" button, will show filters window
  document.getElementById('buttonFilterClose').addEventListener('click', function() {
    showWindow('filterClose');
  });

  //Eventlistener going off when the user changes layers at filters window, which will trigger an event to get the features of the chosen layer
  document.getElementById('filterLayerSelect').addEventListener('change',function() {
    var temp = document.getElementById('filterLayerSelect').options;
    $(temp).each(function(index, element) {
      if (temp[index].selected == true) {
        var vs = temp[index].value;
        getFeatureName(vs);
      }
    });
  });

  //Eventlistener going off clicking "Filters" button, will show filters window
  document.getElementById('buttonFilterApply').addEventListener('click', function() {
    if (document.getElementById('serviceURL').value.toLowerCase().indexOf('mapserver') >= 0) {
      filterWMS(document.getElementById('filterLayerSelect').value,document.getElementById('featureNameSelect').value,document.getElementById('operatorSelect1').value,document.getElementById('checkWaarde1').value);
    }    else if (document.getElementById('serviceURL').value.toLowerCase().indexOf('featureserver') >= 0) {
      filterWFS(document.getElementById('filterLayerSelect').value,document.getElementById('featureNameSelect').value,document.getElementById('operatorSelect1').value,document.getElementById('checkWaarde1').value);
    }
  });

  //Eventlistener going off clicking "Zoeken" button, will show Zoeken window
  document.getElementById('buttonSearch').addEventListener('click', function() {
    showWindow('search');
  });
  //Eventlistener going off clicking "ZoekenClose" button, will show Zoeken window
  document.getElementById('buttonSearchClose').addEventListener('click', function() {
    showWindow('searchClose');
  });

};
