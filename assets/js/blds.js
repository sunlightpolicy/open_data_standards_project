---

---


function show_map(mapid,coords,zoom) { 
	var mymap = L.map(mapid, { zoomControl:false }).setView(coords,zoom);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
	}).addTo(mymap);

	return mymap;
}



function Data_obj(label,data,backgroundColor,borderColor,borderWidth){
	this.label = label;
	this.data = data;
	this.backgroundColor = backgroundColor;
	//this.borderColor = borderColor;
	this.borderWidth = borderWidth;
}

function plot_icon(pt, row, mymap){
	
	pt_dict = {};

	pt_dict['building'] = L.icon({iconUrl:'/open_data_standards_project/images/building.png', iconSize: [19, 19] });
	pt_dict['roofing'] = L.icon({iconUrl:'/open_data_standards_project/images/roof.png', iconSize: [19, 19] });
	pt_dict['demolition'] = L.icon({iconUrl:'https://upload.wikimedia.org/wikipedia/commons/6/67/Hammer_icon_-_Noun_Project_8246.svg', iconSize: [19, 19] });
	pt_dict['fencing'] = L.icon({iconUrl:'https://camo.githubusercontent.com/3d0b70e5e229dc6985ee795acb6c96fa03e0d5a7/68747470733a2f2f63646e312e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f7265616c2d6573746174652d7365742d322f3531322f34302d3531322e706e67'
		, iconSize: [19, 19] });
	pt_dict['pool'] = L.icon({iconUrl:'/open_data_standards_project/images/pool.png', iconSize: [19, 19] });
	pt_dict['pool/spa'] = L.icon({iconUrl:'/open_data_standards_project/images/pool.png', iconSize: [19, 19] });
	pt_dict['mechanical'] = L.icon({iconUrl:'/open_data_standards_project/images/mechanic.png', iconSize: [19, 19] });
	pt_dict['electrical'] = L.icon({iconUrl:'/open_data_standards_project/images/electric.png', iconSize: [19, 19] });
	pt_dict['grading'] = L.icon({iconUrl:'/open_data_standards_project/images/grading.png', iconSize: [19, 19] });
	pt_dict['plumbing'] = L.icon({iconUrl:'/open_data_standards_project/images/toilet.png', iconSize: [19, 19] });
	pt_dict['other'] =  L.icon({iconUrl:'https://upload.wikimedia.org/wikipedia/commons/2/25/Icon-round-Question_mark.jpg',
		iconSize: [19, 19] });
	
	// if(!pt_dict.hasOwnProperty(pt)){
	// 	console.log(pt);
	// };

	if(row['latitude'] != null && row['longitude'] != null){
		if(pt != null){
		// console.log(pt, row['latitude'],row['longitude']);
	    var marker = L.marker([row['latitude'], row['longitude']], {icon: pt_dict[pt]}).bindPopup( '<p>'+ row['description']+'</p>'+'<p>'+ row['permittypemapped']+'</p>'+'<p>'+row['issueddate']+ '</p>').addTo(mymap);
	  	}
	 };
}

function show_data(table, mymap) {

	if(table['permittypemapped'] != null){
		pt = table['permittypemapped'].toLowerCase();
	}
	else{
		pt = table['permittypemapped']
	};

	plot_icon(pt,table, mymap);
	
	return pt;
}

function update_dict(permit_dict,pt){

	if (table['permittypemapped'] != null){
		permit_dict[pt]+=1
	}
	return permit_dict;
}


function create_bar_chart(tallies, colors, element,text){
		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			type : 'bar',
			data:{
				labels: ['January','February','March','April','May','June','July','August','September',
				'October','November','December'],
				 datasets: 
					tallies.map(function(i){
					  return new Data_obj(i[0],Object.values(i).slice(1,13),
					           	i[13],
					            i[13],2);})
					    },
					    options: {
					    	title: {
					            display: true,
					            text: text
        							},
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

function create_bar_year(tallies, colors, element,text){
		var ctx = document.getElementById(element);


		function create_years(tallies){

			var key_list = Object.keys(tallies[0]).sort(function(a,b) {
			return (Number(a) - Number(b));});

			var lastKey = key_list.slice(-1);
			var lastValue = tallies[0][lastKey];

			return lastValue
		}

		label_years = create_years(tallies);

		console.log(label_years);		

		var myChart = new Chart(ctx, {
			type : 'bar',
			data:{
				labels: label_years, // figure this out
				 datasets: 
					tallies.map(function(i){
					  return new Data_obj(i[0], Object.values(i).slice(1,i.length-2),
					           	Object.values(i).slice(i.length-2),
					            Object.values(i).slice(i.length-2),2);})
					    },
					    options: {
					    	title: {
					            display: true,
					            text: text
        							},
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

mymap = show_map('mapid',[33.0398,-116.9687],9);

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

var tallies_SD_year = {{ site.data.tallies_sd_year | jsonify}}

create_bar_chart(tallies, colors, 'myChart', 'San Diego Permits by Month');

create_bar_year(tallies_SD_year, colors, 'myChart2','San Diego Permits by Year')



mymap2 = show_map('mapid2',[35.0918,-85.2398],11);

{% for table in site.data.Chattanooga %}
  
  var table_chatt = {{ table | jsonify }};

  pt = show_data(table_chatt, mymap2);

{% endfor %}



var tallies_chatt = {{ site.data.chatt_tallies | jsonify}}

var tallies_chatt_year = {{ site.data.tallies_chatt_year | jsonify}}


create_line_chart(tallies_chatt, colors, 'myChart3','Chattanooga Permits by Month');

create_bar_year(tallies_chatt_year, colors, 'myChart4','Chattanooga Permits by Year')