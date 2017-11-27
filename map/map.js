var map;
var locations = [];
var title;
var lat;
var lng;
var show = false;

function initialiseMap() {

  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1YtEiX-mooA452kkJjy8zt6JgHE1xBwfjPKak639dx48/values/data!A2:C?key=AIzaSyDPjV8XfyJujTnp6ygwXlVTe1YBFacFVLA", function(data) {
    	// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    	// Modify the code below to suit the structure of your spreadsheet.
		
		$(data.values).each(function() {
			if (typeof this[2] == 'undefined')	
				title = 'none';
			else
				title = this[2];
    	
		    lat = this[0];
			lng = this[1];

			if (typeof lat == 'undefined' && typeof lng == 'undefined') 
				show = false;
			else
				show = true;


			//console.log(title +":" + lat + ":" + lng);

    		var location = {};
				location.title = title;
				location.latitude = parseFloat(lat);
      	        location.longitude = parseFloat(lng);
	  		    locations.push(location);
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(1.352083, 103.819836)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	  if (show) 
		setLocations(map, locations);
	  
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow);
    bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
	var image = 'police.png';
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: location.title,
	icon: image
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>' + ((location.url === undefined) ? location.title : ('<a href="' + location.url +'">' + location.title + '</a>')) +
    '</div>');
    infowindow.open(map, marker);
  });
  return marker;
}