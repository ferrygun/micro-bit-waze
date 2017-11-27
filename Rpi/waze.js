'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const BBCMicrobit = require('bbc-microbit')

var microbit_;

// search for a micro:bit, to discover a particular micro:bit use:
//  BBCMicrobit.discoverById(id, callback); or BBCMicrobit.discoverByAddress(id, callback);

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    microbit_ = microbit;
  });
});

app.set('port', (process.env.PORT || 8080))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am micro:bit Singapore')
})

app.get('/webhook/', function (req, res) {
  res.sendStatus(200);
})

app.post('/webhook/', function (req, res) {
  let msg = JSON.parse(JSON.stringify(req.body));
  
  msg = parseInt(msg.message).toString();
  // console.log(msg);

  microbit_.writeLedText(msg, function() {
      console.log('\ttext sent');

      //microbit.disconnect();
    });
  res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
