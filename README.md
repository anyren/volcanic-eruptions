# volcanic-eruptions
Project 3 for UMN Data Boot Camp
Members:
1. Amanda Nyren
2. William Vann
3. Sanoo Singh
4. Mauvonte

Overview:
We constructed a data visualization project using ETL, Full-stack Development and Flask to perform the task needed to display visuals on the data retrieved from Volcanic Explosivity Index(VEI) in the last 20 years.

Environment Requirements:
Make sure these are installed properly in environment to import them in vscode
    1. flask
    2. pymongo
    3. render_templates
    4. requests
    5. jsonify
    6. pprint
    7. etl
    8. pandas 


1. Clone the repo
    A. clone repo "git@github.com:anyren/volcanic-eruptions.git"

2. Set up Database:
    A. use mongoDB to connect to "https://www.ngdc.noaa.gov/hazel/view/hazards/volcano/event-search/" to pull data from

3. Running Flask server
    A. Run flask server each page local using http://127.0.0.1:5000/
    B. /volcano
    C. /year
    D. /graph