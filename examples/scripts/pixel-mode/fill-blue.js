#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'pixel'}});
    }

    run() {
        this.fill(this.RGB(0, 0, 255));
        this.render();

        setTimeout(() => {}, 2000);
    }
}

var sample = new Sample({width:64, height:64});
sample.run();