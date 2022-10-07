// most of this code was written by Bill Vann and Amanda Nyren added logic to break out the volcano types into layers

// Create map object

function createMap(markers, stratovolcano,shieldVolcano, submarineVolcano,caldera,lavaDome, pyroclasticShield,subGlacial, complexVolcano){
    // tile layers
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object to hold the tile layers.
    let baseMaps = {
        "Street Map": streetmap,
      };
    
    // Create an overlayMaps object 
    let overlayMaps = {
        "All Volcanoes":markers,
        "Caldera": caldera,
        "Complex": complexVolcano,
        "Lava dome":lavaDome,
        "Pyroclastic shield": pyroclasticShield,
        "Shield":shieldVolcano,
        "Stratovolcano":stratovolcano,
        "Subglacial": subGlacial,
        "Submarine":submarineVolcano,
      }

    //create map object
    let map = L.map("map", {
        center: [40.866667, 34.566667], //geographical center of earth from https://en.wikipedia.org/wiki/Geographical_centre_of_Earth
        zoom: 2,
        layers: [streetmap, markers]
      });

    //control layer
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    
    //legend
    let legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function (map) {
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
        div.innerHTML +=
        '<i style="background: #737373"></i><span>Unknown</span><br>';

        return div;
    };

    legend.addTo(map);
};

// instatiate layer groups
let markerGroup = L.layerGroup(null);
let stratovolcano = L.layerGroup(null);
let shieldVolcano = L.layerGroup(null);
let submarineVolcano = L.layerGroup(null);
let caldera = L.layerGroup(null);
let lavaDome = L.layerGroup(null);
let pyroclasticShield = L.layerGroup(null);
let subGlacial = L.layerGroup(null);
let complexVolcano = L.layerGroup(null);

function createMarkers(){
    // API
    const url = "/readmongodb";

    d3.json(url).then(function (data) {
    let the_dicts = data.items;

    // Iterate over items

    for (let i = 0; i < the_dicts.length; i++) {
        // Use for placing circles on map

        let lat = the_dicts[i].latitude;
        let lon = the_dicts[i].longitude;
        let loc = the_dicts[i].location;
        let name = the_dicts[i].name;
        let country = the_dicts[i].country;
        // let id = the_dicts[i].id;
        let type = the_dicts[i].morphology;
        let year = the_dicts[i].year;
        let vei = the_dicts[i].vei;

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
            radius: radius,
            });

        let popupText = name + "<br>" + type + "<br>" + year + "<br><br><b>VEI: </b>" + vei ;
        circle.bindPopup(popupText);
        
        if(type=="Stratovolcano"){
            stratovolcano.addLayer(circle);
        }
        else if (type=="Shield volcano"){
            shieldVolcano.addLayer(circle);
        }
        else if (type =="Submarine volcano"){
            submarineVolcano.addLayer(circle);
        }
        else if (type == "Caldera"){
            caldera.addLayer(circle);
        }
        else if (type == "Lava dome"){
            lavaDome.addLayer(circle);
        }
        else if (type == "Pyroclastic shield"){
            pyroclasticShield.addLayer(circle);
        }
        else if (type == "Subglacial volcano"){
            subGlacial.addLayer(circle);
        }
        else if (type == "Complex volcano"){
            complexVolcano.addLayer(circle);
        }
       
        markerGroup.addLayer(circle);
        
        
    }
    });
};
createMarkers();
createMap(markerGroup, stratovolcano, shieldVolcano, submarineVolcano, caldera,lavaDome, pyroclasticShield,subGlacial, complexVolcano);