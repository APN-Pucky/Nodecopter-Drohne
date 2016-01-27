var statistics = require('math-statistics');
var usonic     = require('r-pi-usonic');
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var LPORT = 3072;
var RPORT = 3071;
var RHOST = '0.0.0.0';

var sendMedian = function (distances, direction) {
    var distance = statistics.median(distances)/100;
    send(new Buffer(direction +":" +distance));
};

var initSensor = function (config) {
    var sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);

    var distances;

    (function measure() {
        if (!distances || distances.length === config.rate) {
            if (distances) {
                sendMedian(distances, config.direction);
            }

            distances = [];
        }

        setTimeout(function () {
            distances.push(sensor());

            measure();
        }, config.delay);
    }());
};

var startSensors = function()
{
      initSensor({
        echoPin: 24,
        triggerPin: 23,
        timeout: 750,//µs
        delay: 60,//ms
        rate: 5,
	direction: 0 //front
      });
      initSensor({
        echoPin: 20,
        triggerPin: 16,
        timeout: 750,//µs
        delay: 60,//ms
        rate: 5,
	direction: 1 //back
      });
      initSensor({
        echoPin: 27,
        triggerPin: 17,
        timeout: 750,//µs
        delay: 60,//ms
        rate: 5,
	direction: 2 //left
      });
      initSensor({
        echoPin: 26,
        triggerPin: 19,
        timeout: 750,//µs
        delay: 60,//ms
        rate: 5,
	direction: 3 //right
      });
}


usonic.init(function (error) {
  if (error) {
      console.log(error);
  } else {
	startSensors();
        }
});

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
    }
    if(message == 'stop') {
        RPORT = '3071';
        RHOST = '0.0.0.0';
    }
});

socket.bind(LPORT);
                
