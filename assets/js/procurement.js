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

//Look up the population of the city to display the size of the city at scale
Washington_DC = 681,170*.00002
Miami = 453,579*00002
Baton_Rouge = 227,715*.00002 

function make_xy(file, field1, field2, field3, field4, labels, colors){
	new_array = []
	label_array=[]
	for(i=0;i< procurement.length;i++){

		if(procurement[i][field3] == 'Washington DC'){
			r = Washington_DC
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
			r = Miami
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
			r = Baton_Rouge
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

	
		new_array.push({ label: procurement[i][field3].concat(' ').concat(procurement[i][field1]),
		 backgroundColor:color,
		  data:[{x:procurement[i][field4],
		  y:procurement[i][field2], 
		  r: r}]});
	}
	return new_array;
}

function unique_vals(array,field1){
	unique_list = [];
	array.map(function(row){
		unique_list.push(row[field1]);})

	return Array.from(new Set(unique_list));
}

function make_array(file, field){
	new_array = [];
		file.map(function(row){
			new_array.push(row[field]);})
	return new_array;
}



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
					        legend: {
						            display: false
						         },
						    tooltips: {
						            enabled: true
						         },
						    scales: {
					            yAxes: [{
					                ticks: {
					                    beginAtZero:true
						                },
						             scaleLabel: {
								        display: true,
								        labelString: 'Percentage of Procurement Contracts'
      									}
						            }],
			            		xAxes: [{
						                ticks: {
						                    beginAtZero:true
		        },
						             scaleLabel: {
								        display: true,
								        labelString: 'Month'
      									}
		    }],
		}}});
	}


var procurement = {{ site.data.proc_type2 | jsonify}}

//console.log(unique_vals(procurement));

//catMonth_array = make_array(procurement,'categoryMonth');

//frequency_array = make_array(procurement, 'freqCat');

labels = unique_vals(procurement,'months');

xy = make_xy(procurement, 'category', 'freqCat', 'city', 'months', labels, colors);

// console.log(xy);


//color_array = make_color_array(procurement,'city');


create_bubble_chart(xy, colors, 'myChart2', labels);
