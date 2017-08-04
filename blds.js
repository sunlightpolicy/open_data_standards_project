
---

---

function show_map() { 
	var mymap = L.map('mapid', { zoomControl:false }).setView([42.3329,-71.0379],11);
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

	var demo = L.icon({iconUrl:'https://upload.wikimedia.org/wikipedia/commons/6/67/Hammer_icon_-_Noun_Project_8246.svg'}, iconSize: [19, 19] });
	var fence = L.icon({iconUrl:'https://camo.githubusercontent.com/3d0b70e5e229dc6985ee795acb6c96fa03e0d5a7/68747470733a2f2f63646e312e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f7265616c2d6573746174652d7365742d322f3531322f34302d3531322e706e67'}
		, iconSize: [19, 19] });
	var roof = L.icon({iconUrl:'../images/roof.png'}, iconSize: [19, 19] });
	var building = L.icon({iconUrl:'../images/building.png'}, iconSize: [19, 19] });
	var pool = L.icon({iconUrl:'../images/pool.png'}, iconSize: [19, 19] });
	var electric = L.icon({iconUrl:'../images/electric.png'}, iconSize: [19, 19] });
	var grading = L.icon({iconUrl:'../images/grading.png'}, iconSize: [19, 19] });
	var mechanic = L.icon({iconUrl:'../images/mechanic.png'}, iconSize: [19, 19] });
	var plumbing = L.icon({iconUrl:'../images/mechanic.png'}, iconSize: [19, 19] });

	for (var i = 0; i < table[1].length; i++) {

	    console.log(table[1][i].business_dba);

	    if (table[1][i]['permittypemapped'] === 'BUILDING'){
	      var marker = L.marker([table[1][i]['latitude'], table[1][i]['longitude']], {icon: indIcon}).bindPopup( '<p>'+ table[1][i].business_dba+'</p>'+'<p>'+table[1][i].business_type+ '</p>').addTo(mymap);
	    }
	    //else {
	    //  var marker = L.marker([table[1][i]['latitude'], table[1][i]['longitude']], {icon: kcIcon}).bindPopup( '<p>'+ table[1][i].business_dba+'</p>'+'<p>'+table[1][i].business_type+ '</p>').addTo(mymap);
	    //}
	  }
}

mymap = show_map();

{% for table in site.data.blds_csvs.Boston %}
  
  var table = {{ table | jsonify }};

  show_data(table, mymap);

{% endfor %}