function refreshViz(year) {

    makeDataTable(year);
    makeHBarChart(year);
    makeVEIPieChart(year);
    makeMorphologyPieChart(year);
    makeLinePlot(year);


}





function newYearSelected(year) {
    
    console.clear();
    console.log("year selected: ", year);
    refreshViz(year);

                  
}

function makeDropDownList() {

    let dropDownList = d3.select("#selectYear");

    let yearsArray = [];
    for (let i=2000; i<=2022; i++) {
        yearsArray.push(i);
    }

    let defaultYear = "2000-2022";

    dropDownList.append("option").text(defaultYear).attr("value", defaultYear).attr("selected", true);

    dropDownList.selectAll("option")
        .data(yearsArray)
        .enter()
        .append("option")
        .text(function(d) {return d; })
        .attr("value", function(d) {return d; });  

    newYearSelected(defaultYear);    
        
}


function makeDataTable(year) {

    console.clear();

    console.log("makeDataTable function");  

    const url = "/aggregate5";    

    d3.json(url).then(function (data) {      
        
        console.log(data);
        
        let keys = Object.keys(data);
        let values = Object.values(data);  
        let entries = Object.entries(data);         

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
    
    function drawPlot(plotData) {

        console.log(plotData);  
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
            xaxis: {
                tickangle: 0
            },
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

    const url = "/aggregate2";

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);  
    });        

}
    
function makeVEIPieChart(year) {

    console.log("makeVEIPieChart function");     

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
            height: 400,
            width: 350
        }];
        
        Plotly.newPlot("vei-piechart", data, layout);

    }

    const url = "/aggregate4";

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);  
    });       

    
}

function makeMorphologyPieChart(year) {

    console.log("makeMorphologyPieChart function");     

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

    const url = "/aggregate3";

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);  
    });       
    
}  


function makeLinePlot(year) {

    console.log("makeLinePlot function");     

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

    const url = "/aggregate1";  

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);  
    });    

}
 
 

function init() {    
    console.clear;
   
    makeDropDownList();         
             
}

init();