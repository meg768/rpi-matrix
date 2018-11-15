#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        // Fill matrix with red and blend in (from black) using 500 steps
        this.fill(this.RGB(255, 0, 0));
        this.render({blend:500});

        // Fill matrix with green and blend in using 500 steps
        this.fill(this.RGB(0, 255, 0));
        this.render({blend:500});

        // Fill matrix with blue and blend in using 500 steps
        this.fill(this.RGB(0, 0, 255));
        this.render({blend:500});
        
        // Fade out to black...
        this.fill(this.RGB(0, 0, 0));
        this.render({blend:100});

    }
}

var sample = new Sample({mode:'pixel', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();