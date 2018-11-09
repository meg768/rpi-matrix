var Sample = require('./sample.js');

class ScrollSample extends Sample {

    constructor(options) {
        super(options);

        this.canvas = this.matrix.getCanvas();


    }

    getImage(image) {
        var path = require("path");
        var fileName = path.join(__dirname, '../images', `${this.canvas.width}x${this.canvas.height}`, image);
        console.log('imagefile', fileName);
        return this.canvas.loadImage(fileName);
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            var ctx = this.canvas.getContext('2d');

            for (var offset = this.canvas.width; offset > -image.width; offset--) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(image, offset, 0);

                this.canvas.render(18);

            }
            resolve();
        });

    }

    run() {
        this.getImage('50.png').then((image) => {
            return this.scrollImage(image);
        })
        .then(() => {
            return this.delay(0);

        })
        .catch((error) => {
            console.log(error);
        });

    }
};

var sample = new ScrollSample({width:32, height:32});
sample.run();
