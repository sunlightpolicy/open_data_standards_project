# open_data_standards_project

Many methods of exploration and visualizations were experimented with to create "the value of open data standards project."  Ultimately, we decided to present some simple spatial plots and graphs on a portfolio-style webpage to give people an idea of what can be created with open data sets that follow or can be fit into data standards.

The general outline of the process that was used to create the visualizations available on the Open Data Standards Project site is as follows:

	1) Download or make an API call for the appropriate dataset based on the standard (and the cities that follow that standard or in the case of procurement have any data at all) you wish to use for any of the given example project types and then load it into a pandas data frame.

	2) This is where the instructions will go down three different paths based on the standard example project type you wish to use.
		a) Business Licenses Data
			i) Follow through the example and instructions of the business_licenses.ipynb (utilizes the functions in the scripts/python/standardize.py scripts)
			ii) Run the assets/js/business_license.js script to produce the spatial plot you will need to provide the correct latitude and longitude coordinates based on the city or area you are trying to share with the map.
		b) Business Permit Data
			i)Follow through the blds_notebook.pynb (this actually helps you create csvs/dataframes for 8 [and 1 location that is missing coordinates for spatial representations] cities/counties with blds datasets and an aggergate of each of the datasets combined into one standardized dataset with the information of each city/county)
			ii) To create the map and graph visualizations like the ones provided for San Diego County and Chattanooga you would create a script or notebook file that mimics the process of the '_add_dates.ipynb's.
		c) Procurement Data
			i) Follow through the procurement.ipynb to make the appropriate csvs for the js script to create the bubbleplot visible on the open data standards page
			ii) run the assets/js/procurement.js script to create the bubbleplot
	
	Not depicted on the open_data_standards_project webpage is a script for creating streamgraphs in R of blds data
		1) This would also be created by following the blds_notebook.pynb instructions and then 
		2) utilizing the streamgraph.R script