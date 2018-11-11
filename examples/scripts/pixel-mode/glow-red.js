#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'pixel'}});
    }

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

var sample = new Sample({width:32, height:32});
sample.run();