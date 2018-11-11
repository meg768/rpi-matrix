#!/usr/bin/env node
var Matrix = require('../../index.js');

class Sample extends Matrix {

    run() {
        // Fill matrix with red and blend in (from black) in 100 steps
        this.fill(this.RGB(255, 0, 0));
        this.render({blend:100});

        // Render contents again, but with a pause after rendering
        this.render({sleep:1000});

        // Fade out to black, again using 100 steps
        this.fill(this.RGB(0, 0, 0));
        this.render({blend:100});

    }
}

var sample = new Sample({mode:'pixel', width:32, height:32});
sample.run();