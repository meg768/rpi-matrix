#!/usr/bin/env node
var Matrix = require('../../index.js');
var path = require("path");

Matrix.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'what-ever' });

class Sample extends Matrix {

    run() {
        var ctx = this.canvas.getContext('2d');

        ctx.font = 'bold 16px Verdana';
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', this.width / 2, this.height / 2);

        this.render();

        setTimeout(() => {}, 3000);
    }
};
var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
