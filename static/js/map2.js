const url = "/readmongodb";

// Converting data into GeoJson format
let cities = {
  type: "FeatureCollection",
  features: [],
};

d3.json(url).then(function (data) {
  data.items.forEach((element) =>
    cities.features.push({
      type: "Feature",
      properties: {
        name: element.country,
        t: element.year - 1999,
        r: element.vei,
        year: element.year,
        vtype: element.morphology,
      },
      geometry: {
        type: "Point",
        coordinates: [element.longitude, element.latitude],
      },
    })
  );
  createLayer();
});

let darkMode = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    // subdomains: "abcd",
    maxZoom: 20,
  }
);

let streetmap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

let baseMaps = {
  "Dark Mode": darkMode,
  "Light Mode": streetmap,
};

let allMarker = L.layerGroup(null);
let stratovolcano = L.layerGroup(null);
let shieldVolcano = L.layerGroup(null);
let submarineVolcano = L.layerGroup(null);
let caldera = L.layerGroup(null);
let lavaDome = L.layerGroup(null);
let pyroclasticShield = L.layerGroup(null);
let subGlacial = L.layerGroup(null);
let complexVolcano = L.layerGroup(null);

const arr = [
  { layer: allMarker, morphology: "" },
  { layer: stratovolcano, morphology: "Stratovolcano" },
  { layer: shieldVolcano, morphology: "Shield volcano" },
  { layer: submarineVolcano, morphology: "Submarine volcano" },
  { layer: caldera, morphology: "Caldera" },
  { layer: lavaDome, morphology: "Lava dome" },
  { layer: pyroclasticShield, morphology: "Pyroclastic shield" },
  { layer: subGlacial, morphology: "Subglacial volcano" },
  { layer: complexVolcano, morphology: "Complex volcano" },
];

function createLayer() {
  for (let i = 0; i < arr.length; i++) {
    const markerLayer = L.geoJson(cities, {
      style: function (feature) {
        return {
          color: getColor(feature.properties.r),
        };
      },
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius:
            feature.properties.r === "Unknown" ? 4 : feature.properties.r * 4,
          fillOpacity: 0.5,
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<strong>${feature.properties.name}</strong> <br>${feature.properties.year} <br><br><b>VEI: </b>${feature.properties.r}`
        );
      },
      filter: function (feature, layer) {
        return arr[i].morphology
          ? feature.properties.vtype === arr[i].morphology
          : feature.properties.vtype;
      },
    });

    arr[i].layer.addLayer(markerLayer);
  }
}

let map = L.map("map", {
  center: [0, 0],
  zoom: 3,
  layers: [darkMode, allMarker],
});

let overlayMaps = {
  "All Volcanoes": allMarker,
  Caldera: caldera,
  Complex: complexVolcano,
  "Lava dome": lavaDome,
  "Pyroclastic shield": pyroclasticShield,
  Shield: shieldVolcano,
  Stratovolcano: stratovolcano,
  Subglacial: subGlacial,
  Submarine: submarineVolcano,
};

// Creating control layer
L.control
  .layers(baseMaps, overlayMaps, {
    // collapsed: false,
  })
  .addTo(map);

// function to color the markers
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

// creating the legend
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
  }

  return div;
};
legend.addTo(map);

// time variable for animation
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
  .text("Year:");

function addlocations() {
  g.selectAll("circle.points").remove();

  map.removeLayer(allMarker);

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
