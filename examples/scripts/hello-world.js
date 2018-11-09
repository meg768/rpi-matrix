var Sample = require('./sample.js');

class HelloWorld extends Sample {

    constructor(options) {
        var path = require("path");

        super(options);
        this.matrix.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'Comic Sans' });
        this.canvas = this.matrix.getCanvas();

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

                this.canvas.render(18);

            
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

var sample = new HelloWorld({width:32, height:32});
sample.run();
