function show_map() {
  //console.log(data);

  // (This part isn't necessary anymore because we're not including state shapes)
  // // gets the locations in the geoJSON that have a city property
  // var locations = [];
  // $.each(data, function(key, val) {
  //   if (val['properties'].hasOwnProperty('City') && val['properties']['City'] != '') {
  //     locations.push(val);
  //   }
  // });
  //var locations = data;

  // set up map
  var map = L.map('mapid').setView([39.0461,-94.3653],11);
  var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18
  }).addTo(map);


$(document).ready(function () {
/*
  // url to get geoJSON from
  var jsonURL = "/assets/js/locations.geojson";
  // get the getJSON from url
  $.getJSON(jsonURL, show_map);
*/
show_map();
});