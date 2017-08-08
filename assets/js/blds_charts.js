---

---

function create_line_chart(permit_dict, element,document){
		var Chart = require('node_modules/chartjs/chart.js');
		var ctx = document.getElementById(element);
		var myChart = new Chart(ctx, {
			type : 'line',
			data:{
				labels: permit_dict.keys(),
				datasets: [{
					label: 'Buildling Permits by type in San Diego by Month',
					data: permit_dict.values(),
					backgroundColor: [
					                'rgba(255, 99, 132, 0.2)',
					                'rgba(54, 162, 235, 0.2)',
					                'rgba(255, 206, 86, 0.2)',
					                'rgba(75, 192, 192, 0.2)',
					                'rgba(153, 102, 255, 0.2)',
					                'rgba(255, 159, 64, 0.2)'
					            ],
					            borderColor: [
					                'rgba(255,99,132,1)',
					                'rgba(54, 162, 235, 1)',
					                'rgba(255, 206, 86, 1)',
					                'rgba(75, 192, 192, 1)',
					                'rgba(153, 102, 255, 1)',
					                'rgba(255, 159, 64, 1)'
					            ],
					            borderWidth: 1
					        }]
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