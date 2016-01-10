/*jshint browser:true */
/*global Avc:true, YUVWebGLCanvas: true, Size: true, requestAnimationFrame:true */

/* requestAnimationFrame polyfill: */
(function (window) {
    'use strict';
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x,
        length,
        currTime,
        timeToCall;

    for (x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[
            vendors[x] + 'RequestAnimationFrame'
        ];
        window.cancelAnimationFrame = window[
            vendors[x] + 'CancelAnimationFrame'
        ] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            currTime = new Date().getTime();
            timeToCall = Math.max(0, 16 - (currTime - lastTime));
            lastTime = currTime + timeToCall;
            return window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}(window));


/* NodeCopterStream: */
(function (window, document, undefined) {
    'use strict';
    var WT,
        webGLCanvas,
        width,
        height;

    function setupCanvas(div) {
        var canvas = document.createElement('canvas');

        width = div.attributes.width ? div.attributes.width.value : 640;
        height = div.attributes.height ? div.attributes.height.value : 360;

        canvas.width = width;
        canvas.height = height;
        canvas.style.backgroundColor = "#333333";
        div.appendChild(canvas);

        webGLCanvas = new WebGLCanvas(canvas, new Size(width, height));
    }
    function render() {
	var arr = new Array(230400);
	var index = 0;
	for (index = 0; index < arr.length; index++) {
    	       	arr[index]=1;
 	}
	requestAnimationFrame(function(){
		webGLCanvas.texture.fill(arr,true);
		webGLCanvas.drawScene();	
	
	});
    }


    WT = function (div) {
        var hostname, port;

        setupCanvas(div);
	render();
    };



    window.WebGLTest = WT;

}(window, document, undefined));
