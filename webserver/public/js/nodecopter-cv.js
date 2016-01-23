/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterCV;
    
    NodecopterCV = function (copterStream,div,algo) {
	this.copterStream = copterStream;
	this.div = div;
	this.algo = algo;
	this.setupCanvas();
	this.rgbaData     = new Uint8Array(
            this.width * this.height * 4
        );
	this.img_u8 = new jsfeat.matrix_t(this.width,this.height,jsfeat.U8C1_t);
	this.img_gxgy = new jsfeat.matrix_t(this.width,this.height,jsfeat.S32C2_t);
	this.ctx.fillStyle = "rgb(0,255,0)";
	this.ctx.strokeStyle = "rgb(0,255,0)";
	switch(this.algo) {
		case "bbfface":jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade); break;
	}
        this.update();
    };

    NodecopterCV.prototype.schedule = function(callback, element) {
          var requestAnimationFrame =
              window.requestAnimationFrame        ||
              window.webkitRequestAnimationFrame  ||
              window.mozRequestAnimationFrame     ||
              window.oRequestAnimationFrame       ||
              window.msRequestAnimationFrame      ||
              function(callback, element) {
                  var currTime = new Date().getTime(),
                      timeToCall = Math.max(0, 16 - (currTime - this.lastTime)),
                      id = window.setTimeout(function() {
                            callback(currTime + timeToCall);
                      }, timeToCall);
                  this.lastTime = currTime + timeToCall;
                  return id;
              };

          return requestAnimationFrame.call(window, callback, element);
    };

    
    NodecopterCV.prototype.bbfface=function()
    {
	this.updateMatrix();
	var pyr = jsfeat.bbf.build_pyramid(this.img_u8,24*2,24*2,4);
	var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
	rects = jsfeat.bbf.group_rectangles(rects,1);
	this.draw_faces(rects,this.width/this.img_u8.cols,1);
    };
    NodecopterCV.prototype.draw_faces=function(rects, sc, max) {
                var on = rects.length;
                if(on && max) {
                    jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
                }
                var n = max || on;
                n = Math.min(n, on);
                var r;
                for(var i = 0; i < n; ++i) {
                    r = rects[i];
                    this.ctx.strokeRect((r.x*sc)|0,(r.y*sc)|0,(r.width*sc)|0,(r.height*sc)|0);
                }
            };

    NodecopterCV.prototype.sobel=function(colorchange) {
	this.updateMatrix();
       	jsfeat.imgproc.sobel_derivatives(this.img_u8,this.img_gxgy);
	this.gxgyToImage(1);	
	if(colorchange)this.changeImageData(-255,0,-255,200);//black+gray instead of red + green
    };
    NodecopterCV.prototype.scharr=function(colorchange) {
	this.updateMatrix();
       	jsfeat.imgproc.scharr_derivatives(this.img_u8,this.img_gxgy);
	this.gxgyToImage(2);	
	if(colorchange)this.changeImageData(-255,0,-255,200);//black+gray instead of red + green
    };

    NodecopterCV.prototype.canny=function(p0,p1,p2) {
	this.updateMatrix();
       	var r = p0;
       	var kernel_size = (r+1) << 1;
       	jsfeat.imgproc.gaussian_blur(this.img_u8, this.img_u8, kernel_size, 0);

       	jsfeat.imgproc.canny(this.img_u8, this.img_u8, p1,p2);
	this.u8ToImage();
    };

    NodecopterCV.prototype.updateMatrix=function()
    {
        jsfeat.imgproc.grayscale(this.imageData.data, this.width, this.height, this.img_u8);
    };

    NodecopterCV.prototype.gxgyToImage=function(shift)
    {
		    var data_u32 = new Uint32Array(this.imageData.data.buffer);
                    var alpha = (0xff << 24);
                    var i = this.img_u8.cols*this.img_u8.rows, pix=0, gx = 0, gy = 0;
                    while(--i >= 0) {
                        gx = Math.abs(this.img_gxgy.data[i<<1]>>2)&0xff;
                        gy = Math.abs(this.img_gxgy.data[(i<<1)+1]>>2)&0xff;
                        pix = ((gx + gy)>>shift)&0xff;
                        data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
                    }
    };

    NodecopterCV.prototype.u8ToImage=function()
    {
	// render result back to canvas
        var data_u32 = new Uint32Array(this.imageData.data.buffer);
        var alpha = (0xff << 24);
        var i = this.img_u8.cols*this.img_u8.rows, pix = 0;
        while(--i >= 0) {
               pix = this.img_u8.data[i];
               data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }
    };

    
    NodecopterCV.prototype.changeImageData=function(r,g,b,a) {
	for(var k=0; k < this.imageData.data.length;	k+=4)
	{
			this.imageData.data[k+0] = this.imageData.data[k+0]+r;//red 
			this.imageData.data[k+1] = this.imageData.data[k+1]+g;//dont touch 
			this.imageData.data[k+2] = this.imageData.data[k+2]+b;//blue
			this.imageData.data[k+3] = this.imageData.data[k+3]+a;//green 
			
	}
    };

    NodecopterCV.prototype.setupCanvas = function () {
        this.canvas = document.createElement('canvas');

        this.width = this.div.attributes.width ? this.div.attributes.width.value : 640;
        this.height = this.div.attributes.height ? this.div.attributes.height.value : 360;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = "#FFFFFF";
        this.div.appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');
    };

    NodecopterCV.prototype.copterToImage = function ()
    {
	this.copterStream.getImageData(this.rgbaData);
	this.imageData = this.ctx.createImageData(this.width,this.height);
	var k = this.imageData.data.length;
	for(var i = 0; i < this.height*4;i+=4)
	{
		for(var j = this.width*4-1;j>=0;j-=4)
		{
			this.imageData.data[k-0] = this.rgbaData[i*this.width+j+1];//red 
			this.imageData.data[k-1] = this.rgbaData[i*this.width+j+0];//dont touch 
			this.imageData.data[k-2] = this.rgbaData[i*this.width+j+3];//blue
			this.imageData.data[k-3] = this.rgbaData[i*this.width+j+2];//green 
			k-=4;
		}

	}

    };

    NodecopterCV.prototype.update = function () {
        var cv = this;
        this.schedule(function () {
            cv.update();//test with this
        });

	this.copterToImage();

	switch(this.algo) {
		case "canny": this.canny(1,30,30);break;
		case "scharr": this.scharr(false);break;
		case "sobel:": this.sobel(true);break;
	}		
	
        this.ctx.putImageData(this.imageData, 0, 0);	

	switch(this.algo) {
		case "bbfface":this.bbfface(); break;
	}
    };

    window.NodecopterCV = NodecopterCV;

}(window, document, undefined));
