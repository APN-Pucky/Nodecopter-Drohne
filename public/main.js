$(function() {
  var $window = $(window);
  var $b1 = $('.button1');
  var connected = false;

  var socket = io();
  $b1.click(function() {
	socket.emit('button1');
	});
  $('#button2').click(function() {
	socket.emit('button2');
	});
  socket.on('button2', function (data) {
	//DO STH
	$('#button2').css({"width" : "1000px"});
  });

});
