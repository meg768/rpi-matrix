#!/usr/bin/env node
var Matrix = require('../../../index.js');
var path = require('path');

Matrix.registerFont(path.join(__dirname, '../../fonts/Verdana.ttf'), { family: 'what-ever' });


class Sample extends Matrix {

    createTextImage(text) {
        var ctx = null;
        
        ctx = this.canvas.getContext('2d');

        ctx.font = '' + this.height / 2 + 'px Verdana';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        var textSize = ctx.measureText(text); 

        var canvas = this.createCanvas(textSize.width + 2 * this.width, this.height);

        ctx = canvas.getContext('2d');
        ctx.font = '' + this.height / 2 + 'px Verdana';
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            try {

                this.render(image.data, {scroll:'left', scrollDelay:10});

                resolve();
    
            }
            catch(error) {
                reject(error);
            }
        });

    }

    scrollText(text) {
        return this.scrollImage(this.createTextImage(text));
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

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':1});
sample.run();
