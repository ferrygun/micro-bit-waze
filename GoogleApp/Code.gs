var x = 0;

function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var log = ss.getSheetByName("waze");
  var country_code = log.getRange(2,1).getValue();
  var type = log.getRange(2,2).getValue().toUpperCase();

  var aUrl = "https://infotraffic.herokuapp.com/waze/traffic-notifications?latBottom=1.230481&latTop=1.470046&lonLeft=103.617382&lonRight=104.026623";
  var response = UrlFetchApp.fetch(aUrl); 
  var dataAll = JSON.parse(response.getContentText()); 
  
  var dataSet = dataAll.alerts;
  
  var lat = 0;
  var lng = 0;
  
  var data;
  var latd = [];
  var lngd = [];
  var location;
  
  for (i = 0; i < dataSet.length; i++) {
    data = dataSet[i];
    
    if(data.country == country_code) {
      if(data.type == type) {
        x = x + 1;
        lat = data.latitude;
        lng = data.longitude;
        latd.push(lat);
        lngd.push(lng);
      }
    }
    
  }
  Logger.log(x);
  
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName("data");
  var geocoder = Maps.newGeocoder().setRegion(getGeocodingRegion());
  
  sheet.getRange(2, 1, sheet.getLastRow(), sheet.getMaxColumns()).clear({contentsOnly:true});
  var j = 2;
  
  for (i = 0; i < latd.length; i++) {
    sheet.setActiveRange(sheet.getRange(j, 1)).setValue(latd[i]);
    sheet.setActiveRange(sheet.getRange(j, 2)).setValue(lngd[i]);
    location = geocoder.reverseGeocode(latd[i], lngd[i]);
    
    if (location.status == 'OK') {
      sheet.setActiveRange(sheet.getRange(j, 3)).setValue(location["results"][0]["formatted_address"]);
    }    
    j++;
  }
  
  send2uBit(x);
  
}


function send2uBit(message) {
  var URL= 'http://14173619.ngrok.io/webhook'; //Update '14173619' with Ngrok forwarding info
  var options;
  var payload;
  
  payload = {
      "message" : message
    };
  
  options = {
      "method"  : "POST",
      "payload" : payload,   
      "followRedirects" : true,
      "muteHttpExceptions": true
    };
  UrlFetchApp.fetch(URL, options);
}

function getGeocodingRegion() {
  return PropertiesService.getDocumentProperties().getProperty('GEOCODING_REGION') || 'us';
}


