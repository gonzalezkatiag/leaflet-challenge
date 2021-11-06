// create URL for the geoJson
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  function Changecolor (depth){
    if (depth>8)
    return "red"
    else if (depth>7)
    return "yellow"
    else if (depth>6)
    return"blue"
    else if (depth>5)
    return "pink"
    else if (depth>4)
    return "purple"
    else if (depth>3)
    return "orange"
    else if (depth>2)
    return "green"
    else
    return "grey"

  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer:function(feature,latlng){
      return L.circleMarker(latlng)
    },
    style:function(feature){
    return{
    radius:feature.properties.mag*3,
    fillOpacity:1,
    weight:.3,
    fillColor:Changecolor(feature.geometry.coordinates[2])
    }
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var interactivemap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(interactivemap);
  // create legend
  var legend = L.control({
    position: "bottomright"
  });
  console.log(L);
      console.log(legend);
      legend.onAdd = function () {
          var div = L.DomUtil.create("div", "info legend");
          var mag = [-10, 10, 30, 50, 70, 90];
          var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"];
            for (var i = 0; i < mag.length; i++) {
              div.innerHTML += "<i style='background: "
                + colors[i]
                + "'></i> "
                + mag[i]
                + (mag[i + 1] ? "&ndash;" + mag[i + 1] + "<br>" : "+");
            }
            return div;
      };
      // Add the info legend to the map.
legend.addTo(interactivemap);
}