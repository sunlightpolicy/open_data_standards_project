---

---

function Data_obj(label,data,backgroundColor,borderColor,borderWidth){
	this.type = 'bubble';
	this.label = city;
	this.data = data;
	this.backgroundColor = backgroundColor;
	this.borderColor = transparent;
	this.borderWidth = borderWidth;
}



function create_bubble_chart(procurement, colors, element, labels){
		var ctx = document.getElementById(element);


		var myChart = new Chart(ctx, {
			data:{
				labels: labels,
				 datasets: 
					procurement.map(function(i){
					  return new Data_obj(i[0],Object.values(i).slice(1,13),
					           	['rgba(0,0,0,0.2)'],
					            [i[13]],1);})
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

console.log(procurement);
//create_bubble_chart(procurement, colors, 'myChart');
