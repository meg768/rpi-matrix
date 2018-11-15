#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        var ctx = this.canvas.getContext('2d');

        // Fill matrix with blue and blend in using 100 steps
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:100});

        // Clear and blend using 100 steps (fade out)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:100});

        setTimeout(() => {}, 2000);
    }
};

var sample = new Sample({mode:'canvas', hardware_mapping:'adafruit-hat-pwm', led_rgb_sequence:'RBG', cols:64, rows:64, scan_mode:0});
sample.run();
