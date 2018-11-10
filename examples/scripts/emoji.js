var Sample = require('./sample.js');

class ScrollSample extends Sample {

    constructor(options) {
        super(options);
        this.canvas = this.matrix.getCanvas();
    }

    getEmoji(name) {
        var path = require("path");
        var fileName = path.join(__dirname, '../emojis', name + '.png');
        return this.canvas.loadImage(fileName);
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            var ctx = this.canvas.getContext('2d');

            var margin = this.canvas.height * 0.15;
            var scale = (this.canvas.height - margin) / image.height;  

            var imageWidth = image.width * scale;
            var imageHeight = image.height * scale;

            for (var offset = this.canvas.width; offset > -imageWidth; offset--) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(image, offset, margin / 2, imageWidth, imageHeight);
                
                this.canvas.render(18);

            }
            
            resolve();
        });

    }

    run() {
        this.getEmoji('beer').then((image) => {
            return this.scrollImage(image);
        })
        this.getEmoji('grapes').then((image) => {
            return this.scrollImage(image);
        })
        this.getEmoji('grinning').then((image) => {
            return this.scrollImage(image);
        })
        this.getEmoji('joy').then((image) => {
            return this.scrollImage(image);
        })
        this.getEmoji('partly_sunny').then((image) => {
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
