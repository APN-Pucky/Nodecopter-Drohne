// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var arDrone = require('ar-drone');
var arDroneConstants = require('ar-drone/lib/constants');
var client = arDrone.createClient();

var autonomy = require('ardrone-autonomy');
var ctrl = new autonomy.Controller(client, {debug: false});
require('dronestream').listen(server);

require("./udpclient.js")('192.168.1.2',function(data){console.log(""+ data);io.sockets.emit('sonar', ""+data); });

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

function navdata_option_mask(c) {
	return 1 << c;
}
var navdata_options = (
	navdata_option_mask(arDroneConstants.options.DEMO)
	| navdata_option_mask(arDroneConstants.options.VISION_DETECT)
	| navdata_option_mask(arDroneConstants.options.MAGNETO)
	| navdata_option_mask(arDroneConstants.options.WIFI)
);
	  
client.config('general:navdata_demo', true);
client.config('general:navdata_options', navdata_options);
client.config('video_channel', 1);
client.config('detext:detext_type', 12);

ctrl.on('controlData', handleData);

function handleData(data) {
	io.sockets.emit('data', data);	
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
	socket.on('Z',zero);
});


var $cam = 0;
var $speed = 0.5;
var $ang = 10;

function log(str) {
	console.log(str);
}
function takeoff(){
  	client.takeoff();
  	log('takeoff');
}
function zero(){
  	ctrl.zero();
  	log('zero');
}

function land() {
	client.stop();
	client.land();
	log('land');
}
function stop() {
	ctrl.hover();
	log('stop');
}
function camera() {
	$cam = ($cam+3)%6;
 	client.config('video:video_channel', $cam);
	log('camera');
}
function forward() {
	ctrl.forward($speed);
	log('forward');
}
function backward() {
	ctrl.backward($speed);
	log('backward');
}
function left() {
	ctrl.left($speed);
	log('left');
}
function right() {
	ctrl.right($speed);
	log('right');
}
function up() {
	ctrl.up($speed);
	log('up');
}
function down() {
	ctrl.down($speed);
	log('down');
}
function rotleft() {
	ctrl.ccw($ang);
	log('rotleft');
}
function rotright() {
	ctrl.cw($ang);
	log('rotright');
}
