// Refresh all visualizations, data table, and image rotator

function refreshViz(year) {
    console.clear();
    makeDataTable(year);
    makeHBarChart(year);
    makeVEIPieChart(year);
    makeMorphologyPieChart(year);
    makeLinePlot(year);
    changeImage();
}

// New year range selected 

function newYearSelected(year) {    
    console.clear();
    console.log("year_selected: ", year);
    refreshViz(year);                  
}

// Randomly rotate images under dropdown list

function changeImage() {    
    console.clear();
    let img_array = Array(
        "colima.jpg", 
        "hawaii1.jpg",  
        "hawaii2.jpg",           
        "iceland1.png",
        "iceland2.png",
        "mayon.jpg",
        "mud_volcano.png",
        "smokey_plume.jpg"    
    );
    let random_img = img_array[Math.floor(Math.random()*img_array.length)];    
    let imgRot = d3.select("#image-rotator");
    imgRot.select("img").remove();
    imgRot.insert("img").attr("class", "img-fluid").attr("src", "/static/images/" + random_img);                         
}

// Create dropdown list with all year range selections 

function makeDropDownList() {
    console.clear();
    let dropDownList = d3.select("#selectYear");
    let defaultYear = "2000-2022";
    
    dropDownList.append("option").text(defaultYear).attr("value", "2000-2022").attr("selected", true);
    dropDownList.append("option").text("──────────").attr("value", "").attr("disabled", true);    
    dropDownList.append("option").text("2000-2011").attr("value", "2000-2011");
    dropDownList.append("option").text("2012-2022").attr("value", "2012-2022");
    dropDownList.append("option").text("──────────").attr("value", "").attr("disabled", true);
    dropDownList.append("option").text("2000-2004").attr("value", "2000-2004");
    dropDownList.append("option").text("2005-2009").attr("value", "2005-2009");
    dropDownList.append("option").text("2010-2014").attr("value", "2010-2014");
    dropDownList.append("option").text("2015-2019").attr("value", "2015-2019");
    dropDownList.append("option").text("2020-2022").attr("value", "2020-2022");

    newYearSelected(defaultYear);     
}

// Populate data table with data specific to year range

function makeDataTable(year) {
    console.log("makeDataTable function");
    let url = "/summary_data/" + year;    

    d3.json(url).then(function (data) {   
        console.log("makeDataTable data:", data);
        let keys = Object.keys(data);
        let values = Object.values(data);         
        keys = Object.keys(data);
        values = Object.values(data); 
                   
        console.log("KEYS: ", keys);
        console.log("VALS: ", values);   
        
        d3.select("#data-table").html("");
        let demoTable = d3.select("#data-table").append("table").attr("class", "table table-striped");
        demoTable.append("thead").append("tr").append("th").attr("colspan", "2").text(year);      
               
        for (let i=0; i<keys.length; i++) {
            demoTable.append("tbody").append("tr").text(keys[i]).append("td").text(values[i]);                   
        }                    
    });            
}

// Create horizontal bar chart

function makeHBarChart(year) { 
    console.log("makeHBarChart function");

    //////////////////////////////////////////////
    function drawPlot(plotData) {
        console.log("makeHBarChart plotData:", plotData);

        let keys = Object.keys(plotData);
        let values = Object.values(plotData);    
        
        let trace = {
            x: values.reverse(), 
            y: keys.reverse(),
            type: "bar",
            orientation: "h"      
                     
        };

        let layout = {     
            autosize: true,
            showlegend: false,
            xaxis: {
                tickangle: 0,
                tickvals: values
            },
            yaxis: {
                zeroline: true,
                gridwidth: 5,
                dtick: 1,
                automargin: true                
            },
            bargap : 15,   
            title: year          
        };
    
        let data = [trace];
        Plotly.newPlot("volcanoes-by-country-hbarchart", data, layout);
    }
    //////////////////////////////////////////////

    let url = "/volcanos_by_country/" + year;

    d3.json(url).then(function (data) {
        console.log("volcanos_by_country data: ", data);
            drawPlot(data);      
    });      
}

// Create VEI pie chart 

function makeVEIPieChart(year) {
    console.log("makeVEIPieChart function");     

    //////////////////////////////////////////////
    function drawPlot(plotData) {
        keys = Object.keys(plotData);
        values = Object.values(plotData);    

        let data = [{
            values: values,
            labels: keys,        
            type: 'pie',
            textinfo: "label+percent",
            insidetextorientation: "auto",
            title: year,
            hole: .4
                        
        }];
        
        let layout = [{
            autosize: true                                
        }];
        
        Plotly.newPlot("vei-piechart", data, layout);
    }
    //////////////////////////////////////////////

    let url = "/volcanos_by_vei/" + year;

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);      
    });      
}

// Create morphology pie chart 

function makeMorphologyPieChart(year) {
    console.log("makeMorphologyPieChart function");     

    //////////////////////////////////////////////
    function drawPlot(plotData) {
        keys = Object.keys(plotData);
        values = Object.values(plotData);    

        data = [{
            values: values,
            labels: keys,
            type: 'pie',
            textinfo: "percent",
            insidetextorientation: "auto",
            title: year,
            rotation: 90,
            hole: .4        

        }];
        
        layout = [{
            autosize: true                           
        }];
        
        Plotly.newPlot("morph-piechart", data, layout);
    }
    //////////////////////////////////////////////

    let url = "/volcanos_by_morphology/" + year;

    d3.json(url).then(function (data) {
        console.log(data);
            drawPlot(data);              
    });     
}  

// Create number of eruptions line chart 

function makeLinePlot(year) {

    console.log("makeLinePlot function");     

    //////////////////////////////////////////////
    function drawPlot(plotData) {     
       
        keys = Object.keys(plotData);
        values = Object.values(plotData);
        plotType = "scatter";
            
        console.log("drawplot keys ", keys);
        console.log("drawplot values ", values);

        let trace = {
            x: keys,
            y: values,            
            type: plotType
        };    
               
        data = [trace];
        let layout = {
            autosize: true, 
            title: year, 
            xaxis: {tickvals: keys}
        };        
        Plotly.newPlot("eruptions-linechart", data, layout);

    }
    //////////////////////////////////////////////

    let url = "/volcanoes_by_year/" + year;  

    d3.json(url).then(function (data) {
        console.log("volcanoes_by_year data: ", data);
        drawPlot(data);                 
    });    

} 

// Initialization 

function init() {
    console.log("init() function")
    makeDropDownList();     
}

init();