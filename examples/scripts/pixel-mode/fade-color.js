#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    run() {
        // Fill matrix with red and blend in (from black) using 500 steps
        this.fill(this.RGB(255, 0, 0));
        this.render({blend:500});

        // Fill matrix with green and blend in using 500 steps
        this.fill(this.RGB(0, 255, 0));
        this.render({blend:500});

        // Fill matrix with blue and blend in using 500 steps
        this.fill(this.RGB(0, 0, 255));
        this.render({blend:500});
        
        // Render contents again, but with a pause
        this.render({sleep:1000});

        // Fade out to black...
        this.fill(this.RGB(0, 0, 0));
        this.render({blend:100});

    }
}

var sample = new Sample({mode:'pixel', width:32, height:32});
sample.run();