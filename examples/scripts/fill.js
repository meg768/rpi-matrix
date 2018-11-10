#!/usr/bin/env node

var Matrix = require('../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super(options);
    }

    delay(ms) {
        return new Promise((resolve, reject) => {
            return setTimeout(resolve, ms);
        });
    }

    run() {
        var ctx = this.canvas.getContext('2d');

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.width, this.height);

        this.render();
        this.delay(3000);
    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
