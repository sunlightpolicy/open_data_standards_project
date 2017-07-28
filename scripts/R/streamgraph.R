#Create streamgraph
library(readr)
library(dplyr)
library(streamgraph)
library(webshot)


setwd('../../')
# filename to import; configure your file/path here
ImportFileName <- "_data/standardized_blds.csv"

BulkBLDS_Imported <- read_csv(ImportFileName)


BulkBLDS_Imported <- BulkBLDS_Imported %>% 
  mutate(issued_datetime = parse_datetime(issueddate, format = "%Y-%m-%d %H:%M:%S"))

BulkBLDS_Imported['permittypemapped'][is.na(BulkBLDS_Imported['permittypemapped'])] <- 'UNKNOWN'

range_end <- as.Date(paste(format(Sys.Date(), "%Y-%m"), "-01", sep="")) - 1
range_start <- range_end - 365


BulkBLDS_Imported_Last365Days <- BulkBLDS_Imported %>%
  select(issueddate, permittypemapped) %>%
  mutate_each(issueddate, funs = "as.Date") %>%
  filter(issueddate >= range_start & issueddate <= range_end) %>%
  mutate(year = format(issueddate, "%Y"), year_month = format(issueddate, "%Y-%B"), day=format(issueddate, "%d"), complete_date=format(issueddate, "%Y-%B-%d")) %>%
  mutate(first_of_month = as.Date(paste(year_month, "-01", sep=""),"%Y-%B-%d "))


BulkBLDS_Imported_TopTenPermitTypes <- BulkBLDS_Imported_Last365Days %>%
  select(permittypemapped) %>%
  group_by(permittypemapped) %>%
  tally(sort=TRUE) %>%
  top_n(10)


BulkBLDS_Last365Days_of_TopTenPermitTypes <- BulkBLDS_Imported_Last365Days %>%
  filter(permittypemapped %in% BulkBLDS_Imported_TopTenPermitTypes$permittypemapped)


BulkBLDS_MonthAggregation_of_TopTenPermitTypes <-BulkBLDS_Last365Days_of_TopTenPermitTypes %>%
  group_by(permittypemapped, first_of_month) %>%
  tally()


BulkBLDS_YearAggregation_of_TopTenPermitTypes <-BulkBLDS_Last365Days_of_TopTenPermitTypes %>%
  group_by(permittypemapped, year) %>%
  tally()

BulkBLDS_MonthAggregation_of_TopTenPermitTypes %>%
  streamgraph("permittypemapped","n","first_of_month", offset="zero") %>%
  sg_axis_x(tick_format = "%b") %>%
  sg_axis_y(tick_count = 0)

BulkBLDS_MonthAggregation_of_TopTenPermitTypes %>%
  streamgraph("permittypemapped","n","first_of_month") %>%
  sg_axis_x(tick_format = "%b") %>%
  sg_axis_y(tick_count = 0)

BulkBLDS_YearAggregation_of_TopTenPermitTypes %>%
  streamgraph("permittypemapped","n","year", offset="zero") %>%
  sg_axis_x(tick_format = "%Y") %>%
  sg_axis_y(tick_count = 0)


last_355 <- function(df, date_col, tally_col){
  df_365 <- df %>%
    select_(.dots = c(date_col, tally_col)) %>%
    mutate_at(date_col, .funs="as.Date") %>%
    filter_(issueddate >= range_start & issueddate <= range_end) %>%
    mutate_(year = format(.data = c(date_col), "%Y"), year_month = format(c(date_col), "%Y-%B"), day=format(c(date_col), "%d"), complete_date=format(c(date_col), "%Y-%B-%d")) %>%
    mutate_(first_of_month = as.Date(paste(data. = c('year_month'), "-01", sep=""),"%Y-%B-%d "))
  df_365
} 

top_ten_type <- function(df,tally_col){
  df_top_ten <-df %>%
    select_(tally_col) %>%
    group_by_(tally_col) %>%
    tally(sort=TRUE) %>%
    top_n(10)
  df_top_ten
}

top_ten_of_365 <- function(df_top_ten, df_365, tally_col){
  df_Last365Days_of_TopTenPermitTypes <- df_365 %>%
    filter(t %in% df_top_ten[tally_col])
  df_Last365Days_of_TopTenPermitTypes
}

month_agg_top_ten <- function(df, tally_col, first_of_month){
  df_monthAgg <- df %>%
    group_by_(.dots = c(tally_col,first_of_month)) %>%
    tally()
  df_monthAgg
}

year_agg_top_ten <- function(df, tally_col, year){
  df_yearAgg <- df %>%
    group_by_(.dots = c(tally_col,year)) %>%
    tally()
  df_yearAgg
}

make_streamgraph <- function(df,tally_col,count_by_col,x_tick_format,offset="zero"){
  df %>%
    streamgraph(tally_col,"n",count_by_col, offset=offset) %>%
    sg_axis_x(tick_format = x_tick_format) %>%
    sg_axis_y(tick_count = 0)
}
#Do this by city/state
if(FALSE){
  states<- unique(BulkBLDS_Imported$state)
  range_end <- as.Date(paste(format(Sys.Date(), "%Y-%m"), "-01", sep="")) - 1
  range_start <- range_end - 365
  for(state in states){
    stateBLDS_Imported <- BulkBLDS_Imported[state==state]

    
    stateBLDS_Imported['state'][is.na(stateBLDS_Imported['state'])] <- 'TN'

    stateBLDS_Imported[is.na(stateBLDS_Imported)] <- 'UNKNOWN'
    
    
    stateBLDS_Imported['permittypemapped'][is.na(stateBLDS_Imported['permittypemapped'])] <- 'UNKNOWN'
    
    state_df = Filter(function(x)!all(is.na(x)), stateBLDS_Imported)
    
    stateBLDS_Imported_Last365Days <- state_df %>%
      select(issueddate, permittypemapped) %>%
      mutate_each(issueddate, funs = "as.Date") %>%
      filter(issueddate >= range_start & issueddate <= range_end) %>%
      mutate(year = format(issueddate, "%Y"), year_month = format(issueddate, "%Y-%B"), day=format(issueddate, "%d"), complete_date=format(issueddate, "%Y-%B-%d")) %>%
      mutate(first_of_month = as.Date(paste(year_month, "-01", sep=""),"%Y-%B-%d "))
    
    
    stateBLDS_Imported_TopTenPermitTypes <- stateBLDS_Imported_Last365Days %>% 
      select(permittypemapped) %>%
      group_by(permittypemapped) %>%
      tally(sort=TRUE) %>%
      top_n(10)
    
    
    stateBLDS_Last365Days_of_TopTenPermitTypes <- stateBLDS_Imported_Last365Days %>%
      filter(permittypemapped %in% stateBLDS_Imported_TopTenPermitTypes$permittypemapped)
    
    
    stateBLDS_MonthAggregation_of_TopTenPermitTypes <-stateBLDS_Last365Days_of_TopTenPermitTypes %>%
      group_by(permittypemapped, first_of_month) %>%
      tally()
    
    
    #stateBLDS_YearAggregation_of_TopTenPermitTypes <-stateBLDS_Last365Days_of_TopTenPermitTypes %>%
    #  group_by(permittypemapped, year) %>%
    #  tally()
    
    stateBLDS_MonthAggregation_of_TopTenPermitTypes[row(stateBLDS_MonthAggregation_of_TopTenPermitTypes) == col(stateBLDS_MonthAggregation_of_TopTenPermitTypes)] <-1
    
    stateBLDS_MonthAggregation_of_TopTenPermitTypes %>%
      streamgraph("permittypemapped","n","first_of_month", offset="zero") %>%
      sg_axis_x(tick_format = "%b") %>%
      sg_axis_y(tick_count = 0)
    
    stateBLDS_MonthAggregation_of_TopTenPermitTypes %>%
      streamgraph("permittypemapped","n","first_of_month") %>%
      sg_axis_x(tick_format = "%b") %>%
      sg_axis_y(tick_count = 0)
  }
}

make_streamgraph_jurisdiction<- function(filename){

    # Read data in

  range_end <- as.Date(paste(format(Sys.Date(), "%Y-%m"), "-01", sep="")) - 1
  range_start <- range_end - 365

  df <- read.csv(filename)

  jurisdictionBLDS_Imported <- df %>% 
    mutate(issued_datetime = parse_datetime(issueddate, format = "%Y-%m-%d %H:%M:%S"))
  
  jurisdictionBLDS_Imported[is.na(jurisdictionBLDS_Imported)] <- 'UNKNOWN'
  
  #jurisdictionBLDS_df = Filter(function(x)!all(is.na(x)), jurisdictionBLDS_Imported)
  
  jurisdictionBLDS_Imported_Last365Days <- jurisdictionBLDS_df %>%
    select(issueddate, permittypemapped) %>%
    mutate_each(issueddate, funs = "as.Date") %>%
    filter(issueddate >= range_start & issueddate <= range_end) %>%
    mutate(year = format(issueddate, "%Y"), year_month = format(issueddate, "%Y-%B"), day=format(issueddate, "%d"), complete_date=format(issueddate, "%Y-%B-%d")) %>%
    mutate(first_of_month = as.Date(paste(year_month, "-01", sep=""),"%Y-%B-%d "))
  
  
  jurisdictionBLDS_Imported_TopTenPermitTypes <- jurisdictionBLDS_Imported_Last365Days %>% 
    select(permittypemapped) %>%
    group_by(permittypemapped) %>%
    tally(sort=TRUE) %>%
    top_n(10)
  
  
  jurisdictionBLDS_Last365Days_of_TopTenPermitTypes <- jurisdictionBLDS_Imported_Last365Days %>%
    filter(permittypemapped %in% jurisdictionBLDS_Imported_TopTenPermitTypes$permittypemapped)
  
  
  jurisdictionBLDS_MonthAggregation_of_TopTenPermitTypes <-jurisdictionBLDS_Last365Days_of_TopTenPermitTypes %>%
    group_by(permittypemapped, first_of_month) %>%
    tally()
  
  
  #stateBLDS_YearAggregation_of_TopTenPermitTypes <-stateBLDS_Last365Days_of_TopTenPermitTypes %>%
  #  group_by(permittypemapped, year) %>%
  #  tally()
  
  #stateBLDS_MonthAggregation_of_TopTenPermitTypes[row(stateBLDS_MonthAggregation_of_TopTenPermitTypes) == col(stateBLDS_MonthAggregation_of_TopTenPermitTypes)] <-1
  
  jurisdictionBLDS_MonthAggregation_of_TopTenPermitTypes %>%
    streamgraph("permittypemapped","n","first_of_month", offset="zero") %>%
    sg_axis_x(tick_format = "%b") %>%
    sg_axis_y(tick_count = 0)
  
  jurisdictionBLDS_MonthAggregation_of_TopTenPermitTypes %>%
    streamgraph("permittypemapped","n","first_of_month") %>%
    sg_axis_x(tick_format = "%b") %>%
    sg_axis_y(tick_count = 0)


}

#credit Andrew Nicklin https://gist.github.com/technickle/67c3cebb687a3b370d0ea3435012b941#file-streamgraph-open311-bulk-data-r