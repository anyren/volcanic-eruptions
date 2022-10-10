// ***************************************************************************

// Function called by changes to Years dropdown (id="selDataset")

function optionChanged(sel) {

    // Clear the console to see new data for this selection
    console.clear();
    console.log("SEL: ", sel);

    selector = sel;
    console.log("SELECTOR: ", selector);

    // Make table and charts
    renderTable();
    makeBarChart();
    makeBubbleChart();
    makeGaugeChart();
   
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

function renderTable() {

    console.log("THIS IS RENDERTABLE function");    
    
}

// ***************************************************************************

// Sorting function

function compareNumbers(a, b) {
    return b - a;
}

// ***************************************************************************

// Function to create Plotly barchart

function makeBarChart() {    

    console.log("THIS IS MAKEBARCHART function");    
    
}

// ***************************************************************************

// Function to create Plotly gauge chart

function makeGaugeChart() {

    console.log("THIS IS MAKEGAUGECHART function");      
    
}

// ***************************************************************************

// Function to create Plotly bubble chart

function makeBubbleChart() {

    console.log("THIS IS MAKEBUBBLECHART function");     
    
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

    renderTable();
    makeBarChart();
    makeBubbleChart();
    makeGaugeChart();
    
             
}

init();
