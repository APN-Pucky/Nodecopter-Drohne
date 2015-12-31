// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var arDrone = require('ar-drone');
var client = arDrone.createClient();
require("dronestream").listen(server);
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));



io.on('connection', function (socket) {

  socket.on('button1', function (data) {
	console.log('button1');
	client.takeoff();
  });

  socket.on('button2', function (data) {
	console.log('button2');
    	socket.emit('button2'); 
	client.stop();
	client.land();
  });
});

