var Sample = require('./sample.js');

class PulseSample extends Sample {

    constructor(options) {
        super(options);
    }

    run() {
        for (var red = 0; red <= 255; red++) {
            this.matrix.fillRGB(red, 0, 0);
            this.matrix.render();
        
        }
        for (var red = 255; red >= 0; red--) {
            this.matrix.fillRGB(red, 0, 0);
            this.matrix.render();
        
        }
    
    }

}


var sample = new PulseSample({width:32, height:32});
sample.run();




