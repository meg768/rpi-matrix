var Matrix = require('../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super(options);
    }

    getImage(image) {
        var path = require("path");
        var fileName = path.join(__dirname, '../images', `${this.canvas.width}x${this.canvas.height}`, image);
        return this.loadImage(fileName);
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            var ctx = this.canvas.getContext('2d');

            for (var offset = this.canvas.width; offset > -image.width; offset--) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(image, offset, 0);

                this.render(18);

            }
            resolve();
        });

    }

    run() {
        this.getImage('123.png').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('124.png').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('125.png').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('632.png').then((image) => {
            return this.scrollImage(image);
        })
        .catch((error) => {
            console.log(error);
        });

    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
