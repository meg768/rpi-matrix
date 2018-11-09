var Sample = require('./sample.js');

class ScrollSample extends Sample {

    constructor(options) {
        super(options);
        this.canvas = this.matrix.getCanvas();
    }

    getEmoji(name) {
        var path = require("path");
        var fileName = path.join(__dirname, '../emojis', `${this.canvas.width}x${this.canvas.height}`, name + '.png');
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
        this.getImage('beer').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('grapes').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('grinning').then((image) => {
            return this.scrollImage(image);
        })
        this.getImage('joy').then((image) => {
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
