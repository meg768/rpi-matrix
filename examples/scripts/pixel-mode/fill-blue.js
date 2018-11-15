#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        var color = this.RGB(0, 0, 255);
        console.log('Filling', color);
        this.fill(this.RGB(0, 0, 255));
        this.render();

        setTimeout(() => {}, 2000);
    }
}

var sample = new Sample({mode:'pixel', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();