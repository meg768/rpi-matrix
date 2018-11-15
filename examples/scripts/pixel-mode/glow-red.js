#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        var red;

        // Loop from black to red and render each color
        for (red = 0; red <= 255; red++) {
            this.fill(this.RGB(red, 0, 0));
            this.render();
        
        }

        // Loop back to black
        for (red = 255; red >= 0; red--) {
            this.fill(this.RGB(red, 0, 0));
            this.render();
        
        }    
    }
}

var sample = new Sample({mode:'pixel', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();