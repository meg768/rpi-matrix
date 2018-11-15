#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        var ctx = this.canvas.getContext('2d');
        var steps = 50;

        // Fill matrix with blue
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.width, this.height);

        // Fade in using the specified number of steps
        this.render({blend:steps});

        // Repeat with red
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:steps});

        // Repeat with green
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:steps});

        // Go black
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:steps});

    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();

//var sample = new Sample({mode:'canvas', width:32, height:32});
//sample.run();