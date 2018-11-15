#!/usr/bin/env node
var Matrix = require('../../../index.js');
var path = require("path");

Matrix.registerFont(path.join(__dirname, '../../fonts/Verdana.ttf'), { family: 'what-ever' });

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'canvas'}})
    }

    run() {
        var ctx = this.canvas.getContext('2d');

        ctx.font = 'bold ' + this.height / 2 + 'px Verdana';
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', this.width / 2, this.height / 2);

        this.render();

        setTimeout(() => {}, 2000);
    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();