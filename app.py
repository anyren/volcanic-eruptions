from flask import Flask, render_template, jsonify
import pandas as pd
import requests
import etl

def call_api(year):
    global df
    the_json = (requests.get("https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000")).json()

    try:     
        df = pd.DataFrame(data=the_json["items"])
        df = df[["id","name","country","year","morphology","vei","deathsTotal",\
                    "missingTotal","injuriesTotal","damageMillionsDollarsTotal",\
                    "housesDestroyedTotal"]]
    except:        
        print("Error making dataframe")

    df_2000_2022 = df.copy()

    try:
        df_2000_2011 = df.loc[(df["year"]<=2011), :]
        df_2012_2022 = df.loc[((df["year"]>=2012) & (df["year"]<=2022)), :]
    except:
        return df

    if year == "2000-2022":
        return df_2000_2022

    elif year == "2000-2011":
        return df_2000_2011

    elif year == "2012-2022":
        return df_2012_2022

    else:
        return df 

def validate_year(year):    
    if year in ["2000-2022", "2000-2011", "2012-2022"]:
        return year
    else:
        return "2000-2022"     

#############################################################
# BEGIN FLASK ROUTING
#############################################################

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config["SEND_FILE_MAX_PAGE_DEFAULT"] = 0

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

@app.route("/new")
def new():
    return render_template("new.html")

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

@app.route("/volcanoes_by_year/<year>")
def volcanoes_by_year(year):
    global df
    df = call_api(validate_year(year))       
    vol_by_yr = df.groupby("year")["id"].count().to_dict()
    
    return jsonify(vol_by_yr)     

@app.route("/volcanos_by_country/<year>")
def volcanos_by_country(year):
    global df
    df = call_api(validate_year(year))  
    vol_by_ctry = df.groupby(["country"])["id"].count().sort_values(ascending=False).to_dict()

    return jsonify(vol_by_ctry)

@app.route("/volcanos_by_morphology/<year>")
def volcanos_by_morphology(year):
    global df
    df = call_api(validate_year(year))
    vol_by_morph = df.groupby(["morphology"])["id"].count().sort_values(ascending=False).to_dict()

    return jsonify(vol_by_morph)

@app.route("/volcanos_by_vei/<year>")
def volcanos_by_vei(year):
    global df
    df = call_api(validate_year(year))    
    vol_by_vei = df.groupby(["vei"])["id"].count().sort_values(ascending=False).to_dict()

    return jsonify(vol_by_vei)

@app.route("/summary_data/<year>")
def summary_data(year):
    global df
    df = call_api(validate_year(year))
    deaths = round(df["deathsTotal"].sum())
    injuries = round(df["injuriesTotal"].sum())
    houses = round(df["housesDestroyedTotal"].sum())
    damages = round(df["damageMillionsDollarsTotal"].sum())*1_000_000

    summ_data = {"Deaths": "{:0,}".format(deaths), "Injuries": "{:0,}".format(injuries), 
                 "Houses Destroyed": "{:0,}".format(houses), "Damages": "${:0,}".format(damages)}

    return jsonify(summ_data)

@app.route("/graphs")
def makeGraph():
    return render_template("moe.html")


#############################################################
# END FLASK ROUTING
#############################################################
    
if __name__ == "__main__":
    app.run(debug=True)