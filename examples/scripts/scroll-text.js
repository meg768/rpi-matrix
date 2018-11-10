#!/usr/bin/env node
var Matrix = require('../../index.js');
var path = require("path");

Matrix.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'Comic Sans' });

class Sample extends Matrix {

    constructor(options) {
        super(options);
    }

    createText(text) {
        var ctx = null;
        
        ctx = this.canvas.getContext('2d');

        ctx.font = `bold ${this.height / 2}px Verdana`;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        var textSize = ctx.measureText(text); 

        var canvas = this.createCanvas(textSize.width + 2 * this.width, this.height);

        ctx = canvas.getContext('2d');
        ctx.font = `bold ${this.height / 2}px Verdana`;
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    }

    scrollCanvas(canvas) {
        return new Promise((resolve, reject) => {
            try {
                var src = canvas.getContext('2d');
                var dst = this.canvas.getContext('2d');

                for (var offset = 0; offset <= canvas.width - this.width; offset++) {
                    var image = src.getImageData(offset, 0, this.width, this.height);
                    dst.putImageData(image, 0, 0);
                    this.render(image.data, 20);
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
        })
        .catch(error => {
            console.error(error);
        })

    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
