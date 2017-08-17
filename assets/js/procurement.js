---

---

colors = ['rgba(255,99,132,1)',
         'rgba(54, 162, 235, 1)',
         'rgba(255, 206, 86, 1)',
         'rgba(75, 192, 192, 1)',
         'rgba(153, 102, 255, 1)',
         'rgba(255, 159, 64, 1)',
         'rgba(255, 51, 153, 1)',
         'rgba(0, 204, 204, 1)',
         'rgba(0, 0, 153, 1)']

function plot_arrays(xy, label, colors){
	this.type = 'bubble';
	this.label = label;
	this.data = xy;
	this.backgroundColor = color_array;
}

function make_xy(file,field1,field2){
	new_array = []
	for(i=0;i< procurement.length;i++){
		new_array.push({x:procurement[i][field1],y:procurement[i][field2]});
	}
	return new_array
}

function unique_vals(procurement){
	unique_list = [];
	procurement.map(function(row){
		console.log(row['categoryMonth']);
		unique_list.push(row['categoryMonth']);})

	return Array.from(new Set(unique_list));
}

function make_array(file, field){
	new_array = [];
		file.map(function(row){
			console.log(row[field]);
			new_array.push(row[field]);})
	return new_array;
}

function make_color_array(file, field){
	new_array = [];
		file.map(function(row){
			console.log(row[field]);
			if(row[field] == 'Washington DC'){
				new_array.push(colors[0]);
			}
			else if(row[field] == 'Miami'){
				new_array.push(colors[1]);
			}
			else{
				new_array.push(colors[2]);
			}})
	
	return new_array
}


function create_bubble_chart(catMonth_array, 
	frequency_array, city_array, color_array,
	 colors, element, labels){

		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			data:{
				 labels: labels,
				 datasets: 
					plot_arrays(xy, city_array, color_array)
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


var procurement = {{ site.data.proc_type | jsonify}}

//console.log(unique_vals(procurement));

//catMonth_array = make_array(procurement,'categoryMonth');

//frequency_array = make_array(procurement, 'freqCat');

xy = make_xy(procurement, 'categoryMonth', 'freqCat');

console.log(xy);

city_array = make_array(procurement,'city');

color_array = make_color_array(procurement,'city');


create_bubble_chart(xy, colors, 'myChart2', unique_vals(procurement));
