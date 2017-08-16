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

function Data_obj(label, x,y, colors){
	this.type = 'bubble';
	this.label = label;
	this.x = x;
	this.y = y;
	if(this.label == 'Washington DC'){
		this.backgroundColor = colors[0];
		this.borderColor = 'transparent';
	}
	else if(this.label == 'Miami'){
		this.backgroundColor = colors[1];
		this.borderColor = 'transparent';
	}
	else{
		this.backgroundColor = colors[2];
		this.borderColor = 'transparent';
	}
}

function unique_vals(procurement){
	unique_list = [];
	procurement.map(function(row){
		console.log(row['categoryMonth']);
		unique_list.push(row['categoryMonth']);})

	return Array.from(new Set(unique_list));
}



function create_bubble_chart(procurement, colors, element, labels){
		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			data:{
				 labels: labels,
				 datasets: 
					procurement.map(function(i){
					  console.log(i);
					  return new Data_obj(i[2],i[0],i[1],
					           	colors);})
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

console.log(unique_vals(procurement));

create_bubble_chart(procurement, colors, 'myChart2', unique_vals(procurement));
