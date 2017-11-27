# micro-bit-waze
Monitor Traffic Police Whereabout with micro:bit and Waze

Setup:

1. Google Sheets
Create Google App script on Google Sheets to fetch the traffic police whereabout information from Waze.
Get Singapore map:
https://infotraffic.herokuapp.com/wa…/traffic-notifications…

Parameter on Google Sheets:
-Country Code: SN (Singapore)
-Type: Police (You can also change to other type like: Accident to get the accidents info)
The Google Sheets will update the traffic police whereabout information on the "data" sheet with the following format:
Latitude, Longitude and Address

Schedule the Google App script to run every minute. 
If there is any traffic police info, the total number of traffic police info will be sent to the Raspberry Pi NodeJS WebHook app.
https://docs.google.com/…/1YtEiX-mooA452kkJjy8zt6JgHE…/edit…

2. WebHook and NodeJS App on raspberry pi
Run the Ngrok WebHook: ./ngrok http 8080
Get the forwarding parameter info and update the URL on Google app script (line 63):
var URL= 'http://14173619.ngrok.io/webhook'; //Update '14173619' with Ngrok forwarding info
Run the NodeJS app: ./node waze.js

3. Front-end app to get the whereabout information.
Open the https://ferrygun.github.io/micro-bit-waze/map/index.html to get the whereabout information.

https://youtu.be/zeUn66bCovM

Source code:
https://github.com/ferrygun/micro-bit-waze
