#!/usr/bin/env node

var Sample = require('./sample.js');

class HelloWorld extends Sample {

    constructor(options) {
        var path = require("path");

        super(options);
        this.matrix.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'Comic Sans' });
        this.canvas = this.matrix.getCanvas();

    }

    createText(text) {
        var ctx = null;
        
        console.log('creating text');
        ctx = this.canvas.getContext('2d');

        ctx.font = `bold ${this.canvas.height / 2}px Arial`;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        var textSize = ctx.measureText(text); 

        var canvas = this.matrix.createCanvas(textSize.width + 2 * this.matrix.width, this.matrix.height);

        ctx = canvas.getContext('2d');
        ctx.font = `bold ${this.canvas.height / 2}px Arial`;
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

/*
        ctx.fillRect(0, 0, canvas.width, canvas.height);        
        ctx.fillStyle = 'red';
        ctx.fillRect(this.matrix.width, 0, textSize.width, canvas.height);
*/
        
        ctx.fillStyle = 'blue';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);


        return canvas;
    }

    scrollCanvas(canvas) {
        return new Promise((resolve, reject) => {
            try {
                var src = canvas.getContext('2d');
                var dst = this.canvas.getContext('2d');

                for (var offset = 0; offset <= canvas.width - this.matrix.width; offset++) {
                    var image = src.getImageData(offset, 0, this.matrix.width, this.matrix.height);
                    dst.putImageData(image, 0, 0);
                    this.matrix.render(image.data, 20);
                }

                resolve();
    
            }
            catch(error) {
                reject(error);
            }
        });

    }

    scrollText(text) {
        return this.scrollCanvas(this.createText(text));
    }


    run() {
        this.scrollText('Hello World!').then(() => {

            return this.delay(1000);
        })
        .catch(error => {
            console.error(error);
        })

    }
};

var sample = new HelloWorld({width:32, height:32});

sample.run();
