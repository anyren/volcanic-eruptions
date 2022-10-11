from flask import Flask, render_template, jsonify
import pandas as pd
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

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/volcano")
def ServeVolcano():
   return render_template("volcano.html")

@app.route("/year")
def ServeYear():
   return render_template("year.html")

#############################################################

@app.route("/readmongodb")
def ReadMongoDB():
    data = etl.fetch()
    return jsonify(data)

@app.route("/aggregate1")
def aggregate1():
    the_json = (requests.get("https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000")).json()
    df = pd.DataFrame(data=the_json["items"])
    df = df[["id","name","country","year","morphology","vei","deathsTotal",\
             "missingTotal","injuriesTotal","damageMillionsDollarsTotal",\
             "housesDestroyedTotal"]]
    
    volcanos_by_year = df.groupby("year")["id"].count().to_dict()
    
    return jsonify(volcanos_by_year)     

@app.route("/aggregate2")
def aggregate2():
    the_json = (requests.get("https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000")).json()
    df = pd.DataFrame(data=the_json["items"])
    df = df[["id","name","country","year","morphology","vei","deathsTotal",\
             "missingTotal","injuriesTotal","damageMillionsDollarsTotal",\
             "housesDestroyedTotal"]]
    
    volcanos_by_country = df.groupby(["country"])["id"].count().to_dict()

    return jsonify(volcanos_by_country)

    
if __name__ == "__main__":
    app.run(debug=True)

#############################################################
# END FLASK ROUTING
#############################################################

