#!/usr/bin/env node

var Sample = require('./sample.js');

class ColorSample extends Sample {

    constructor(options) {
        var path = require("path");

        super(options);
        this.canvas = this.matrix.getCanvas();

    }


    demo(text) {
        return new Promise((resolve, reject) => {
            try {
                var ctx = this.canvas.getContext('2d');

                ctx.fillStyle = 'blue';
                ctx.fillRect(0, 0, 32, 32);
    
                var pixels = ctx.getImageData(0, 0, 32, 32);
                console.log(typeof pixels);
                var array = Uint32Array.from(pixels);
                console.log(typeof array);
                this.matrix.render(pixels.data);
                //this.canvas.render();
    
                resolve();
    
            }
            catch(error) {
                reject(error);
            }
        });

    }

    run() {
        this.demo().then(() => {
            return this.delay(3000);
        })
        .catch(error => {
            console.error(error);
        });

    }
};

var sample = new ColorSample({width:32, height:32});
sample.run();
