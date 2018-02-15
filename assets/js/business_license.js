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

  var indIcon = L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Red_star.svg', iconSize: [10, 10] });
  var kcIcon = L.icon({ iconUrl: 'http://www.gaf.com/_Images/icon-star-on.svg', iconSize: [10, 10] });
  var licenseIcon = L.icon({ iconUrl: '../images/license.svg', iconSize: [10, 6] });


  //for (var i = 0; i < table.length; i++) {

    //console.log(table[i].business_dba);

  if (table['city'] === 'INDEPENDENCE'){
    var marker = L.marker([table['latitude'], table['longitude']], {icon: indIcon}).bindPopup( '<p>'+ table['business_dba']+'</p>'+'<p>'+table['business_type']+ '</p>').addTo(mymap);
  }
  else {
    var marker = L.marker([table['latitude'], table['longitude']], {icon: kcIcon}).bindPopup( '<p>'+ table['business_dba']+'</p>'+'<p>'+table['business_type']+ '</p>').addTo(mymap);
    //}
  }
}


mymap = show_map();

{% for table in site.data.jackson_lic %}

  var table = {{ table | jsonify }};

  show_data(table, mymap);

{% endfor %}
