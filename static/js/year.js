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
    // let houses = 0;
    let damages = 0;

    d3.json(url).then(function (data) {
        let the_dicts = data.items;
        console.log("RENDER_TABLE: ", the_dicts);                

        for (let i = 0; i < the_dicts.length; i++) {    
            // console.log("INDIV_DICT: ", the_dicts[i]); 

            if (yearSelected == the_dicts[i]["year"]) {

           
                let deathsNum = the_dicts[i]["deathsTotal"];
                let injuriesNum = the_dicts[i]["injuriesTotal"];
                // let housesNum = the_dicts[i]["housesDestroyedTotal"];            
                let damagesNum = the_dicts[i]["damageMillionsDollarsTotal"];

                if (deathsNum) {
                    deaths = deaths + parseInt(deathsNum); 
                }
                
                if (injuriesNum) {
                    injuries = injuries + parseInt(injuriesNum);
                }

                // if (housesNum) {
                //     houses = houses + parseInt(housesNum);
                // }

                if (damagesNum) {
                    damages = damages + parseInt(damagesNum);          
                }
            
            }
                                   
        }

        console.log("DEATHS: ", `${deaths}`);   
        console.log("INJURIES: ", `${injuries}`); 
        // console.log("HOUSES: ", `${houses}`); 
        console.log("DAMAGES: ", `${damages}`);      

        d3.select("#data-table").html("");
        let demoTable = d3.select("#data-table").append("table").attr("class", "table table-striped");
            
        demoTable.append("tbody").append("tr").text("DEATHS").append("td").text(deaths);
        demoTable.append("tbody").append("tr").text("INJURIES").append("td").text(injuries);
        // demoTable.append("tbody").append("tr").text("HOUSES DESTROYED").append("td").text(houses);
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

    let yearsArray = [];
    for (let i=2000; i<=2022; i++) {
        yearsArray.push(i);
    }
    
    let trace = {
        x: yearsArray, 
        y: 100,
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
            tickangle: 45
        },
        yaxis: {
            zeroline: false,
            gridwidth: 2
        },
        bargap :0.05
    };
  
    let data = [trace];

    Plotly.newPlot("deaths-barchart", data, layout);

}
    


// ***************************************************************************

// Function to create Plotly gauge chart

function makeGaugeChart(yearSelected) {

    console.log("THIS IS MAKEGAUGECHART function");      
    
    let data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: yearSelected,            
            type: "indicator",
            mode: "gauge+number",
            // delta: { reference: 10 },
            gauge: { axis: {range: [0, 10] } }
        }
    ];
    
    let layout = { 
        width: 275, 
        height: 100, 
        margin: { 
                    t: 0, 
                    b: 0 
                },
        font:{
               family: "Courier"
             } 
        };

    Plotly.newPlot("injuries-gaugechart", data, layout);       
    
}

// ***************************************************************************

// Function to create Plotly bubble chart

function makeBubbleChart(yearSelected) {

    console.log("THIS IS MAKEBUBBLECHART function");     

    let trace = {
        x: yearSelected,
        y: yearSelected,
        mode: "markers",
        marker: {
                    size: 5,
                    color: "black",                    
                    colorscale: [
                        [0, "rgb(166,206,227)"], 
                        [0.25, "rgb(31,120,180)"], 
                        [0.45, "rgb(178,223,138)"], 
                        [0.65, "rgb(51,160,44)"], 
                        [0.85, "rgb(251,154,153)"], 
                        [1, "rgb(227,26,28)"]            
                    ]
                },
        text: "TEXT"           
    };
      
    let data = [trace];
    
    let layout = {    
        showlegend: false,
        height: 1000,
        width: 850,
        xaxis:  { title: { text: "TEXT" } },
        font: {
                    family: "Courier"
              } 
     
    };
      
    Plotly.newPlot("damages-bubblechart", data, layout);
    
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