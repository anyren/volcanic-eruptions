
//

const url = "/readmongodb"

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
    // sort so index is in the right order for the animation
    eruptions.sort();
    const bubbleDataObject = {};
    // increment the count
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
      // multiple the count so that the bubbles are large enough on the graph. this will be divided out for the labels
      let count = bubbleEntries[b][1] * 5;
      bubbleData.push([year, vei, count]);
    };
  
    
  //const labels = [year];

  const eruptionData = {
    datasets: [{
      label: 'Eruptions',
      data: bubbleData,
      backgroundColor: 'rgb(200,0,0)'
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
            delay = context.dataIndex * 200 ;
          }
          return delay;
        },
      },
      hoverRadius: 10,
      hoverBorderColor: "rgb(120,0,0)",
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(100,100,100,0.9)',
          callbacks: {
              label: (context) => {
                year= context.parsed.x;
                vei = context.parsed.y;
                // divide out the number multiplied above so the label shows actual count
                count = context.raw[2]/5;
                // find specific eruptions
                let obj = items.filter(o => o.year == year && o.vei === vei);
                label = [`${count} eruptions with VEI of ${vei} occured in ${year}: `];
                // add eruptions to tooltip
                for (e=0; e<obj.length; e++){
                  // tidy up date strings where month or day is missing
                  let date = obj[e].date.replaceAll(/None\//g,"");
                  volcano = `${obj[e].name} (${obj[e].country}, ${date})`
                  label.push(volcano);
                };
                return label;
              },
          },
        },
      },
      scales: {
        x: {
          ticks:{
            source: {
              labels: year,
            },
          },
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
        intersect: true
      },
    }
  };
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
});