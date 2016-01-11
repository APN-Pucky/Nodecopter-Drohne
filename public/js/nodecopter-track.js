/*jshint browser:true */
/*global jsfeat:true console:true */
(function (window, document, undefined) {
    'use strict';
    var NodecopterTrack,
	lastTime,
	canvas,
	ctx,
	imageData,
	img_u8,
	img_gxgy,
	rgbaData,
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
        canvas.style.backgroundColor = "#FFFFFF";
        div.appendChild(canvas);
	ctx = canvas.getContext('2d');

    }
    function bbfface()
    {
	updateMatrix();
	var pyr = jsfeat.bbf.build_pyramid(img_u8,24*2,24*2,4);
	var rects = jsfeat.bbf.detect(pyr, jsfeat.bbf.face_cascade);
	rects = jsfeat.bbf.group_rectangles(rects,1);
	draw_faces(rects,width/img_u8.cols,1);
    }
    function draw_faces(rects, sc, max) {
                var on = rects.length;
                if(on && max) {
                    jsfeat.math.qsort(rects, 0, on-1, function(a,b){return (b.confidence<a.confidence);})
                }
                var n = max || on;
                n = Math.min(n, on);
                var r;
                for(var i = 0; i < n; ++i) {
                    r = rects[i];
                    ctx.strokeRect((r.x*sc)|0,(r.y*sc)|0,(r.width*sc)|0,(r.height*sc)|0);
                }
            }

    function sobel(colorchange) {
	updateMatrix();
       	jsfeat.imgproc.sobel_derivatives(img_u8,img_gxgy);
	gxgyToImage(1);	
	if(colorchange)changeImageData(-255,0,-255,200);//black+gray instead of red + green
    }
    function scharr(colorchange) {
	updateMatrix();
       	jsfeat.imgproc.scharr_derivatives(img_u8,img_gxgy);
	gxgyToImage(2);	
	if(colorchange)changeImageData(-255,0,-255,200);//black+gray instead of red + green
    }

    function canny(p0,p1,p2) {
	updateMatrix();
       	var r = p0;
       	var kernel_size = (r+1) << 1;
       	jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

       	jsfeat.imgproc.canny(img_u8, img_u8, p1,p2);
	u8ToImage();
    }

    function updateMatrix()
    {
        jsfeat.imgproc.grayscale(imageData.data, width, height, img_u8);
    }

    function gxgyToImage(shift)
    {
		    var data_u32 = new Uint32Array(imageData.data.buffer);
                    var alpha = (0xff << 24);
                    var i = img_u8.cols*img_u8.rows, pix=0, gx = 0, gy = 0;
                    while(--i >= 0) {
                        gx = Math.abs(img_gxgy.data[i<<1]>>2)&0xff;
                        gy = Math.abs(img_gxgy.data[(i<<1)+1]>>2)&0xff;
                        pix = ((gx + gy)>>shift)&0xff;
                        data_u32[i] = (pix << 24) | (gx << 16) | (0 << 8) | gy;
                    }
    } 

    function u8ToImage()
    {
	// render result back to canvas
        var data_u32 = new Uint32Array(imageData.data.buffer);
        var alpha = (0xff << 24);
        var i = img_u8.cols*img_u8.rows, pix = 0;
        while(--i >= 0) {
               pix = img_u8.data[i];
               data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }
    }

    function copterToImage()
    {
	copterStream.getImageData(rgbaData);
	imageData = ctx.createImageData(width,height);
	var k =imageData.data.length;
	for(var i = 0; i < height*4;i+=4)
	{
		for(var j =width*4-1;j>=0;j-=4)
		{
			imageData.data[k-0] = rgbaData[i*width+j+1];//red 
			imageData.data[k-1] = rgbaData[i*width+j+0];//dont touch 
			imageData.data[k-2] = rgbaData[i*width+j+3];//blue
			imageData.data[k-3] = rgbaData[i*width+j+2];//green 
			k-=4;
		}

	}

    }
    function changeImageData(r ,g,b,a) {
	for(var k=0; k < imageData.data.length;	k+=4)
	{
			imageData.data[k+0] = imageData.data[k+0]+r;//red 
			imageData.data[k+1] = imageData.data[k+1]+g;//dont touch 
			imageData.data[k+2] = imageData.data[k+2]+b;//blue
			imageData.data[k+3] = imageData.data[k+3]+a;//green 
			
	}
    }
    NodecopterTrack = function (copterStream,div) {
	setupCanvas(div);
        var tracker = this;
	rgbaData     = new Uint8Array(
            width * height * 4
        );
	img_u8 = new jsfeat.matrix_t(width,height,jsfeat.U8C1_t);
	img_gxgy = new jsfeat.matrix_t(width,height,jsfeat.S32C2_t);
	ctx.fillStyle = "rgb(0,255,0)";
	ctx.strokeStyle = "rgb(0,255,0)";
	//jsfeat.bbf.prepare_cascade(jsfeat.bbf.face_cascade);
        this.update();
    };

    NodecopterTrack.prototype.update = function () {
        var tracker = this;
        schedule(function () {
            tracker.update();
        });

	copterToImage();	    
	//canny(1,30,30);	
	//scharr(false);
	//sobel(true);
        ctx.putImageData(imageData, 0, 0);	
	//bbfface();
    };

    window.NodecopterTrack = NodecopterTrack;

}(window, document, undefined));
