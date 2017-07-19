import bs4
import urllib
import urllib3
import re
import pandas as pd
import numpy as np
import io
import geocoder
import geopandas as gp

def scrape_datasets(main_url):
	pattern_ev = r'.+(?=/browse)'
	url_pre = re.findall(pattern_ev, main_url)[0]

	pm = urllib3.PoolManager()

	soup = bs4.BeautifulSoup(make_html(pm,main_url),'html.parser')

	all_results = [url_pre+x['href'] for x in soup.find_all('a','pageLink') if x['href']]

	return [[x['href'].strip(url_pre) for x in bs4.BeautifulSoup(make_html(pm,results),'html.parser').find_all('a','browse2-result-name-link') if x['href']] for results in all_results]


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

