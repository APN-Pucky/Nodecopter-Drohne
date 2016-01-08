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

  socket.on('T', function (data) {
	console.log('takeoff');
	client.takeoff();
  });

  socket.on('B', function (data) {
	console.log('land');
    	//socket.emit('button2'); 
	client.stop();
	client.land();
  });
	
  socket.on(' ',function(data) {
	console.log('stop');
	client.stop();
  });

});

