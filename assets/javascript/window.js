var $ = require('jQuery');

export function showWindow(name) {
  if (name == 'filter') {
    $('#popUpFilter').toggle('slow');
  }  else if (name == 'search') {
    $('#popUpSearch').toggle('slow');
  }
}
