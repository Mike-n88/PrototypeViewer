var $ = require('jQuery');

export function showWindow(name) {
  if (name == 'filter') {
    $('#popUpFilter').show('slow');
  } else if (name == 'filterClose') {
    $('#popUpFilter').hide('slow');
  } else if (name == 'search') {
    $('#popUpSearch').show('slow');
  } else if (name == 'searchClose') {
    $('#popUpSearch').hide('slow');
  } else if (name == 'legend') {
    $('#popUpLegend').show('slow');
  } else if (name == 'legendClose') {
    $('#popUpLegend').hide('slow');
  }
}
