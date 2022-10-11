from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import requests
import etl

#############################################################
# BEGIN FLASK ROUTING
#############################################################

app = Flask(__name__)

#############################################################
# Index endpoint
#############################################################

@app.route("/")
def index():
    etl.load()
    return render_template("index.html")
            
#############################################################
# second endpoint
#############################################################

@app.route("/secondendpoint")
def secondendpoint():

    url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"
    response = requests.get(url)
    json_object = response.json()
    the_dict = dict(json_object)  
    the_list = the_dict["items"]

    return render_template("secondendpoint.html", the_list=the_list)
    
#############################################################
# third endpoint
#############################################################


@app.route("/thirdendpoint")
def thirdendpoint():

    url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"
    response = requests.get(url)
    json_object = response.json()
    the_dict = dict(json_object)    
    the_list = the_dict["items"]
   
    return render_template("thirdendpoint.html", the_list=the_list)

#############################################################
# fourth endpoint
#############################################################

@app.route("/fourthendpoint")
def fourthendpoint():

    url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"
    response = requests.get(url)
    json_object = response.json()
    the_dict = dict(json_object)   
    the_list = the_dict["items"]
    
    return render_template("fourthendpoint.html", the_list=the_list)

@app.route("/readmongodb")
def ReadMongoDB():
    data = etl.fetch()
    return jsonify(data)

# @app.route("/billmorphdata")
# def billMorphData():
#     data = etl.fetch()

#     # pandas data transformation 


#     return jsonify(data)

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/volcano")
def ServeVolcano():
   return render_template("volcano.html")

@app.route("/year")
def ServeYear():
   return render_template("year.html")
    
if __name__ == "__main__":
    app.run(debug=True)

#############################################################
# END FLASK ROUTING
#############################################################

