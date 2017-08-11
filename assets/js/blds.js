---

---


function show_map() { 
	var mymap = L.map('mapid', { zoomControl:false }).setView([33.0398,-116.9687],9);
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

	//console.log(table);
	
	if(table['permittypemapped'] != null){
		pt = table['permittypemapped'].toLowerCase();
	}
	else{
		pt = table['permittypemapped']
	}

	//console.log( pt, table['latitude'], table['longitude']);

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
	return pt;
}

function update_dict(permit_dict,pt){

	if (table['permittypemapped'] != null){
		permit_dict[pt]+=1
	}
	return permit_dict;
}


function create_line_chart(tallies, colors, element){
		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			type : 'line',
			data:{
				labels: ['January','February','March','April','May','June','July','August','September',
				'October','November','December'],
				datasets: [
					{
					label: tallies[0][0],
					data: Object.values(tallies[0]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: [
					                'rgba(255,99,132,1)'],
					            borderWidth: 1
					        },
					        {
					label: tallies[1][0],
					data: Object.values(tallies[1]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: [
					                'rgba(54, 162, 235, 1)'],
					            borderWidth: 1
					        },
					        {
					label: tallies[2][0],
					data: Object.values(tallies[2]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: [
					                'rgba(255, 206, 86, 1)'],
					            borderWidth: 1
					        },
					        {
					label: tallies[3][0],
					data: Object.values(tallies[3]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: ['rgba(75, 192, 192, 1)'],
					            borderWidth: 1
					        },
					        {
					label: tallies[4][0],
					data: Object.values(tallies[4]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: ['rgba(153, 102, 255, 1)'],
					            borderWidth: 1
					        },
					        {
					label: tallies[5][0],
					data: Object.values(tallies[5]).slice(1,13),
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					            borderColor: ['rgba(255, 159, 64, 1)'],
					            borderWidth: 1
					        }]
					//data_info
					    },
					    options: {
					        scales: {
					            yAxes: [{
					                ticks: {
					                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}

mymap = show_map();

permit_dict =  {
	'building': 0,
	'roofing': 0,
	'demolition':0,
	'fencing':0,
	'pool/spa':0,
	'electrical':0,
	'grading':0,
	'plumbing':0

}

colors = ['rgba(255,99,132,1)',
         'rgba(54, 162, 235, 1)',
         'rgba(255, 206, 86, 1)',
         'rgba(75, 192, 192, 1)',
         'rgba(153, 102, 255, 1)',
         'rgba(255, 159, 64, 1)',
         'rgba(255, 51, 153, 1)',
         'rgba(0, 204, 204, 1)',
         'rgba(0, 0, 153, 1)']

{% for table in site.data.San_Diego %}
  
  var table = {{ table | jsonify }};

  pt = show_data(table, mymap);

{% endfor %}


var tallies = {{ site.data.sd_tallies | jsonify}}


data_info = tallies.map(function(i){
  return {label: i[0],
            data : Object.values(i).slice(1,13),
            backgroundColor : ['rgba(255,255,255,0.2)'],
            borderColor : [i[13]],
            borderWidth: 1}});

console.log(data_info);

create_line_chart(tallies, colors, 'myChart');

