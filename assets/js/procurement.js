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

// function plot_arrays(xy){
// 	function Data_obj(xy){
// 		//this.label = label;
// 		this.data = xy;
// 		//this.backgroundColor = colors;
// 	}
// 	return new Data_obj(xy)
// }

function make_xy(file, field1, field2, field3, field4, labels, colors){
	new_array = []
	for(i=0;i< procurement.length;i++){

		if(procurement[i][field3] == 'Washington DC'){
			if(procurement[i][field1] == 'good'){
				color = colors[0];
				}
			else if(procurement[i][field1]== 'service'){
				color = colors[1];
				}
			else{
				color = colors[2];
				}
			}

		else if(procurement[i][field3] == 'Miami'){
			if(procurement[i][field1] == 'good'){
			color = colors[3];
			}
			else if(procurement[i][field1]== 'service'){
				color = colors[4];
				}
			else{
				color = colors[5];
				}
			}
			
		else{
				if(procurement[i][field1] == 'good'){
				color = colors[6];
				}
			else if(procurement[i][field1]== 'service'){
				color = colors[7];
				}
			else{
				color = colors[8];
				}
			}

		new_array.push({label:procurement[i][field3].concat(' ').concat(procurement[i][field1]),
		 backgroundColor:color,
		  data:[{x:procurement[i][field4],
		  y:procurement[i][field2], 
		  r: 10}]});
	}
	return new_array;
}

function unique_vals(procurement){
	unique_list = [];
	procurement.map(function(row){
		unique_list.push(row['months']);})

	return Array.from(new Set(unique_list));
}

function make_array(file, field){
	new_array = [];
		file.map(function(row){
			console.log(row[field]);
			new_array.push(row[field]);})
	return new_array;
}

// function make_color_array(file, field){
// 	new_array = [];
// 		file.map(function(row){
// 			console.log(row[field]);
// 			if(row[field] == 'Washington DC'){
// 				new_array.push(colors[0]);
// 			}
// 			else if(row[field] == 'Miami'){
// 				new_array.push(colors[1]);
// 			}
// 			else{
// 				new_array.push(colors[2]);
// 			}})
	
// 	return new_array
// }


function create_bubble_chart(xy, colors, element, labels_list){

		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			type: 'bubble',
			data:{
				 labels: labels_list ,
				 datasets: 
					xy
					    },
					    options: {
					        scales: {
					            yAxes: [{
					                ticks: {
					                    beginAtZero:true
		                }
		            }],
		            xAxes: [{
					                ticks: {
					                    beginAtZero:true
		        }
		    }],
		}}});
	}


var procurement = {{ site.data.proc_type2 | jsonify}}

//console.log(unique_vals(procurement));

//catMonth_array = make_array(procurement,'categoryMonth');

//frequency_array = make_array(procurement, 'freqCat');

labels = unique_vals(procurement);

xy = make_xy(procurement, 'category', 'freqCat', 'city', 'months', labels, colors);

console.log(xy);


//color_array = make_color_array(procurement,'city');


create_bubble_chart(xy, colors, 'myChart2', labels);
