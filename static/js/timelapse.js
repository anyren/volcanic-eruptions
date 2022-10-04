
//

const url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"

let c;
d3.json(url).then(function(data) {
    let items = data['items'];
    let vei = items.map(function(row) {
      return row.vei;
    });
    let year = items.map(function(row) {
      return row.year;
    });
    c = year.map(function(e, i) {
      return [e, vei[i]];
    });
    // remove any data points that don't have a VEI
    let eruptions = []
    for(e=0; e<c.length; e++){
      if(c[e][1]>=0){
        eruptions.push(c[e]);
      }
    };
    eruptions.sort();
    const bubbleDataObject = {};
    for (const element of eruptions) {
      if (bubbleDataObject[element]) {
        bubbleDataObject[element] += 1;
      } else {
        bubbleDataObject[element] = 1;
      }
    }
    let bubbleEntries = Object.entries(bubbleDataObject);
    let bubbleData = []
    for(b=0; b<bubbleEntries.length;b++){
      let key = bubbleEntries[b][0]
      let year = Number(key.slice(0,4));
      let vei = Number(key.slice(-1));
      let count = bubbleEntries[b][1] * 3;
      bubbleData.push([year, vei, count]);
    };
  
    
  //const labels = [year];

  const eruptionData = {
    datasets: [{
      label: 'Eruptions',
      data: bubbleData,
      backgroundColor: 'rgb(255, 99, 132)'
    }],
  };
  let delayed;
  const config = {
    type: 'bubble',
    data: eruptionData,
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            // delay = context.dataIndex * 300 + context.datasetIndex * 100;
            delay = context.dataIndex * 200 ;
          }
          return delay;
        },
      },
      hoverRadius: 10,
      scales: {
        x: {
          ticks:{
            source: {
              labels: year,
            },
          },
          // type: 'time',
          // time: {
          //     unit: 'year',
          //     displayFormats: {
          //       year: 'YYYY'
          //   }
          // },
          title: {
            display: true,
            text: "Year",
          },
          
          min:1999,
          max: 2023,
        },
        y: { // defining min and max so hiding the dataset does not change scale range
          min: 0,
          max: 6,
          title: {
            display: true,
            text: "Volcanic Explosivity Index (VEI)",
          },
        }
      },
      interaction: {
        mode: 'x'
      },
    }
  };
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
});