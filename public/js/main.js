$(function() {
  var $b = $('.button');
  var connected = false;
  var map=[];


  var socket = io();
  $b.click(function() {
	socket.emit($(this).attr('char'));
  });
  $('#data').html("missing till<br></br> now"); 
  socket.on('data', function (data) {
	$('#data').html("X: " + d.state.x + ",<br></br>Y:" +
                    d.state.y + ",<br></br>Z:" +
                    d.state.z + ",<br></br>YAW:" +
                    d.state.yaw + ",<br></br>VX:" +
                    d.state.vx + ",<br></br>VY:" +
                    d.state.vy + "");
  });
  
  document.onkeydown = document.onkeyup = function(e) {
	if(!map[e.keyCode] && e.type == 'keydown')socket.emit(String.fromCharCode(e.keyCode));
	map[e.keyCode] = e.type == 'keydown';
	console.log(String.fromCharCode(e.keyCode));
  };
});
