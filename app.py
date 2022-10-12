from lib2to3.pgen2.pgen import DFAState
from flask import Flask, render_template, jsonify
import pandas as pd
import requests
import etl

global df

def call_api():
    global df
    the_json = (requests.get("https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000")).json()
         
    df = pd.DataFrame(data=the_json["items"])
    df = df[["id","name","country","year","morphology","vei","deathsTotal",\
                "missingTotal","injuriesTotal","damageMillionsDollarsTotal",\
                "housesDestroyedTotal"]]
    
    return df

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

@app.route("/volcanoes_by_year")
def volcanoes_by_year():
    global df
    df = call_api()       
    vol_by_yr = df.groupby("year")["id"].count().to_dict()
    
    return jsonify(vol_by_yr)     

@app.route("/volcanos_by_country")
def volcanos_by_country():
    global df
    df = call_api()  
    vol_by_ctry = df.groupby(["country"])["id"].count().sort_values(ascending=False).to_dict()

    return jsonify(vol_by_ctry)

@app.route("/volcanos_by_morphology")
def volcanos_by_morphology():
    global df
    df = call_api()
    vol_by_morph = df.groupby(["morphology"])["id"].count().to_dict()

    return jsonify(vol_by_morph)

@app.route("/volcanos_by_vei")
def volcanos_by_vei():
    global df
    df = call_api()    
    vol_by_vei = df.groupby(["vei"])["id"].count().to_dict()

    return jsonify(vol_by_vei)

@app.route("/summary_data")
def summary_data():
    global df
    df = call_api()
    deaths = round(df["deathsTotal"].sum())
    injuries = round(df["injuriesTotal"].sum())
    houses = round(df["housesDestroyedTotal"].sum())
    damages = round(df["damageMillionsDollarsTotal"].sum())

    summ_data = {"Deaths": deaths, "Injuries": injuries, 
                 "Houses Destroyed": houses, "Damages ($ millions)": damages}

    return jsonify(summ_data)

#############################################################
# END FLASK ROUTING
#############################################################
    
if __name__ == "__main__":
    app.run(debug=True)