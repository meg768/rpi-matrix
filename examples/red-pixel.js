var Matrix = require('../index.js');

Matrix.configure({'led-rows':32, 'led-cols':32});

class Sample  {

    constructor() {
        this.matrix = new Matrix({mode:'pixel'});
        this.offset = 0;
    }

    render() {
        this.matrix.clear();
        this.matrix.setPixel(this.offset % this.matrix.width, Math.floor(this.offset / this.matrix.width), this.matrix.color('red'));
        this.matrix.render();

        this.offset = (this.offset + 1) % (this.matrix.width * this.matrix.height);
        console.log(this.offset);
    }

    run() {
        setInterval(this.render.bind(this), 100);
    }
};


var sample = new Sample();
sample.run();
