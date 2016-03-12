/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterTrack,
	radius = 10,
	zoom = 100;
    //var state = []; 
    NodecopterTrack = function(div) {
	this.div = div;
	this.setupCanvas();
	this.x = this.width/2;
	this.y = this.height/2;
    	this.curx = 0;
    	this.cury = 0;  
    	this.curyaw = 0;  
	this.ctx.beginPath();
	this.ctx.font = "10px Arial";
	this.ctx.fillText("1 m",5,10);
	this.ctx.beginPath();
	this.ctx.strokeStyle = "rgb(0,0,0)";
	this.ctx.moveTo(5,15);
	this.ctx.lineTo(5,25);
	this.ctx.moveTo(5,20);
	this.ctx.lineTo(zoom+5,20);
	this.ctx.moveTo(zoom+5,15);
	this.ctx.lineTo(zoom+5,25);
	this.ctx.stroke();

	this.ctx.beginPath();
	this.ctx.moveTo(this.x,this.y);
	//this.update(0,0);

	//this.update(3,2);
	//this.update(-1,3);
	//this.update(1,2);
	var tracker = this;
	io().on('data', function (data) {
		//state[state.length] = data.state;
		tracker.update(data.state);
  	});	
	io().on('sonar', function (data) {
		tracker.sonar(data);
  	});
    };

    NodecopterTrack.prototype.setupCanvas = function () {
        this.canvas = document.createElement('canvas');

        this.width = this.div.attributes.width ? this.div.attributes.width.value : 640;
        this.height = this.div.attributes.height ? this.div.attributes.height.value : 360;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = "#FFFFFF";
        this.div.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    };

    NodecopterTrack.prototype.update = function(state) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = "rgb(0,255,0)";
      	this.ctx.moveTo(this.x+this.curx*zoom,this.y-this.cury*zoom);
    	this.cury = state.x;
    	this.curx = state.y;  
      	this.curyaw = state.yaw;
	this.ctx.lineTo(this.x+(this.curx*zoom),this.y-(this.cury*zoom));
	this.ctx.stroke();
	//this.ctx.strokeStyle = "rgb(0,0,0)";
	//this.ctx.strokeRect(this.x+(this.curx*zoom),this.y-(this.cury*zoom),0.4*zoom,0.4*zoom);
    };

     NodecopterTrack.prototype.sonar = function(sonar) {
	//rotate
	this.ctx.beginPath();
	this.ctx.strokeStyle = "rgb(0,0,255)";
       	var dist = parseFloat(sonar.split(':')[1]);
	var yaw = this.curyaw+parseInt(sonar.split(':')[0])*90;
	if(dist > 0.2 && dist < 5) 
	{
		this.ctx.moveTo(this.x+(this.curx +Math.sin(yaw)*dist)*zoom+radius,this.y-(this.cury+Math.cos(yaw)*dist)*zoom);
       		this.ctx.arc(this.x+(this.curx +Math.sin(yaw)*dist)*zoom,this.y-(this.cury+Math.cos(yaw)*dist)*zoom,radius, 0, 2*Math.PI);
	}
       	this.ctx.stroke();

    };
    window.NodecopterTrack = NodecopterTrack;

}(window, document, undefined));
