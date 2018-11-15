#!/usr/bin/env node
var Matrix = require('../../../index.js');

class Sample extends Matrix {

    constructor(options) {
        super(options);
    }

    getEmoji(name) {
        var path = require("path");
        var fileName = path.join(__dirname, '../../emojis', name + '.png');
        return this.loadImage(fileName);
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            var canvas = this.createCanvas(this.width, this.height);
            var ctx = canvas.getContext('2d');

            var margin = canvas.height * 0.15;
            var scale = (canvas.height - margin) / image.height;  

            var imageWidth = image.width * scale;
            var imageHeight = image.height * scale;

            ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

            this.render(canvas.toBuffer('raw'), {scroll:'left', scrollDelay:10});

            resolve();
        });

    }


    displayImage(image) {
        return new Promise((resolve, reject) => {
            var canvas = this.createCanvas(this.width, this.height);
            var ctx = canvas.getContext('2d');

            var margin = canvas.height * 0;
            var scale = (canvas.height - margin) / image.height;  

            var imageWidth = image.width * scale;
            var imageHeight = image.height * scale;

            console.log(imageWidth, imageHeight);

            ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

            var scaledImage = ctx.getImageData(0, 0, this.width, this.height);
            this.render(scaledImage.data, {sleep:2000});

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
        .catch((error) => {
            console.log(error);
        });

    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':0});
sample.run();

