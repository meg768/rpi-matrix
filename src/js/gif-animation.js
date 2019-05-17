var Matrix = require('../../matrix.js');
var Animation = require('./animation.js');
var random = require('yow/random');
var path = require('path');
var fs = require('fs');

module.exports = class GifAnimation extends Animation {

    constructor(options) {

        super(options);

        var {gif = 'pacman'} = options;

        this.matrix = new Matrix({mode:'canvas'});
        this.gif = gif;
    }


    stop() {
        return new Promise((resolve, reject) => {

            super.stop().then(() => {
                this.context = {};
                this.matrix.clear();
                this.matrix.render({blend:50});
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            })

        });
    }    

    start() {
        return new Promise((resolve, reject) => {

            super.start().then(() => {

                var GIF = require('omggif');
                var gif = new GIF.GifReader(this.loadGIF(this.gif));
                var numFrames = gif.numFrames();
        
                var canvas = this.matrix.createCanvas(gif.width, gif.height);
        
                this.context = {};
                this.context.gif = gif;
                this.context.numFrames = numFrames;
                this.context.canvas = canvas;
                this.context.currentFrame = 0;
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            })

        });
    }  

    render() {
        var context = this.context;

        var ctx = context.canvas.getContext("2d");

        var frame = context.gif.frameInfo(context.currentFrame);
        var image = ctx.createImageData(gif.width, gif.height);
        context.gif.decodeAndBlitFrameRGBA(context.currentFrame, image.data);

        ctx.putImageData(image, 0, 0);
        this.matrix.canvas.getContext("2d").drawImage(canvas, 0, 0);
        context.currentFrame++;

        if (context.currentFrame > context.numFrames)
            context.currentFrame = 0;

            //this.matrix.render();
        //this.matrix.sleep(frame.delay * 10);

    }

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


    runX() {
        var GIF = require('omggif');
        var gif = new GIF.GifReader(this.loadGIF(this.gif));
        var ctx = this.matrix.canvas.getContext('2d');
        var numFrames = gif.numFrames();

        var canvas = this.matrix.createCanvas(gif.width, gif.height);

        var scaleX = this.matrix.width  / gif.width;
        var scaleY = this.matrix.height / gif.height;

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
    
                this.matrix.render();
                this.matrix.sleep(frame.delay * 10);
    
            }
    
        }

        return Promise.resolve();
    }
}

