$(function() {
  var $b = $('.button');
  var connected = false;
  var map=[];


  var socket = io();
  $b.click(function() {
	socket.emit($(this).attr('char'));
  });
  /*
  socket.on('eventname', function (data) {
	//DO STH
  });
  */
  document.onkeydown = document.onkeyup = function(e) {
	if(!map[e.keyCode] && e.type == 'keydown')socket.emit(String.fromCharCode(e.keyCode));
	map[e.keyCode] = e.type == 'keydown';
	console.log(String.fromCharCode(e.keyCode));
  };
});
