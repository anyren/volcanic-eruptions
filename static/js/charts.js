// Bar Graph Code


d3.json("/readmongodb").then(function(data) {
    let graph = "Bar";
    let title = `VEI`;
   
    let items = data.items;

    let veis = items.map(v => v.vei);
    
    
    console.log("Lookin at veis");
    console.log(veis);

    let years = items.map(y => y.year);
    console.log('Lookin at year');
    console.log(years);

    

    // for (let count = 0; count > years )


    
    
    
    let traceB1 = {
      x: years,
      y: veis,
      type: 'bar'
    };
    
    let Bardata = [traceB1];
    
    let Barlayout = {
      title: title
    };
    
    
    Plotly.newPlot("bar", Bardata, Barlayout);
    
    console.log('This is data')
    console.log(data);
    
    
    // Scatter Plot Code
    let death = items.map(d => d.deaths);
    console.log('Looking at deaths')
    console.log(death)

    let country = items.map(c => c.country);
    console.log("looking at countries")
    console.log(country)



     let Deaths = {
      x: years,
      y: death,
      mode: 'markers',
      type: 'scatter',
      name: 'deaths',
      text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      marker: { size: 12 }
    };

    let Countries = {
      x: country,
      y: death,
      mode: 'markers',
      type: 'scatter',
      name: 'Country',
      text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      marker: { size: 12 }
    };

    let ScatData = [Countries];
    let ScatData2 = [Deaths];

    let Scatlayout = {
      xaxis: {
        range: []
      },
      yaxis: {
        range: []
      },
      title:'Deaths Per Country'
    };
    let Scatlayout2 = {
      xaxis: {
        range: []
      },
      yaxis: {
        range: []
      },
      title:'Deaths Per Year'
    };

    Plotly.newPlot('scat-by-country', ScatData, Scatlayout);
    Plotly.newPlot('scat-by-deaths', ScatData2, Scatlayout2);



    // // Box-N-Whisker Code
    // var x = data.country
    // var traceBW1 = {
    //   y: data.year,
    //   x: x,
    //   name: 'date',
    //   marker: {color: '#3D9970'},
    //   type: 'box'
    // };

    // var traceBW2 = {
    //   y: data.deaths,
    //   x: x,
    //   name: 'deaths',
    //   marker: {color: '#FF4136'},
    //   type: 'box'
    // };

    // var traceBW3 = {
    //   y: data.morphology,
    //   x: x,
    //   name: 'damages',
    //   marker: {color: '#FF851B'},
    //   type: 'box'
    // };

    // var BWdata = [traceBW1, traceBW2, traceBW3];

    // var BWlayout = {
    //   yaxis: {
    //     title: 'VEI',
    //     zeroline: false
    //   },
    //   boxmode: 'group'
    // };

    // Plotly.newPlot('box', BWdata, BWlayout);
});
