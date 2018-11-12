#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'canvas'}});
    }

    createText(text) {
        var ctx = null;
        
        ctx = this.canvas.getContext('2d');

        ctx.font = `bold ${this.height / 2}px Arial`;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        var textSize = ctx.measureText(text); 

        var canvas = this.createCanvas(textSize.width + 2 * this.width, this.height);

        ctx = canvas.getContext('2d');
        ctx.font = `bold ${this.height / 2}px Arial`;
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    }

    scrollCanvas(canvas) {
        return new Promise((resolve, reject) => {
            try {
                if (canvas.height != this.height)
                    throw new Error('Canvas height does not match matrix height.');

                var ctx = canvas.getContext('2d');

                for (var offset = 0; offset <= canvas.width - this.width; offset++) {
                    var image = ctx.getImageData(offset, 0, this.width, this.height);
                    this.render(image.data, {sleep:18});
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
            console.error(error.message);
        })

    }
};

var sample = new Sample({width:64, height:64});
sample.run();
