// var newYorkCoords = [40.73, -74.0059];
// var mapZoomLevel = 12;

// Create the createMap function
var myMap;

// Create a baseMaps object to hold the lightmap layer
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var earthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
var platesLink = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL
d3.json(earthquakeLink).then(function(data){
// d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createFeatures(data.features);
});

d3.json(platesLink).then(function(plates){
  // d3.json(link, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(plates);
    createPlateFeatures(plates);
});


  // // Initialize an array to hold bike markers
var quakes = [];
  // // Create the createMarkers function
function createFeatures(earthquakeData) {
    console.log(earthquakeData);
  //   // Loop through the stations array
  //   // For each station, create a marker and bind a popup with the station's name
    earthquakeData.forEach(function(d) {
      console.log(d)
      var color = "";
      if (d.properties.mag > 7)
          color = "red";
      else if (d.properties.mag  > 5)
          color = "yellow";
      else if (d.properties.mag  > 1)
          color = "green";
      else
          color = "blue";
      
  //    // Pull the "stations" property off of response.data 
  //    // Add the marker to the bikeMarkers array
      // location = ([d.geometry.coordinates]);
      // console.log(location);
      quakes.push(
        L.circle([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
          fillOpacity: 0.75,
          color: "white",
          fillColor: color,
          // Adjust radius
          radius: d.properties.mag * 20000
        }).bindPopup("<h3>" + d.properties.place +
           "</h3><hr><p>" + new Date(d.properties.time) + "<hr>" + (d.properties.mag) + "</p>"));
        })
  //       L.marker([d.lat, d.lon]).bindPopup("<h1>" + d.name + "<hr>" + d.capacity +"</h1>"));
  //       // `<h1> ${d.name} <hr> ${d.capacity}</h1>`
  //     })
    console.log(quakes);
    
 // Sending our earthquakes layer to the createMap function
 createMap(quakes);
}

function createMap(quakes) {
    // Create a layer group made from the bike markers array, pass it into the createMap function
  var earthquakes = L.layerGroup(quakes);
  console.log(earthquakes);

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

  var baseMaps = {
    Street: streetmap,
    Light: light,
    Dark: dark
  };

  var overlayMaps = {
    Earthquakes: earthquakes
    
  };

  // Create the map object with options

  var myMap = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [light, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}