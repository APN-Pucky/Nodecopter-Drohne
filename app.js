// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var arDrone = require('ar-drone');
var client = arDrone.createClient();
require('dronestream').listen(server);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

client.config('general:navdata_demo', 'FALSE');
//client.on('navdata', handleNav);

function handleNav(data) {
	if(!data.altitude) { return; }
	console.log(data.altitude.raw);
}

io.on('connection', function (socket) {
  	socket.on('T', takeoff);
  	socket.on('B', land);
  	socket.on('W', forward); 
  	socket.on('S', backward); 
  	socket.on('A', left); 
  	socket.on('D', right); 
  	socket.on('I', up); 
  	socket.on('K', down); 
  	socket.on('J', rotleft); 
  	socket.on('L', rotright); 
  	socket.on(' ', stop); 
  	socket.on('C', camera);
	socket.on('Y', testFlight);
});


var $cam = 0;
var $speed = 0.1;

function log(str) {
	console.log(str);
}

function takeoff(){
  	client.takeoff();
  	log('takeoff');
}
function land() {
	client.stop();
	client.land();
	log('land');
}
function stop() {
	client.stop();
	log('stop');
}
function camera() {
	$cam = ($cam+3)%6;
 	client.config('video:video_channel', $cam);
	log('camera');
}
function forward() {
	client.front($speed);
	log('forward');
}
function backward() {
	client.back($speed);
	log('backward');
}
function left() {
	client.left($speed);
	log('left');
}
function right() {
	client.right($speed);
	log('right');
}
function up() {
	client.up($speed);
	log('up');
}
function down() {
	client.down($speed);
	log('down');
}
function rotleft() {
	client.counterClockwise($speed);
	log('rotleft');
}
function rotright() {
	client.clockwise($speed);
	log('rotright');
}
function testFlight() {
	takeoff();
	client.after(4000, forward);
	client.after(2000, stop);
	client.after(1000, right);
	client.after(4000, stop);
	client.after(1000, rotleft);
	client.after(10000, forward);
	client.after(4000, stop);
	client.clockwise(1);
	log('Finished Test Run!');
}

