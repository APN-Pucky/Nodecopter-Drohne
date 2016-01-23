var LPORT = 3071;
var RPORT = 3072;
var RHOST = '127.0.0.1';


var dgram = require('dgram');
var bind = new Buffer('bind');
var stop = new Buffer('stop');

var socket = dgram.createSocket('udp4');

process.on('SIGINT', function() {
	console.log("SIGINT");
	send(stop);
	socket.close();
	process.exit();
});

function send(msg) {
	socket.send(msg, 0, msg.length, RPORT, RHOST);
}

socket.on('listening', function () {
    var address = socket.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

socket.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
});

socket.bind(LPORT);

send(bind);
