var Matrix = require('../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super(options);
    }

    run() {
        var red;

        for (red = 0; red <= 255; red++) {
            this.fillRGB(red, 0, 0);
            this.render();
        
        }
        for (red = 255; red >= 0; red--) {
            this.fillRGB(red, 0, 0);
            this.render();
        
        }    
    }
}

var sample = new Sample({mode:'rgb', width:32, height:32});
sample.run();