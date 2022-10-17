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

    let death = items.map(d => d.deaths);
    console.log('Looking at deaths');
    console.log(death);

    let country = items.map(c => c.country);
    console.log("looking at countries");
    console.log(country);

    let Morph = items.map(m => m.morphology);
    console.log('looking at morphology');
    console.log(Morph)

    

    


    
    
    
    let traceB1 = {
      x: veis,
      y: death,
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


    // let vei_deaths = 

     let morph = {
      x: years,
      y: Morph,
      mode: 'markers',
      type: 'scatter',
      name: 'deaths',
      text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      marker: { size: 10 }
    };

    let Countries = {
      x: Morph,
      y: country,
      mode: 'markers',
      type: 'scatter',
      name: 'Country',
      text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      marker: { size: 12 }
    };

    let ScatData = [Countries];
    let ScatData2 = [morph];

    let Scatlayout = {
      xaxis: {
        range: []
      },
      yaxis: {
        range: []
      },
      title:'Morphology Per Country'
    };
    let Scatlayout2 = {
      xaxis: {
        range: []
      },
      yaxis: {
        range: []
      },
      title:'Morphology Per Year'
    };

    Plotly.newPlot('scat-by-country', ScatData, Scatlayout);
    Plotly.newPlot('scat-by-morph', ScatData2, Scatlayout2);



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
