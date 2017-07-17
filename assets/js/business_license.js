---

---

function show_map() {

  
  var mymap = L.map('mapid', { zoomControl:false }).setView([39.1151,-94.4124],10);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

  return mymap;
}

function show_data(table, mymap) {

  var licenseIcon = L.icon({ iconUrl: '../images/license.svg', iconSize: [19, 12] });
  
  for (var i = 0; i < table[1].length; i++) {
    var marker = L.marker([table[1][i]['latitude'], table[1][i]['longitude']], {icon: licenseIcon}).bindPopup( +'<p>'+ table[1][i].business_dba+'</p>'+'<p>'+table[1][i].business_type+ '</p>').addTo(mymap);
    }
}


mymap = show_map();

{% for table in site.data%}
  
  var table = {{ table | jsonify }};

  show_data(table, mymap);

{% endfor %}