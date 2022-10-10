// ***************************************************************************

// Function called by changes to Years dropdown (id="selDataset")

function optionChanged(sel) {

    // Clear the console to see new data for this selection
    console.clear();
    console.log("SEL: ", sel);

    let yearSelected = sel;
    
    // Make table and charts
    renderTable(yearSelected);
    makeBarChart(yearSelected);
    makeBubbleChart(yearSelected);
    makeGaugeChart(yearSelected);
 
   
}

// ***************************************************************************

// Function to populate values in Years dropdown (id="selDataset")

function populateDropDownList() {
    let dropDownList = d3.select("#selDataset");

    let yearsArray = [];
    for (let i=2000; i<=2022; i++) {
        yearsArray.push(i);
    }

    dropDownList.selectAll("option")
        .data(yearsArray)
        .enter()
        .append("option")
        .text(function(d) {return d; })
        .attr("value", function(d) {return d; });  
    
}

// ***************************************************************************

// Function to populate table with demographic data

function renderTable(yearSelected) {

    console.log("THIS IS RENDERTABLE function");  

    const url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000";
    let deaths = 0;
    let injuries = 0;
    let houses = 0;
    let damages = 0;

    d3.json(url).then(function (data) {
        let the_dicts = data.items;
        console.log("RENDER_TABLE: ", the_dicts);                

        for (let i = 0; i < the_dicts.length; i++) {    
            // console.log("INDIV_DICT: ", the_dicts[i]); 

            if (yearSelected == the_dicts[i]["year"]) {

           
                let deathsNum = the_dicts[i]["deathsTotal"];
                let injuriesNum = the_dicts[i]["injuriesTotal"];
                let housesNum = the_dicts[i]["housesDestroyedTotal"];            
                let damagesNum = the_dicts[i]["damageMillionsDollarsTotal"];

                if (deathsNum) {
                    deaths = deaths + parseInt(deathsNum); 
                }
                
                if (injuriesNum) {
                    injuries = injuries + parseInt(injuriesNum);
                }

                if (housesNum) {
                    houses = houses + parseInt(housesNum);
                }

                if (damagesNum) {
                    damages = damages + parseInt(damagesNum);          
                }
            
            }
                                   
        }

        console.log("DEATHS: ", `${deaths}`);   
        console.log("INJURIES: ", `${injuries}`); 
        console.log("HOUSES: ", `${houses}`); 
        console.log("DAMAGES: ", `${damages}`);      

        d3.select("#data-table").html("");
        let demoTable = d3.select("#data-table").append("table").attr("class", "table table-striped");
            
        demoTable.append("tbody").append("tr").text("DEATHS").append("td").text(deaths);
        demoTable.append("tbody").append("tr").text("INJURIES").append("td").text(injuries);
        demoTable.append("tbody").append("tr").text("HOUSES DESTROYED").append("td").text(houses);
        demoTable.append("tbody").append("tr").text("DAMAGES ($ millions)").append("td").text(damages);
        

    });
    
        
}

// ***************************************************************************

// Sorting function

function compareNumbers(a, b) {
    return b - a;
}

// ***************************************************************************

// Function to create Plotly barchart

function makeBarChart(yearSelected) {    

    console.log("THIS IS MAKEBARCHART function");   

    let vol_by_country = {'Indonesia': 39,
    'United States': 12,
    'Papua New Guinea': 11,
    'Italy': 10,
    'Japan': 9,
    'Ecuador': 8,
    'Philippines': 6,
    'New Zealand': 4,
    'Guatemala': 4,
    'Tonga': 3,
    'Chile': 3,
    'Vanuatu': 3,
    'Iceland': 2,
    'Montserrat': 2,
    'Colombia': 2,
    'Congo, DRC': 2,
    'Cape Verde': 1,
    'Mexico': 1,
    'Comoros': 1,
    'Russia': 1,
    'Yemen': 1,
    'Eritrea': 1,
    'Costa Rica': 1,
    'El Salvador': 1,
    'Peru': 1,
    'Spain': 1,
    'St. Vincent & the Grenadines': 1};

    let keys = Object.keys(vol_by_country);
    let values = Object.values(vol_by_country);    
    
    let trace = {
        x: values.reverse(), 
        y: keys.reverse(),
        type: "bar",
        orientation: "h",
        // text: otuLabelsTop10
    };

    let layout = {        
        font:{
            family: "Courier"
        },
        showlegend: false,
        xaxis: {
            tickangle: 0
        },
        yaxis: {
            zeroline: true,
            gridwidth: 5,
            dtick: 1,
            automargin: true
        },
        bargap : 5
    };
  
    let data = [trace];

    Plotly.newPlot("deaths-by-country-barchart", data, layout);

}
    


// ***************************************************************************

// Function to create Plotly gauge chart

function makeGaugeChart(yearSelected) {

    console.log("THIS IS MAKEGAUGECHART function");   
    
    let tot_deaths_by_year = {2000: 8.0,
        2001: 4.0,
        2002: 103.0,
        2003: 0.0,
        2004: 6.0,
        2005: 3.0,
        2006: 1277.0,
        2007: 17.0,
        2008: 13.0,
        2009: 0.0,
        2010: 376.0,
        2011: 38.0,
        2012: 0.0,
        2013: 12.0,
        2014: 80.0,
        2015: 2.0,
        2016: 9.0,
        2017: 19.0,
        2018: 644.0,
        2019: 23.0,
        2020: 40.0,
        2021: 78.0,
        2022: 7.0};
    
    let keys = Object.keys(tot_deaths_by_year);
    let values = Object.values(tot_deaths_by_year); 
    
    let data = [{
        values: values,
        labels: keys,
        type: 'pie',
        textinfo: "label+percent",
        // automargin: true,
        insidetextorientation: "auto"
      }];
      
    let layout = [{
        height: 1200,
        width: 1000,
        // margin: {"t": 0, "b": 0, "l": 0, "r": 0},
    }];
    
    Plotly.newPlot("deaths-by-year-piechart", data, layout);

    
}

// ***************************************************************************

// Function to create Plotly bubble chart

function makeBubbleChart(yearSelected) {

    console.log("THIS IS MAKEBUBBLECHART function");     

    let num_volc_by_vei = {"VEI 1.0": 9, "VEI 2.0": 23, "VEI 3.0": 21, "VEI 4.0": 11, "VEI 5.0": 1};

    let keys = Object.keys(num_volc_by_vei);
    let values = Object.values(num_volc_by_vei);    

    let data = [{
        values: values,
        labels: keys,
        type: 'pie',
        textinfo: "label+percent",
        insidetextorientation: "auto"
      }];
      
    let layout = [{
        height: 400,
        width: 350
    }];
    
    Plotly.newPlot("vei-piechart", data, layout);

    let num_volc_by_morph = {'Caldera': 5,
    'Complex volcano': 4,
    'Lava dome': 2,
    'Pyroclastic shield': 1,
    'Shield volcano': 13,
    'Stratovolcano': 99,
    'Subglacial volcano': 1,
    'Submarine volcano': 6};

    keys = Object.keys(num_volc_by_morph);
    values = Object.values(num_volc_by_morph);    

    data = [{
        values: values,
        labels: keys,
        type: 'pie',
        textinfo: "label+percent",
        insidetextorientation: "auto"
      }];
      
    layout = [{
        height: 550,
        width: 550
    }];
    
    Plotly.newPlot("morph-piechart", data, layout);


    
}  

// ***************************************************************************

// Starter function to load json, populate dropdown list, and make default charts

function init() {    
    const url = "/readmongodb";
    let deaths = 0;

    d3.json(url).then(function (data) {
        let the_dicts = data.items;
        console.log("THEDICTS: ", the_dicts);                

        for (let i = 0; i < the_dicts.length; i++) {    
            // console.log("INDIV_DICT: ", the_dicts[i]); 
            deaths = deaths + parseInt(the_dicts[i]["deaths"]);           
                                   
        }

        console.log("DEATHS: ", `${deaths}`);        

    });

    populateDropDownList();

    // Make table and charts

    let yearSelected = 2000;

    renderTable(yearSelected);
    makeBarChart(yearSelected);
    makeBubbleChart(yearSelected);
    makeGaugeChart(yearSelected);
    
             
}

init();