function refreshViz(year) {
    console.clear();
    makeDataTable(year);
    makeHBarChart(year);
    makeVEIPieChart(year);
    makeMorphologyPieChart(year);
    makeLinePlot(year);
}

function newYearSelected(year) {    
    console.clear();
    console.log("year_selected: ", year);
    refreshViz(year);                  
}

function makeDropDownList() {
    console.clear();
    let dropDownList = d3.select("#selectYear");
    let defaultYear = "ENTIRE DATASET (2000-2022)";

    dropDownList.append("option").text(defaultYear).attr("value", "2000-2022").attr("selected", true);
    dropDownList.append("option").text("2000-2011").attr("value", "2000-2011");
    dropDownList.append("option").text("2012-2022").attr("value", "2012-2022");

    newYearSelected(defaultYear);     
}

function makeDataTable(year) {
    console.log("makeDataTable function");
    const url = "/summary_data";    

    d3.json(url).then(function (data) {   
        console.log("makeDataTable data:", data);
        let keys = Object.keys(data);
        let values = Object.values(data); 

        if (year=="ENTIRE DATASET (2000-2022)") {
            keys = Object.keys(data);
            values = Object.values(data); 
        } else if (year=="2000-2011") {
            keys = Object.keys(data);
            values = Object.values(data); 
        } else if (year=="2012-2022") {
            keys = Object.keys(data);
            values = Object.values(data); 
        }                       

        console.log("KEYS: ", keys);
        console.log("VALS: ", values);   
        
        d3.select("#data-table").html("");
        let demoTable = d3.select("#data-table").append("table").attr("class", "table table-striped");

        for (let i=0; i<keys.length; i++) {
            demoTable.append("tbody").append("tr").text(keys[i]).append("td").text(values[i]);
        }                    
    });            
}

function compareNumbers(a, b) {
    return b - a;
}

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
            orientation: "h",            
        };

        let layout = {     
            autosize: true,
            showlegend: false,
            xaxis: {tickangle: 0},
            yaxis: {
                zeroline: true,
                gridwidth: 5,
                dtick: 1,
                automargin: true
            },
            bargap : 5,           
        };
    
        let data = [trace];
        Plotly.newPlot("volcanoes-by-country-hbarchart", data, layout);
    }
    //////////////////////////////////////////////

    const url = "/volcanos_by_country";

    d3.json(url).then(function (data) {
        console.log("volcanos_by_country data: ", data);
        if (year=="ENTIRE DATASET (2000-2022)") {
            drawPlot(data);
        } else if (year=="2000-2011") {
            drawPlot(data);
        } else if (year=="2012-2022") {
            drawPlot(data);
        }
    });      
}
    
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
            insidetextorientation: "auto"
        }];
        
        let layout = [{
            autosize: true,
            // height: 400,
            // width: 350
        }];
        
        Plotly.newPlot("vei-piechart", data, layout);
    }
    //////////////////////////////////////////////

    const url = "/volcanos_by_vei";

    d3.json(url).then(function (data) {
        console.log(data);
        if (year=="ENTIRE DATASET (2000-2022)") {
            drawPlot(data);
        } else if (year=="2000-2011") {
            drawPlot(data);
        } else if (year=="2012-2022") {
            drawPlot(data);
        } 
    });      
}

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
            textinfo: "label+percent",
            insidetextorientation: "auto",

        }];
        
        layout = [{
            autosize: true,
            height: 550,
            width: 950,
            
        }];
        
        Plotly.newPlot("pie1", data, layout);
    }
    //////////////////////////////////////////////

    const url = "/volcanos_by_morphology";

    d3.json(url).then(function (data) {
        console.log(data);
        if (year=="ENTIRE DATASET (2000-2022)") {
            drawPlot(data);
        } else if (year=="2000-2011") {
            drawPlot(data);
        } else if (year=="2012-2022") {
            drawPlot(data);
        }        
    });     
}  

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
        let layout = {autosize: true};        
        Plotly.newPlot("eruptions-linechart", data, layout);

    }
    //////////////////////////////////////////////

    const url = "/volcanoes_by_year";  

    d3.json(url).then(function (data) {
        console.log("volcanoes_by_year data: ", data);
        if (year=="ENTIRE DATASET (2000-2022)") {
            drawPlot(data);
        } else if (year=="2000-2011") {
            drawPlot(data);
        } else if (year=="2012-2022") {
            drawPlot(data);
        }
          
    });    

} 

function init() {
    console.log("init() function")
    makeDropDownList();     
}

init();