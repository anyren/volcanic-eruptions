const url = "/readmongodb";

// Converting data into GeoJson format
let cities = {
  type: "FeatureCollection",
  features: [],
};

d3.json(url).then(function (data) {
  console.log(data.items);
  data.items.forEach((element) =>
    cities.features.push({
      type: "Feature",
      properties: {
        name: element.name,
        country: element.country,
        t: element.year - 1999,
        r: element.vei,
        year: element.year,
        time: `${element.year}`,
        vtype: element.morphology,
      },
      geometry: {
        type: "Point",
        coordinates: [element.longitude, element.latitude],
      },
    })
  );
  createLayer();
  sliderLayer();
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
          `<h5>${feature.properties.name} (${feature.properties.year})</h5> <b>Country:</b> ${feature.properties.country} <br> <b>Volcano Type:</b> ${feature.properties.vtype}<br><b>VEI: </b>${feature.properties.r}`
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
  zoom: 2,
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
    collapsed: false,
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
  div.innerHTML += "<h4>VEI</h4>";
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
  .attr("id", "year")
  .style("font-size", "20px")
  .text("Year:");

let abort = false;
function dosomething() {
  var elem = document.getElementById("clickMe");

  if (elem.value == "PLAY") {
    elem.value = "RESET";
    abort = false;

    addlocations();
  } else {
    elem.value = "PLAY";
    abort = true;

    removelocations();
    return;
  }
}

var timeValue = null;
function addlocations() {
  // setTimeout(function timer() {
  // g.selectAll("circle.points").remove();

  for (let i = 0; i < arr.length; i++) {
    map.removeLayer(arr[i].layer);
  }

  for (let i = 0; i < layers.length; i++) {
    map.removeLayer(layers[i]);
  }

  var elem = document.getElementById("year");
  count = 2000;
  console.log(document.getElementsByClassName("leaflet-clickable").length);

  if (document.getElementsByClassName("leaflet-clickable").length === 0) {
    for (let i = 0; i < layers.length; i++) {
      setTimeout(() => {
        if (abort == false) {
          map.addLayer(layers[i]);
          elem.innerHTML = `Year: ${count + i}`;
        }
      }, 1000 * i);
    }
  }
}

function removelocations() {
  var elem = document.getElementById("year");
  elem.innerHTML = `Year: `;

  for (let i = 0; i < arr.length; i++) {
    map.removeLayer(arr[i].layer);
  }

  for (let i = 0; i < layers.length; i++) {
    map.removeLayer(layers[i]);
  }
}

// Slider Control
let layers = [];
function sliderLayer() {
  for (let i = 2000; i < 2023; i++) {
    var sliderMarkerLayer = L.geoJson(cities, {
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
          `<h5>${feature.properties.name} (${feature.properties.year})</h5> <b>Country:</b> ${feature.properties.country} <br> <b>Volcano Type:</b> ${feature.properties.vtype}<br><b>VEI: </b>${feature.properties.r}`
        );
      },
      filter: function (feature, layer) {
        // console.log(feature.properties.time, i);
        return feature.properties.time === `${i}`;
      },
    });
    layers.push(sliderMarkerLayer);
  }
  layerGroup = L.layerGroup(layers);
  sliderControl = L.control.sliderControl({
    layer: layerGroup,
    follow: true,
    // alwaysShowDate: true,
  });
  map.addControl(sliderControl);
  sliderControl.startSlider();

  for (let i = 0; i < layers.length; i++) {
    map.removeLayer(layers[i]);
  }
}
