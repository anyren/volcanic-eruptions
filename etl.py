import requests 
from pprint import pprint
import datetime

import pymongo

# Connecting to MongoDB
class Connect:

    def __init__(self):
        self.conn = 'mongodb://localhost:27017'
        self.client = pymongo.MongoClient(self.conn)

        self.db = self.client.volcanoDB
        self.docu = self.db.volcano_data

# Extracting the data from the API
def extract():
    
    maxYear=datetime.datetime.today().year
    minYear=2000
    url = f"https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"

    # Make request and store response
    response = requests.get(url)
    
    response_json = response.json()
    result = map(transform, response_json["items"])
    return result

# Transforming the data
def transform(items):  
    
    try: 
        month = items['month']
    except:
        month = None

    try:
        day = items['day']
    except:
         day = None

    try:
        vei = items['vei']
    except:
        vei = "Unknown"

    try:
        deaths = items['deaths']
    except:
        deaths = 0
        
    return {
        "id":items["id"], 
        "date":f"{month}/{day}/{items['year']}", 
        "year":items['year'],
        "name": items["name"],
        "country":items["country"],
        "latitude":items["latitude"], 
        "longitude":items["longitude"],
        "morphology":items["morphology"], 
        "deaths":deaths, 
         "vei":vei, 
    }

# Loading the data into MongoDB
def load():
    document = Connect()
    document.db.volcano_data.drop()
    result = extract()
    document.docu.insert_many(list(result))

# Fetch the data from MongoDB
def fetch():
    document = Connect()
    volcanos = document.db.volcano_data.find({},{'_id':0})

    # See the data in collection
    data_dict = {'items':[]}
    for volcano in volcanos:
        data_dict['items'].append(volcano)

    return data_dict