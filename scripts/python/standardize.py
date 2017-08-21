import bs4
import urllib
import urllib3
import re
import pandas as pd
import numpy as np
import io
#import geocoder
import geopandas as gp
import csv 
import json
import matplotlib
import seaborn
from matplotlib import pyplot as plt


def scrape_datasets(main_url):
	pattern_ev = r'.+(?=/browse)'
	url_pre = re.findall(pattern_ev, main_url)[0]

	pm = urllib3.PoolManager()

	soup = bs4.BeautifulSoup(make_html(pm,main_url),'html.parser')

	all_results = [url_pre+x['href'] for x in soup.find_all('a','pageLink') if x['href']]

	return [[x['href'].strip(url_pre) for x in bs4.BeautifulSoup(make_html(pm,results),'html.parser').find_all('a','browse2-result-name-link') if x['href']] for results in all_results]

def print_nums(df, name_col):
    for name in df[name_col].unique():
        print(name+': '+str(len(df[df[name_col]==name])))
        

def make_one_column(datasets, name):
    return pd.concat([pd.Series(d) for d in datasets]).to_frame().rename(columns={0:name})


def from_txt(f_name,pattern,name):
    f = open(f_name)
    items = []
    for line in f.readlines():
        topic = re.findall(pattern, line)
        if len(topic) != 0:
            items.append(topic)
    return pd.DataFrame(items).rename(columns={0:name})


def make_html(pm,url):
	return pm.urlopen(url= url, method="GET").data

def basic_scrape(url, tag_type1, tag_type2, name):
    pm = urllib3.PoolManager()
    soup = bs4.BeautifulSoup(make_html(pm,url),'html.parser')
    data = []
    for s in soup.find_all(tag_type1):
        dataset = s.find_all(tag_type2)
        if len(dataset):
            data.append(dataset[0].string)
    return pd.DataFrame(data).rename(columns={0:name})

def data_to_csv(df,v):
    return df.to_csv(v)


def check_na(df):
    df_lng = pd.melt(df)
    null_vars = df_lng.value.isnull()
    return pd.crosstab(df_lng.variable, null_vars)

def get_lat_long(series, coord):
    if coord == 'latitude':
        return series['coordinates'][1] 
    return series['coordinates'][0]

def lat_long_from_loc(series,coord):
    if type(series) == float:
       return None
    if coord == 'latitude':
        return series['latitude']
    return series['longitude']

def get_zip(s):
    pattern = r'(?<![A-Z])[\d]{5}' 
    return re.search(pattern, s).group()

def strip_address(s):
    return s[:-6]

def get_soup(url):
    pm = urllib3.PoolManager()
    html = pm.urlopen(url= url, method="GET").data
    return bs4.BeautifulSoup(make_html(pm,url),'html.parser')

def camel_to_snake(column_name):
    """
    converts a string that is camelCase into snake_case
    Example:
        print camel_to_snake("javaLovesCamelCase")
        > java_loves_camel_case
    See Also:
        http://stackoverflow.com/questions/1175208/elegant-python-function-to-convert-camelcase-to-camel-case
    """
    
    if ' ' in column_name:
    	if '.' in column_name:
    		return re.sub('(.)([A-Z][a-z]+)', r'\1\2', column_name).lower().replace(' ','_').replace('.','')
    	return re.sub('(.)([A-Z][a-z]+)', r'\1\2', column_name).lower().replace(' ','_')
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', column_name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def combine_cols(series):
    if type(series[1]) != float:
        return ' '.join(series)
    else:
        return series[0]

def read(file_name):
    '''
    This was to experiment with uploading a csv using python csv library.
    Needless to say it is pretty slow.
    '''
    df = pd.DataFrame()

    pattern = r'[(?!=.)]([a-z]*)'
    file_type = re.findall(pattern, file_name)[0]

    assert file_type == 'csv'
    with open(file_name, 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for index,row in enumerate(reader):
            print(row)
            df = pd.concat([df,pd.DataFrame(row).transpose()])

def parse_df_dict(series):
    return pd.DataFrame([[series.values()]], columns = [list(series.keys())])

def ckan_to_df(soup):
    new_dict ={}
    for d in json.loads(str(soup))['result']['records']:
        for key in  json.loads(str(soup))['result']['records'][0].keys():
            if key in new_dict:
                new_dict[key].append(d[key])
            else: 
                new_dict[key]=[d[key]]
    return pd.DataFrame(new_dict)

def make_dfs(file_name):
    permit_dfs = {}
    rename_dict = {'lat':'latitude',
                            'latitudeperm':'latitude',
                            'lon':'longitude',
                            'longitudeperm':'longitude',
                            'originalcity':'city',
                            'originalstate':'state',
                            'totalfees':'fee',
                            'permittypedescr': 'permittype',
                            'statuscurrent':'status'}
    with open(file_name, 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for index,row in enumerate(reader):
            url = row[1]
            if index == 0:
                continue
            elif 'json' in url:
                df = soda_loop(url)
            elif 'csv' in url:
                df = pd.read_csv(url)
            elif 'civicdata' in url:
                df = ckan_to_df(get_soup(url))
            else:
                return 'file in unknown format'

            if 'boston' in url:
                df['latitude'] = df.location.apply(lambda x: lat_long_from_loc(x,'latitude'))
                df['longitude'] = df.location.apply(lambda x: lat_long_from_loc(x,'longitude'))

            df = df.rename(columns={ d:d.lower().replace('_','') for d in df.columns})

            print(list(row)+[len(df.columns)])

            permit_dfs[row[0]]=df.rename(columns = rename_dict)

    return permit_dfs

def combine(series):
    print(series)
    return ' '.join([series[0].upper(),series[1]])

def get_same_cols(dfs):
    headers_dict= {} 
    dataset_dict = {}

    for key,vals in dfs.items():
        for col in vals.columns:
            lowered = col.lower().replace('_','')
            if lowered in headers_dict:
                headers_dict[lowered]['count']+=1
                headers_dict[lowered]['datasets'].append(key)
                headers_dict[lowered]['missing'].remove(key)
            else:
                headers_dict[lowered] = {'count':1,'datasets':[key],'missing': ['Almeda',
                                                                                 'Bernalillo',
                                                                                 'Boston',
                                                                                 'Chattanooga',
                                                                                 'Deschutes',
                                                                                 'Raleigh',
                                                                                 'San Diego',
                                                                                 'Seattle',
                                                                                 'Tampa']}
                headers_dict[lowered]['missing'].remove(key)

    return headers_dict, pd.DataFrame(headers_dict).transpose().sort_values(by=['count'], ascending=False)

def soda_loop(url):
    '''
    This function takes an api key of a version of the identified 311 service call dataset saved in socrata
    and loops through the dataset until all the data is retrieved
    
    Input:
        url - chicago data portal api endpoint
    Output:
        pandas database
    '''
    offset_num = 0
    df = pd.DataFrame()
    count = 0
    use_url = url
    while len(pd.read_json(use_url)):

        df = pd.concat([df,pd.read_json(use_url)])
        
        use_url = url
  
        offset_num+=10000
   
        use_url=url+'&$offset={}'.format(offset_num)
                
        count+=1
        
        print(use_url)
        
    return df

def plot_confusion_matrix(data, col_name, labels, model_name):
    '''
    Given a pandas dataframe with a confusion confusion_matrix
    and a list of axis lables plot the results
    '''
    sn.set(font_scale=1.4)#for label size

    xticks =  labels
    yticks =  labels
    ax = plt.axes()
    sn.heatmap(data, annot=True,annot_kws={"size": 16}, linewidths=.5, xticklabels = xticks,  
              yticklabels = yticks, fmt = '')
    ax.set_title('Confusion Matrix for' + ' ' + model_name + col_name)

def combine_str_int(series):
    return ' '.join([series[0],str(series[1])])

def combine(series):
    return ' '.join([series[0],series[1]])


def semantic_compare(df, state_list):
    sem_dict = {}
    for row in df.iterrows():
        print([type(e) for e in row[1]], row)
        if row[1][0] in sem_dict:
            sem_dict[row[1][1]]['count'] +=1
            sem_dict[row[1][1]]['state'].append(row[0])
            sem_dict[row[1][1]]['missing'].remove(key)
        else:
            sem_dict[row[1][1]] = {'states':[row[1][0]],'count':1,'missing': state_list}
            sem_dict[row[1][1]]['missing'].remove(key)
    return sem_dict

permittypemapped_list = ['Building',
                        'Demolition',
                        'Electrical',
                        'Mechanical',
                        'Plumbing',
                        'Roof',
                        'Fence',
                        'Grading',
                        'Pool',
                        'Spa']

def get_permittypemapped(series,permittypemapped_list):
    #print(series)
    if type(series) == float:
        return float('nan')
    for pm_type in permittypemapped_list:
        pm_type_up = pm_type.upper()
        if pm_type_up in series.upper():
            return pm_type_up

def not_null_then_upper(series):
    if series == None:
        return float('nan')
    elif type(series) == float:
        return float('nan')
    else:
        return series.upper()

def add_year_month_day_dfs(dict_of_dfs, date_col, date_pre):
    for jurisdiction, df in dict_of_dfs.items():
        df[date_pre+'Year']= df[date_col].apply(lambda x: pd.to_datetime(x).year)
        df[date_pre+'Month']= df[date_col].apply(lambda x: pd.to_datetime(x).month)
        df[date_pre+'Day']= df[date_col].apply(lambda x: pd.to_datetime(x).dayofweek)

def add_year_month_day_df(df, date_col, date_pre):
    df[date_pre+'Year']= df[date_col].apply(lambda x: pd.to_datetime(x).year)
    df[date_pre+'Month']= df[date_col].apply(lambda x: pd.to_datetime(x).month)
    df[date_pre+'Day']= df[date_col].apply(lambda x: pd.to_datetime(x).dayofweek)

def make_barh_dfs(dict_of_dfs, month_col, item_col, pro_title):
    for jurisdiction, df in dict_of_dfs.items():
        pd.crosstab(df[month_col],df[item_col]).plot.barh(stacked=True, title=pro_title+' '+jurisdiction+' and month', figsize=(12,12))

def make_area_stacked_dfs(dict_of_dfs, month_col, item_col, pro_title):
    for jurisdiction, df in dict_of_dfs.items():
        pd.crosstab(df[month_col],df[item_col]).plot.area(stacked=True, title=pro_title+' '+jurisdiction+' and month', figsize=(12,12))

def make_area_stacked_df(df, month_col, item_col, pro_title):
    pd.crosstab(df[month_col],df[item_col]).plot.area(stacked=True, title=pro_title+' '+item_col+' and '+ month_col, figsize=(12,12))

def make_barh_df(df, month_col, item_col, pro_title):
    pd.crosstab(df[month_col],df[item_col]).plot.barh(stacked=True, title=pro_title+' '+item_col+' and '+ month_col, figsize=(12,12))

def pick_dfs(permit_dfs):
    for city,df in permit_dfs.items():
        df.to_pickle('_data/pickles'+city+'.p')
        
def csv_dfs(permit_dfs):
    for city,df in permit_dfs.items():
        df.to_csv('../_data/blds_csvs/cities/'+city+'.csv')

    #df is the permittype specific df
def make_tally_list(df,permittype,permit_col, date_col, date_kind):

    if date_kind == 'month':
        tallies = [0]*12
    else:
        tallies = [0]*int(df[date_col].max()-df[date_col].min() + 1)

    tallies.insert(0,permittype)
    df_by_permittype= df[df[permit_col]==permittype]

    if date_kind == 'month':
        s_range_min = 1
        s_range_max = 13
    else:
        s_range_min = int(df[date_col].min())-2000
        s_range_max = int(df[date_col].max()+1)-2000

    for m in range(s_range_min,s_range_max):

        if date_kind == 'month':
            real_date = m
        else:
            real_date = float(m+2000)

        if real_date in set(df_by_permittype[date_col].values):

            tallies[m+1] = int(df_by_permittype[df_by_permittype[date_col] == real_date].tally)

    if date_kind == 'year':
        return tallies, s_range_min, s_range_max

    return tallies

colors = ['rgba(255,99,132,1)',
         'rgba(54, 162, 235, 1)',
         'rgba(255, 206, 86, 1)',
         'rgba(75, 192, 192, 1)',
         'rgba(153, 102, 255, 1)',
         'rgba(255, 159, 64, 1)',
         'rgba(255, 51, 153, 1)',
         'rgba(0, 204, 204, 1)',
         'rgba(0, 0, 153, 1)']

def tallies_by_permit(df,permit_col, date_col, colors, date_kind):
    tally_permit_list = []
    for i, p_type in enumerate(set(df[permit_col].values)):

        if date_kind == 'year':
            pt_list, s_range_min, s_range_max = make_tally_list(df, p_type, permit_col,date_col, date_kind)
            pt_list += [colors[i]]
            pt_list.append([list(range(s_range_min, s_range_max)),'year'])
        else:
            pt_list = make_tally_list(df, p_type, permit_col,date_col, date_kind)+[colors[i]]

        tally_permit_list.append(pt_list)

    return tally_permit_list