#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'canvas'}});
    }

  

    createText(text) {
        var ctx = null;
        
        ctx = this.canvas.getContext('2d');

        ctx.font = ` ${this.height / 2}px Arial`;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        var textSize = ctx.measureText(text); 

        var canvas = this.createCanvas(textSize.width + 2 * this.width, this.height);

        ctx = canvas.getContext('2d');
        ctx.font = ` ${this.height / 2}px Arial`;
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

                this.render(canvas.toBuffer('raw'), {scroll:'left', scrollDelay:10});

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

    delay(ms = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms)
        })
    }


    run() {
        this.scrollText('Hello World!').then(() => {
        })
        .then(() => {
            return this.delay(2000);
        })
        .catch(error => {
            console.error(error.message);
        })

    }
};

var sample = new Sample({hardware_mapping:'adafruit-hat-pwm', led_rgb_sequence:'RBG', cols:64, rows:64, scan_mode:0});
sample.run();
