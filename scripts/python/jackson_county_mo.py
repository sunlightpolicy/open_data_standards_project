from standardize import *

#---------------Kansas Standardization--------------------------#

kc_lic = pd.read_json('https://data.kcmo.org/resource/rmk6-sicm.json')

#there are 96 points with no location_1 information

kc_lic = kc_lic[kc_lic.location_1.notnull()]

kc_lic['latitude']= kc_lic.location_1.apply(lambda x: get_lat_long(x,'latitude'))

kc_lic['longitude']= kc_lic.location_1.apply(lambda x: get_lat_long(x,'longitude'))

kc_lic = kc_lic.rename(columns={'location_1_location':'address'})[['business_dba','business_type','address','latitude','longitude']]

kc_lic['zip_code'] = kc_lic.address.apply(lambda x: get_zip(x))

kc_lic['address'] = kc_lic.address.apply(lambda x: strip_address(x))

kc_lic['city'] = 'Kansas City'

#---------------Independence Standardization--------------------------#

ind_lic = pd.read_json("https://www.ci.independence.mo.us/Open/businesslicense/LicenseJSON")

ind_lic = ind_lic[ind_lic.Lat != 0].rename(columns={'Lat':'latitude','Long':'longitude', 'location_1_location'})

ind_lic = ind_lic.rename(columns = {'BusinessName':'business_dba', 
	'BusinessDescription':'business_type',
	'Address':'address',
	'City':'city',
	'ZIPcode':'zip_code',
	'Lat':'latitude',
	'Long':'longitude', 
	'location_1_location'})[['BusinessName','BusinessDescription','Address','City','ZIPcode','latitude','longitude']]


#---------------Joining the datasets--------------------------#

jackson_lic = pd.concat([kc_lic,ind_lic], axis =0)

data_to_csv(jackson_lic,'jackson_lic.csv')