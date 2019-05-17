var Matrix = require('../../matrix.js');
var Animation = require('./animation.js');
var random = require('yow/random');


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
            fileName = path.join(__dirname, '../gifs/96x96', name + '.gif');
 
        if (!fileExists(fileName))
            fileName = path.join(__dirname, '../gifs/32x32', name + '.gif');

 
        return fs.readFileSync(fileName);    
    }


    run() {
        var GIF = require('omggif');
        var gif = new GIF.GifReader(this.loadGIF(this.gif));
        var ctx = this.canvas.getContext('2d');
        var numFrames = gif.numFrames();

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
                this.sleep(frame.delay * 10);
    
            }
    
        }

        return Promise.resolve();
    }
}

