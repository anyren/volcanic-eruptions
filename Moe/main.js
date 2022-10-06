// logic.js

console.log("This is logic.js");

// Create map object 

let map = L.map('map').setView([0.9619, 114.5548], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '© OpenStreetMap'
}).addTo(map);

// API 

const url = "https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?maxYear=2022&minYear=2000"

d3.json(url).then(function(data) {

  console.log(data.items);

  let the_dicts = data.items; 

  // Iterate over items

  for (let i=0; i<the_dicts.length; i++) 
  {

      // Use for placing circles on map    
      
      let lat = the_dicts[i].latitude;
      let lon = the_dicts[i].longitude;
      let loc = the_dicts[i].location;
      let name = the_dicts[i].name;
      let country = the_dicts[i].country;
      let id = the_dicts[i].id;
      let type = the_dicts[i].morphology;
      let year = the_dicts[i].year;
      let vei = the_dicts[i].vei;


      console.log("LON: ", lon);
      console.log("LAT: ", lat);
      console.log("LOC: ", loc);
      console.log("NAME: ", name);
      console.log("COUNTRY: ", country);
      console.log("ID: ", id);
      console.log("TYPE: ", type);
      console.log("YEAR: ", year);
      console.log("VEI: ", vei);
      

      // Size circles
      
      if (vei > 0) {
          radius = 100000 * vei;
      } else {
          radius = 100000 / Math.PI;
      }

      // Light to dark, less opaque to more opaque, for circles based on depth
    
      if (vei == 0) {
        color = "#fff5eb";
        fillOpacity = 0.2;
      } else if (vei == 1) {
        color = "#fee6ce";
        fillOpacity = 0.4;
      } else if (vei == 2) {
        color = "#fdae6b";
        fillOpacity = 0.6;
      } else if (vei == 3) {
        color = "#fd8d3c";
        fillOpacity = 0.8;
      } else if (vei == 4) {
        color = "#f16913";
        fillOpacity = 0.9;
      } else if (vei == 5) {
        color = "#d94801";
        fillOpacity = 0.9;
      } else if (vei == 6) {
        color = "#a63603";
        fillOpacity = 0.9;
      } else if (vei == 7) {
        color = "#7f2704";
        fillOpacity = 1.0;
      } else if (vei == 8) {
        color = "#7f2704";
        fillOpacity = 1.0;
      } else {
        color = "#737373";
        fillOpacity = 1.0;
        radius = 50000;
      }
      
      let circle = L.circle([lat, lon], {
        color: color,
        fillColor: color,
        fillOpacity: fillOpacity,
        radius: radius
      }).addTo(map);     
      
      let popupText = name + "<br>" + year + "<br><br><b>VEI: </b>" + vei;
     
      circle.bindPopup(popupText);
  }
            
  let legend = L.control({position: "bottomright"});

  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "legend");      
      div.innerHTML += "<h4>VEI</h4>";
      div.innerHTML += '<i style="background: #fff5eb"></i><span>0</span><br>';
      div.innerHTML += '<i style="background: #fee6ce"></i><span>1</span><br>';
      div.innerHTML += '<i style="background: #fdd0a2"></i><span>2</span><br>';
      div.innerHTML += '<i style="background: #fdae6b"></i><span>3</span><br>';
      div.innerHTML += '<i style="background: #fd8d3c"></i><span>4</span><br>';
      div.innerHTML += '<i style="background: #f16913"></i><span>5</span><br>';
      div.innerHTML += '<i style="background: #d94801"></i><span>6</span><br>';
      div.innerHTML += '<i style="background: #a63603"></i><span>7</span><br>';
      div.innerHTML += '<i style="background: #7f2704"></i><span>8</span><br>';
      div.innerHTML += '<i style="background: #737373"></i><span>Unknown</span><br>';

     
      return div;   

  }

  legend.addTo(map);

  
});

// Get data to correspond with each type of graph

d3.select('option')
    .select('#bar')
    .data(url)
    .enter()