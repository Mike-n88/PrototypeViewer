var $ = require('jQuery');
import {getUrl} from './map.js';


export function getFeatureName(numberLayer) {
  var dataSource = getUrl();
  var urlLayers = dataSource + '/' + numberLayer + '?f=pjson';

  var featureNameSelect = $('#featureNameSelect')
  .find('option:gt(0)').remove()
  .end();
  //let aantal;
  $.getJSON(urlLayers, function(data1) {
    //aantal = data1['layers'].length;
    $.each(data1['fields'], function() {
      featureNameSelect.append($('<option />').val(this.name).text(this.name));
      //numberSelect.push(this.id);
    });
  });
}
