var Matrix = require('../index.js');

Matrix.configure({'led-rows':32, 'led-cols':32});

class Sample  {

    constructor() {
        this.matrix = new Matrix({mode:'pixel'});
    }


    run() {
        for (var y = 0; y < this.matrix.height; y++) {
            for (var x = 0; x < this.matrix.width; x++) {
                this.matrix.clear();
                this.matrix.setPixel(x, y, this.matrix.color('red'));
                this.matrix.render();
            }
    
        }

    }
};


var sample = new Sample();
sample.run();
