/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterTrack,
	lastTime
	canvas
	width
	height;
    function schedule (callback, element) {
          var requestAnimationFrame =
              window.requestAnimationFrame        ||
              window.webkitRequestAnimationFrame  ||
              window.mozRequestAnimationFrame     ||
              window.oRequestAnimationFrame       ||
              window.msRequestAnimationFrame      ||
              function(callback, element) {
                  var currTime = new Date().getTime(),
                      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                      id = window.setTimeout(function() {
                            callback(currTime + timeToCall);
                      }, timeToCall);
                  lastTime = currTime + timeToCall;
                  return id;
              };

          return requestAnimationFrame.call(window, callback, element);
    }

    function setupCanvas(div) {
        canvas = document.createElement('canvas');

        width = div.attributes.width ? div.attributes.width.value : 640;
        height = div.attributes.height ? div.attributes.height.value : 360;

        canvas.width = width;
        canvas.height = height;
        canvas.style.backgroundColor = "#333333";
        div.appendChild(canvas);

    }
    NodecopterTrack = function (copterStream,div, imgId) {
	setupCanvas(div);
        var tracker = this;
	this.rgbaData     = new Uint8Array(
            width * height * 4
        );
        this.update();
    };

    NodecopterTrack.prototype.update = function () {
        var tracker = this;
        schedule(function () {
            tracker.update();
        });
	copterStream.getImageData(rgbaData);
	canvas.getContext('2d').drawImageData(rgbaData,0,0,width,height);
    };

    window.NodecopterTrack = NodecopterTrack;

}(window, document, undefined));
