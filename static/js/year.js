function refreshViz(year) {

    // makeDataTable(year);
    makeHBarChart(year);
    // makeDeathsPieChart(year);
    // makeVEIPieChart(year);
    // makeMorphologyPieChart(year);
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

    console.log("makeDataTable function");  

    const url = "/"    

    d3.json(url).then(function (data) {              
       
        d3.select("#data-table").html("");
        let demoTable = d3.select("#data-table").append("table").attr("class", "table table-striped");
            
        demoTable.append("tbody").append("tr").text("DEATHS").append("td").text(deaths);
        demoTable.append("tbody").append("tr").text("INJURIES").append("td").text(injuries);
        demoTable.append("tbody").append("tr").text("HOUSES DESTROYED").append("td").text(houses);
        demoTable.append("tbody").append("tr").text("DAMAGES ($ millions)").append("td").text(damages);
        
    });
            
}

function compareNumbers(a, b) {
    return b - a;
}

function makeHBarChart(year) {    

    console.log("makeHBarChart function");   

    function drawPlot(plotData) {
        let keys = Object.keys(plotData);
        let values = Object.values(plotData);    
        
        let trace = {
            x: values.reverse(), 
            y: keys.reverse(),
            type: "bar",
            orientation: "h",            
        };

        let layout = {        
            
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

    const url = "/aggregate2";

    d3.json(url).then(function (data) {
        console.log(data);
        drawPlot(data);  
    });        

}
    


function makeDeathsPieChart(year) {

    console.log("makeDeathsPieChart function");   

    
    
    // let keys = Object.keys(tot_deaths_by_year);
    // let values = Object.values(tot_deaths_by_year); 
    
    // let data = [{
    //     values: values,
    //     labels: keys,
    //     type: 'pie',
    //     textinfo: "label+percent",
    //     // automargin: true,
    //     insidetextorientation: "auto"
    //   }];
      
    // let layout = [{
    //     height: 1200,
    //     width: 1000,
    //     hiddenlabels: (2006),
    //     // margin: {"t": 0, "b": 0, "l": 0, "r": 0},
    // }];
    
    // Plotly.newPlot("deaths-by-year-piechart", data, layout);

    
}


function makeVEIPieChart(year) {

    console.log("makeVEIPieChart function");     

    // let keys = Object.keys(num_volc_by_vei);
    // let values = Object.values(num_volc_by_vei);    

    // let data = [{
    //     values: values,
    //     labels: keys,        
    //     type: 'pie',
    //     textinfo: "label+percent",
    //     insidetextorientation: "auto"
    //   }];
      
    // let layout = [{
    //     height: 400,
    //     width: 350
    // }];
    
    // Plotly.newPlot("vei-piechart", data, layout);

}

function makeMorphologyPieChart(year) {

    console.log("makeMorphologyPieChart function");     

    // keys = Object.keys(num_volc_by_morph);
    // values = Object.values(num_volc_by_morph);    

    // data = [{
    //     values: values,
    //     labels: keys,
    //     type: 'pie',
    //     textinfo: "label+percent",
    //     insidetextorientation: "auto"
    //   }];
      
    // layout = [{
    //     height: 550,
    //     width: 550
    // }];
    
    // Plotly.newPlot("morph-piechart", data, layout);
    
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
        let layout = {
            "title": "Number of Volcanoes: " + year
        };        
        Plotly.newPlot("row4viz", data, layout);

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