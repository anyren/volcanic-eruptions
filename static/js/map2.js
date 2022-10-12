const url = "/readmongodb";

let cities = {
  type: "FeatureCollection",
  features: [],
};

let map = L.map("map", {
  center: [0, 0],
  zoom: 3,
  //   layers: [street, placeLayer],
});

d3.json(url).then(function (data) {
  data.items.forEach((element) =>
    cities.features.push({
      type: "Feature",
      properties: {
        name: element.country,
        t: element.year - 1999,
        r: element.vei,
      },
      geometry: {
        type: "Point",
        coordinates: [element.longitude, element.latitude],
      },
    })
  );
  // for (let i = 0; i < data.items.length; i++) {
  //   console.log("Lat", data.items[i].latitude, "Lon", data.items[i].longitude);

  // let circle = L.circle([data.items[i].latitude, data.items[i].longitude], {
  //     data.items[i].vei * 400
  // color: getColor(data.items[i].vei),
  // fillColor: getColor(data.items[i].vei),
  // fillOpacity: 0.6,
  //     radius: data.items[i].vei * 4,
  //   }).addTo(map);
  // }
});

var time_lkup = [
  { t: 1, date: "2000" },
  { t: 2, date: "2001" },
  { t: 3, date: "2002" },
  { t: 4, date: "2003" },
  { t: 5, date: "2004" },
  { t: 6, date: "2005" },
  { t: 7, date: "2006" },
  { t: 8, date: "2007" },
  { t: 9, date: "2008" },
  { t: 10, date: "2009" },
  { t: 11, date: "2010" },
  { t: 12, date: "2011" },
  { t: 13, date: "2012" },
  { t: 14, date: "2013" },
  { t: 15, date: "2014" },
  { t: 16, date: "2015" },
  { t: 17, date: "2016" },
  { t: 18, date: "2017" },
  { t: 19, date: "2018" },
  { t: 20, date: "2019" },
  { t: 21, date: "2020" },
  { t: 22, date: "2021" },
  { t: 23, date: "2022" },
];

var speed = 800;

function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}
// similar to projectPoint this function converts lat/long to
// svg coordinates except that it accepts a point from our
// GeoJSON
function applyLatLngToLayer(d) {
  var y = d.geometry.coordinates[1];
  var x = d.geometry.coordinates[0];
  return map.latLngToLayerPoint(new L.LatLng(y, x));
}

//create map object and set default positions and zoom level
// let map = L.map("map", {
//   center: [0, 0],
//   zoom: 3,
//   //   layers: [street, placeLayer],
// });

function getColor(d) {
  return d === 0
    ? "#ffecb3"
    : d === 1
    ? "#ffd966"
    : d === 2
    ? "#ffc61a"
    : d === 3
    ? "#e88504"
    : d === 4
    ? "#FF7700"
    : d === 5
    ? "#FF5349"
    : d === 6
    ? "#E73927"
    : d === 7
    ? "#DD1F13"
    : d === 8
    ? "#CF0107"
    : "green";
}

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
}).addTo(map);

let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let depth = [0, 1, 2, 3, 4, 5, 6, 7, 8, "UKN"];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(depth[i]) +
      '"></i> ' +
      depth[i] +
      "<br>";
    //   (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);

console.log(cities.features.length);

// for (let i = 0; i < cities.features.length; i++) {
//   let circle = L.circle(
//     [cities.features.geometry.latitude, cities.features.geometry.latitude],
//     {
//       color: getColor(cities.features.properties.r),
//       fillColor: getColor(cities.features.properties.r),
//       fillOpacity: fillOpacity,
//       radius: cities.features.properties.r * 4,
//     }
//   ).addTo(map);
// }

// let circle = L.circle([lat, lon], {
//   color: getColor(),
//   fillColor: color,
//   fillOpacity: fillOpacity,
//   radius: radius,
// }).addTo(map);

// appending the SVG to the Leaflet map pane
// g (group) element will be inside the svg
var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

var transform = d3.geo.transform({ point: projectPoint });
var d3path = d3.geo.path().projection(transform);

var svg2 = d3
  .select("#time")
  .append("svg")
  .attr("height", 20)
  .attr("class", "time");

var time = svg2
  .append("text")
  .attr("x", 10)
  .attr("y", 20)
  .attr("class", "time")
  .style("font-size", "20px")
  .text("Date:");

function addlocations() {
  g.selectAll("circle.points").remove();
  // g.selectAll("marker.points").remove();

  var locations = g
    .selectAll("circle")
    .data(cities.features)
    .enter()
    .append("circle")
    .style("fill", function (d) {
      return getColor(d.properties.r);
    })
    .style("opacity", 0.6);

  locations
    .transition()
    .delay(function (d) {
      return speed * d.properties.t;
    })
    .attr("r", function (d) {
      return d.properties.r === "Unknown" ? 4 : d.properties.r * 4;
    })
    .attr("class", "points");

  var timer = svg2
    .selectAll(".text")
    .data(time_lkup)
    .enter()
    .append("text")
    .transition()
    .delay(function (d) {
      return speed * d.t;
    })
    .attr("x", 80)
    .attr("y", 20)
    .attr("class", "timer")
    .style("font-size", "20px")
    .style("opacity", 1)
    .text(function (d) {
      return d.date;
    })
    .transition()
    .duration(speed * 0.5)
    .style("opacity", 0);
  reset();
  map.on("viewreset", reset);

  function reset() {
    var bounds = d3path.bounds(cities),
      topLeft = bounds[0],
      bottomRight = bounds[1];

    // Setting the size and location of the overall SVG container
    svg
      .attr("width", bottomRight[0] - topLeft[0] + 120)
      .attr("height", bottomRight[1] - topLeft[1] + 120)
      .style("left", topLeft[0] - 50 + "px")
      .style("top", topLeft[1] - 50 + "px");

    g.attr(
      "transform",
      "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")"
    );

    locations.attr("transform", function (d) {
      return (
        "translate(" +
        applyLatLngToLayer(d).x +
        "," +
        applyLatLngToLayer(d).y +
        ")"
      );
    });
  }
}

// most of this code was written by Bill Vann and Amanda Nyren added logic to break out the volcano types into layers

// Create map object

// function createMap(
//   markers,
//   stratovolcano,
//   shieldVolcano,
//   submarineVolcano,
//   caldera,
//   lavaDome,
//   pyroclasticShield,
//   subGlacial,
//   complexVolcano
// ) {
//   // tile layers
//   let streetmap = L.tileLayer(
//     "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
//     {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//       subdomains: "abcd",
//       maxZoom: 20,
//     }
//   );

//   // Create a baseMaps object to hold the tile layers.
//   let baseMaps = {
//     "Street Map": streetmap,
//   };

//   // Create an overlayMaps object
//   let overlayMaps = {
//     "All Volcanoes": markers,
//     Caldera: caldera,
//     Complex: complexVolcano,
//     "Lava dome": lavaDome,
//     "Pyroclastic shield": pyroclasticShield,
//     Shield: shieldVolcano,
//     Stratovolcano: stratovolcano,
//     Subglacial: subGlacial,
//     Submarine: submarineVolcano,
//   };

//   //create map object
//   let map = L.map("map", {
//     center: [40.866667, 34.566667], //geographical center of earth from https://en.wikipedia.org/wiki/Geographical_centre_of_Earth
//     zoom: 2,
//     layers: [streetmap, markers],
//   });

//   //control layer
//   L.control
//     .layers(baseMaps, overlayMaps, {
//       collapsed: false,
//     })
//     .addTo(map);

//   //legend
//   let legend = L.control({ position: "bottomright" });

//   legend.onAdd = function (map) {
//     let div = L.DomUtil.create("div", "legend");
//     div.innerHTML += "<h4>VEI</h4>";
//     div.innerHTML += '<i style="background: #fff5eb"></i><span>0</span><br>';
//     div.innerHTML += '<i style="background: #fee6ce"></i><span>1</span><br>';
//     div.innerHTML += '<i style="background: #fdd0a2"></i><span>2</span><br>';
//     div.innerHTML += '<i style="background: #fdae6b"></i><span>3</span><br>';
//     div.innerHTML += '<i style="background: #fd8d3c"></i><span>4</span><br>';
//     div.innerHTML += '<i style="background: #f16913"></i><span>5</span><br>';
//     div.innerHTML += '<i style="background: #d94801"></i><span>6</span><br>';
//     div.innerHTML += '<i style="background: #a63603"></i><span>7</span><br>';
//     div.innerHTML += '<i style="background: #7f2704"></i><span>8</span><br>';
//     div.innerHTML +=
//       '<i style="background: #737373"></i><span>Unknown</span><br>';

//     return div;
//   };

//   legend.addTo(map);
// }

// // instatiate layer groups
// let markerGroup = L.layerGroup(null);
// let stratovolcano = L.layerGroup(null);
// let shieldVolcano = L.layerGroup(null);
// let submarineVolcano = L.layerGroup(null);
// let caldera = L.layerGroup(null);
// let lavaDome = L.layerGroup(null);
// let pyroclasticShield = L.layerGroup(null);
// let subGlacial = L.layerGroup(null);
// let complexVolcano = L.layerGroup(null);

// function createMarkers() {
//   // API
//   const url = "/readmongodb";

//   d3.json(url).then(function (data) {
//     let the_dicts = data.items;

//     // Iterate over items

//     for (let i = 0; i < the_dicts.length; i++) {
//       // Use for placing circles on map

//       let lat = the_dicts[i].latitude;
//       let lon = the_dicts[i].longitude;
//       let loc = the_dicts[i].location;
//       let name = the_dicts[i].name;
//       let country = the_dicts[i].country;
//       // let id = the_dicts[i].id;
//       let type = the_dicts[i].morphology;
//       let year = the_dicts[i].year;
//       let vei = the_dicts[i].vei;

//       // Size circles

//       if (vei > 0) {
//         radius = 100000 * vei;
//       } else {
//         radius = 100000 / Math.PI;
//       }

//       // Light to dark, less opaque to more opaque, for circles based on depth

//       if (vei == 0) {
//         color = "#fff5eb";
//         fillOpacity = 0.2;
//       } else if (vei == 1) {
//         color = "#fee6ce";
//         fillOpacity = 0.4;
//       } else if (vei == 2) {
//         color = "#fdae6b";
//         fillOpacity = 0.6;
//       } else if (vei == 3) {
//         color = "#fd8d3c";
//         fillOpacity = 0.8;
//       } else if (vei == 4) {
//         color = "#f16913";
//         fillOpacity = 0.9;
//       } else if (vei == 5) {
//         color = "#d94801";
//         fillOpacity = 0.9;
//       } else if (vei == 6) {
//         color = "#a63603";
//         fillOpacity = 0.9;
//       } else if (vei == 7) {
//         color = "#7f2704";
//         fillOpacity = 1.0;
//       } else if (vei == 8) {
//         color = "#7f2704";
//         fillOpacity = 1.0;
//       } else {
//         color = "#737373";
//         fillOpacity = 1.0;
//         radius = 50000;
//       }
//       let circle = L.circle([lat, lon], {
//         color: color,
//         fillColor: color,
//         fillOpacity: fillOpacity,
//         radius: radius,
//       });

//       let popupText =
//         name + "<br>" + type + "<br>" + year + "<br><br><b>VEI: </b>" + vei;
//       circle.bindPopup(popupText);

//       if (type == "Stratovolcano") {
//         stratovolcano.addLayer(circle);
//       } else if (type == "Shield volcano") {
//         shieldVolcano.addLayer(circle);
//       } else if (type == "Submarine volcano") {
//         submarineVolcano.addLayer(circle);
//       } else if (type == "Caldera") {
//         caldera.addLayer(circle);
//       } else if (type == "Lava dome") {
//         lavaDome.addLayer(circle);
//       } else if (type == "Pyroclastic shield") {
//         pyroclasticShield.addLayer(circle);
//       } else if (type == "Subglacial volcano") {
//         subGlacial.addLayer(circle);
//       } else if (type == "Complex volcano") {
//         complexVolcano.addLayer(circle);
//       }

//       markerGroup.addLayer(circle);
//     }
//   });
// }
// createMarkers();
// createMap(
//   markerGroup,
//   stratovolcano,
//   shieldVolcano,
//   submarineVolcano,
//   caldera,
//   lavaDome,
//   pyroclasticShield,
//   subGlacial,
//   complexVolcano
// );
