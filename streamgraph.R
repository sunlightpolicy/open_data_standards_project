#Create streamgraph
library(readr)
library(dplyr)
library(streamgraph)

setwd('Documents/open_data_standards_project/')
# filename to import; configure your file/path here
ImportFileName <- "_data/standardized_blds.csv"

BulkBLDS_Imported <- read_csv(ImportFileName)

BulkBLDS_Imported <- BulkBLDS_Imported %>% 
  mutate(issued_datetime = parse_datetime(issueddate, format = "%Y-%m-%d %H:%M:%S"))

range_end <- as.Date(paste(format(Sys.Date(), "%Y-%m"), "-01", sep="")) - 1
range_start <- range_end - 365

BulkBLDS_Imported_Last365Days <- BulkBLDS_Imported %>%
  select(issueddate, permittypemapped) %>%
  mutate_each(issueddate, funs = "as.Date") %>%
  filter(issueddate >= range_start & issueddate <= range_end) %>%
  mutate(year = format(issueddate, "%Y"), year_month = format(issueddate, "%Y-%B"), day=format(issueddate, "%d"), complete_date=format(issueddate, "%Y-%B-%d")) %>%
  mutate(first_of_month = as.Date(paste(year_month, "-01", sep=""),"%Y-%B-%d "))

BulkBLDS_Imported_of_TopTenPermitTypes <- BulkBLDS_Imported_Last365Days %>%
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

BulkBLDS_YearAggregation_of_TopTenPermitTypes %>%
  streamgraph("permittypemapped","n","year", offset="zero") %>%
  sg_axis_x(tick_format = "%Y") %>%
  sg_axis_y(tick_count = 0)

#Do this by city/state

#credit Andrew Nicklin https://gist.github.com/technickle/67c3cebb687a3b370d0ea3435012b941#file-streamgraph-open311-bulk-data-r