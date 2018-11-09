var Matrix = require('../../index.js');

class Sample {

    constructor(options) {
        var path = require("path");

        this.matrix = new Matrix(options);
        this.matrix.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'Comic Sans' });
        this.canvas = this.matrix.getCanvas();

    }

    delay(ms = 3000) {
        return new Promise((resolve, reject) => {
            return setTimeout(resolve, ms);
        });
    }

    scrollText(text) {
        return new Promise((resolve, reject) => {
            var ctx = this.canvas.getContext('2d');

            ctx.font = `bold ${this.canvas.height / 2}px Arial`;
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
    
            var textSize = ctx.measureText(text); 
        
            for (var offset = this.canvas.width; offset > -textSize.width; offset--) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.fillText(text, offset, this.canvas.height / 2);

                this.canvas.render();
                this.canvas.render();
                this.canvas.render();
                this.canvas.render();

            }
            resolve();
        });

    }

    run() {
        this.scrollText('Hello World!').then(() => {
            return this.delay();
        })

    }
};

var sample = new Sample({width:32, height:32});
sample.run();
