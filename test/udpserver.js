var LPORT = 3072;
var RPORT = 3071;
var RHOST = '0.0.0.0';
var distdata= new Buffer('dist:xxxx');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');



function send(msg) {
	if(!(RHOST === '0.0.0.0'))socket.send(msg, 0, msg.length, RPORT, RHOST);
}

socket.on('listening', function () {
    var address = socket.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

socket.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message); 
    if(message == 'bind') {
	RPORT = remote.port;
	RHOST = remote.address;
	console.log("cahnged");
    }
    if(message == 'stop') {
	RPORT = '3071';
	RHOST = '0.0.0.0';
    }
});

socket.bind(LPORT);


