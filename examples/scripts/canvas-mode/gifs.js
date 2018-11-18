#!/usr/bin/env node

window = {};

var Matrix = require('../../../index.js');
var GIF = require('omggif');
var path = require('path');
var fs = require('fs');


class Sample extends Matrix {


    loadGIF(name) {

        function fileExists(path) {

            try {
                fs.accessSync(path);		
                return true;
            }
            catch (error) {
            }
        
            return false;		
        }

        var fileName = '';

        if (!fileExists(fileName))
            fileName = path.join(__dirname, '../../gifs/96x96', name + '.gif');
 
        if (!fileExists(fileName))
            fileName = path.join(__dirname, '../../gifs/32x32', name + '.gif');

 
        return fs.readFileSync(fileName);    
    }


    run() {
        var gif = new GIF.GifReader(this.loadGIF('circuitry'));
        var ctx = this.canvas.getContext('2d');
        var numFrames = gif.numFrames();

        console.log(gif);
        console.log(gif.frameInfo(0));

        var canvas = this.createCanvas(gif.width, gif.height);

        var scaleX = this.width  / gif.width;
        var scaleY = this.height / gif.height;

        ctx.scale(scaleX, scaleY);

        if (scaleX > 1 || scaleY > 1)
            ctx.imageSmoothingEnabled = false;

        for (;;) {
            for (var i = 0; i < numFrames; i++) {
                var frame = gif.frameInfo(i);
                var image = ctx.createImageData(gif.width, gif.height);
                gif.decodeAndBlitFrameRGBA(i, image.data);
    
                canvas.getContext("2d").putImageData(image, 0, 0);
                ctx.drawImage(canvas, 0, 0);
    
                this.render();
                this.sleep(frame.delay * 10)
    
            }
    
        }

    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', width:64, height:64, 'led-scan-mode':0});
sample.run();

