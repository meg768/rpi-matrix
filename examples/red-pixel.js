var Matrix = require('../index.js');

Matrix.configure({'led-rows':32, 'led-cols':32});

class Sample  {

    constructor() {
        this.matrix = new Matrix({mode:'pixel'});
        this.offset = 0;
    }

    render() {
        console.log('.');
        this.matrix.clear();
        this.matrix.setPixel(this.offset % this.matrix.width, Math.floor(this.offset) / this.matrix.width, 'red');
        this.matrix.render();
    }

    run() {
        setInterval(this.render.bind(this), 100);
    }
};


var sample = new Sample();
sample.run();
