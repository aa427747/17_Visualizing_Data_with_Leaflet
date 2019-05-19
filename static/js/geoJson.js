// Salina, KS coordinates = [38.8403, -97.6114];
// var mapZoomLevel = 7;

// Create the createMap function
var myMap;

// Create a baseMaps object to hold the lightmap layer
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Perform a GET request to the query URL
d3.json(link).then(function(data){
// d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createFeatures(data.features);
});

function popmarkerSize(mag) {
  return mag * 20000;
}

function createFeatures(earthquakeData) {
  console.log(earthquakeData);

  earthquakeData.forEach(function(d) {    
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var earthquakeCircle = [];
  function onEachFeature(feature, layer) {
    console.log(feature, layer);
    var color = "";
    if (feature.properties.mag > 7)
        color = "red";
    else if (feature.properties.mag  > 5)
        color = "yellow";
    else if (feature.properties.mag > 1)
        color = "green";
    else
        color = "blue";
    earthquakeCircle.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: popmarkerSize(feature.properties.mag)
    }))
    layer.bindPopup("<h3>" + feature.properties.place +
                    "</h3><hr><p>" + new Date(feature.properties.time) + 
                    "<hr>" + (feature.properties.mag) + "</p>");
    // console.log(layer)
  }
 

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
   
  }); 

  // })
  console.log(earthquakes, earthquakeCircle);

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, earthquakeCircle);
})
}

function createMap(earthquakes, earthquakeCircle) {
  console.log(earthquakes, earthquakeCircle);
    // Create a layer group made from the bike markers array, pass it into the createMap function
  var earthquakeLayer = L.layerGroup(earthquakeCircle);

  console.log(earthquakes, earthquakeLayer);

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create an overlayMaps object to hold the bikeStations layer
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });

  var comic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.comic",
  accessToken: API_KEY
  });

  var pirate = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pirates",
  accessToken: API_KEY
  });

  var baseMaps = {
    "Street": streetmap,
    "Light": light,
    "Dark": dark,
    "Comic": comic,
    "Pirate": pirate
  };

  var overlayMaps = {
    Earthquakes: earthquakes,
    Earthquake_circles: earthquakeLayer
    // Color: color
    
  };

  // Create the map object with options

  var myMap = L.map("map-id", {
    center: [38.8403, -97.6114],
    zoom: 3,
    layers: [pirate, earthquakeLayer]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

// L.control.layers(baseMaps, overlayMaps).addTo(myMap);
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


}

  





