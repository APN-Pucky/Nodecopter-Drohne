$(function() {
  var $b = $('.button');
  var connected = false;


  var socket = io();
  $b.click(function() {
	socket.emit($(this).attr('char'));
  });
  /*
  socket.on('eventname', function (data) {
	//DO STH
  });
  */
  $(document).keydown(function(e) {
	socket.emit(String.fromCharCode(e.keyCode));
  });
});
