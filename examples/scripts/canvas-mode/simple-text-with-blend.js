#!/usr/bin/env node
var Matrix = require('../../../index.js');


class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'canvas'}})
    }

    run() {
        var ctx = this.canvas.getContext('2d');

        ctx.font = 'bold ' + this.height / 2 + 'px Arial';
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', this.width / 2, this.height / 2);

        // Fade in
        this.render({blend:500});

        // Clear matrix
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);

        // Fade out
        this.render({blend:100});

    }
};
var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
