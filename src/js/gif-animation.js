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
        this.duration = 1000;
    }


    stop() {
        return new Promise((resolve, reject) => {

            super.stop().then(() => {
                this.context = {};
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
                this.context.i = 0;

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

        var ctx = this.matrix.canvas.getContext('2d');
        var {gif, canvas, numFrames, i} = this.context;

        console.log(i, gif.width, gif.height);
        
        
        var frame = gif.frameInfo(i);
        var image = ctx.createImageData(gif.width, gif.height);
        gif.decodeAndBlitFrameRGBA(i, image.data);

        canvas.getContext("2d").putImageData(image, 0, 0);
        ctx.drawImage(canvas, 0, 0);

        this.context.i++;
        if (this.context.i > numFrames)
            this.context.i = 0;
    
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

       // if (!fileExists(fileName))
         //   fileName = path.join(__dirname, '../../gifs/96x96', name + '.gif');
 
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

