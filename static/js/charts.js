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
    
    let date = items.map(dt => dt.date);
    console.log('looking at date');
    console.log(date)

    

    


    
    
    
    let traceB1 = {
      x: country ,
      y: death,
      name: 'Death by country',
      type: 'bar'
    };
    
    let traceB2 = {
      x: country ,
      y: veis,
      name: 'VEI by death',
      type: 'bar'
    };
    
    let BarData = [traceB1, traceB2];
    
    let s_layout = {barmode: 'stack'};
    Plotly.newPlot("bar", BarData, s_layout);
    
    
    console.log('This is data')
    console.log(data);
    
    
    // Scatter Plot Code


   

     let morph = {
      x: Morph,
      y: date,
      mode: 'markers',
      type: 'scatter',
      name: 'Morphology by Date',
      text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      marker: { size: 10 }
    };

    let Countries = {
      x: Morph,
      y: country,
      mode: 'markers',
      type: 'scatter',
      name: 'VEI by Country',
      text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      marker: { size: 12 }
    };

    let ScatData = [Countries];
    let ScatData2 = [morph];
    // let ScatData3 = [date];

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
    // let Scatlayout3 = {
    //   xaxis: {
    //     range: []
    //   },
    //   yaxis: {
    //     range: []
    //   },
    //   title:'VEI Per Year'
    // };

    Plotly.newPlot('scat-by-country', ScatData, Scatlayout);
    Plotly.newPlot('scat-by-morph', ScatData2, Scatlayout2);
    // Plotly.newPlot('scat-by-date', ScatData3, Scatlayout3);



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
