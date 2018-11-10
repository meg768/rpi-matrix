#!/usr/bin/env node
var Matrix = require('../../index.js');

class Sample extends Matrix {

    run() {
        var ctx = this.canvas.getContext('2d');

        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, this.width, this.height);

        this.render();
        setTimeout(() => {}, 3000);
    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
