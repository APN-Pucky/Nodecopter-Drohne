/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterTrack,
	lastTime,
	canvas,
	ctx,
	width,
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
	ctx = canvas.getContext('2d');

    }
    NodecopterTrack = function (copterStream,div, imgId) {
	setupCanvas(div);
        var tracker = this;
	this.rgbaData     = new Uint8Array(
            width * height * 4
        );
        this.update();
    };

    function cany(imageData) {
		    //var imageData = ctx.getImageData(0, 0, 640, 480);
		    var img_u8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
		    
                    jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);

                    var r = 1;
                    var kernel_size = (r+1) << 1;

                    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

                    jsfeat.imgproc.canny(img_u8, img_u8, 30,30);
	//		console.log("size" + img_u8.data.length);
		/*	var p = 0;
			for(var i =0;i<img_u8.data.length;i+=4)
			{
				
				imageData.data[i+0] = 0xff <<24;
				imageData.data[i+1] = img_u8.data[p]<<16;
				imageData.data[i+2] = img_u8.data[p]<<8;
				imageData.data[i+3] = img_u8.data[p];
				p++;
			}*/
		  /*  for(var i = 0; i < img_u8.rows*4;i+=4)
		    {
			for(var j =img_u8.cols*4-1;j>=0;j-=4)
			{
				imageData.data[k-0] = img_u8.datakk[i*width+j+1]; 
				imageData.data[k-1] = this.rgbaData[i*width+j+0]; 
				imageData.data[k-2] = this.rgbaData[i*width+j+3]; 
				imageData.data[k-3] = 8-this.rgbaData[i*width+j+2]; 
				k-=4;
			}
		    } */
                    // render result back to canvas
                    var data_u32 = new Uint32Array(imageData.data.buffer);
                    var alpha = (0xff << 24);
                    var i = img_u8.cols*img_u8.rows, pix = 0;
                    while(--i >= 0) {
                        pix = img_u8.data[i];
                        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
                    }

                    ctx.putImageData(imageData, 0, 0);	
    }

    NodecopterTrack.prototype.update = function () {
        var tracker = this;
        schedule(function () {
            tracker.update();
        });
	copterStream.getImageData(this.rgbaData);
	var imageData = ctx.createImageData(width,height);
	var k =imageData.data.length;
	for(var i = 0; i < height*4;i+=4)
	{
		for(var j =width*4-1;j>=0;j-=4)
		{
			imageData.data[k-0] = this.rgbaData[i*width+j+1];//red 
			imageData.data[k-1] = this.rgbaData[i*width+j+0];//dont touch 
			imageData.data[k-2] = this.rgbaData[i*width+j+3];//blue
			imageData.data[k-3] = this.rgbaData[i*width+j+2];//green 
			k-=4;
		}

	}    
	//ctx.putImageData(imageData,0,0);
	cany(imageData);	

	//console.log("image");
    };

    window.NodecopterTrack = NodecopterTrack;

}(window, document, undefined));
