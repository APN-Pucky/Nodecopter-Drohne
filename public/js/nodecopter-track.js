/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterTrack;
    //var state = []; 
    NodecopterTrack = function(div) {
	this.div = div;
	this.setupCanvas();
	this.x = this.width/2;
	this.y = this.height/2;
	this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.strokeStyle = "rgb(0,0,0)";
	this.ctx.font = "10px Arial";
	this.ctx.fillText("1 m",5,10);
	this.ctx.moveTo(5,15);
	this.ctx.lineTo(5,25);
	this.ctx.moveTo(5,20);
	this.ctx.lineTo(25,20);
	this.ctx.moveTo(25,15);
	this.ctx.lineTo(25,25);
	this.ctx.stroke();
	this.ctx.fillStyle = "rgb(0,255,0)";
        this.ctx.strokeStyle = "rgb(0,255,0)";
	this.ctx.moveTo(this.x,this.y);
	var tracker = this;
	io().on('data', function (data) {
		//state[state.length] = data.state;
		tracker.update(data.state.x,data.state.y);
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

    NodecopterTrack.prototype.update = function(x,y) {
	this.ctx.lineTo(this.x+(x*20),this.y-(y*20));
	this.ctx.stroke();
    };

    window.NodecopterTrack = NodecopterTrack;

}(window, document, undefined));
