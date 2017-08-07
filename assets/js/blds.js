---

---

function show_map() { 
	var mymap = L.map('mapid', { zoomControl:false }).setView([32.8715,-116.7723],9);
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

	var demo = L.icon({iconUrl:'https://upload.wikimedia.org/wikipedia/commons/6/67/Hammer_icon_-_Noun_Project_8246.svg', iconSize: [19, 19] });
	var fence = L.icon({iconUrl:'https://camo.githubusercontent.com/3d0b70e5e229dc6985ee795acb6c96fa03e0d5a7/68747470733a2f2f63646e312e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f7265616c2d6573746174652d7365742d322f3531322f34302d3531322e706e67'
		, iconSize: [19, 19] });
	var roof = L.icon({iconUrl:'/open_data_standards_project/images/roof.png', iconSize: [19, 19] });
	var building = L.icon({iconUrl:'/open_data_standards_project/images/building.png', iconSize: [19, 19] });
	var pool = L.icon({iconUrl:'/open_data_standards_project/images/pool.png', iconSize: [19, 19] });
	var electric = L.icon({iconUrl:'/open_data_standards_project/images/electric.png', iconSize: [19, 19] });
	var grading = L.icon({iconUrl:'/open_data_standards_project/images/grading.png', iconSize: [19, 19] });
	var mechanic = L.icon({iconUrl:'/open_data_standards_project/images/mechanic.png', iconSize: [19, 19] });
	var plumbing = L.icon({iconUrl:'/open_data_standards_project/images/mechanic.png', iconSize: [19, 19] });

	console.log(table);
	
	if(table['permittypemapped'] != null){
		pt = table['permittypemapped'].toLowerCase();
	}
	else{
		pt = table['permittypemapped']
	}

	console.log( pt, table['latitude'], table['longitude']);

	if (pt === 'building'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: building}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'roofing'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: roof}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	 }
  	else if (pt === 'demolition'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: demo}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'fencing'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: fence}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'pool' || pt == 'spa'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: pool}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'mechanical'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: mechanic}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'electrical'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: electric}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else if (pt === 'grading'){
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: grading}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	else {
		if(table['latitude'] != null){
	    var marker = L.marker([table['latitude'], table['longitude']], {icon: plumbing}).bindPopup( '<p>'+ table['description']+'</p>'+'<p>'+table['issueddate']+ '</p>').addTo(mymap);
	  	}
	  }
	  //else {
	  //  var marker = L.marker([table['latitude'], table['longitude']], {icon: kcIcon}).bindPopup( '<p>'+ table['business_dba']+'</p>'+'<p>'+table['business_type']+ '</p>').addTo(mymap);
	    //}
	  //}
}

mymap = show_map();

{% for table in site.data.San_Diego %}
  
  var table = {{ table | jsonify }};

  show_data(table, mymap);

{% endfor %}