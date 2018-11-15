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

            var margin = canvas.height * 0;
            var scale = (canvas.height - margin) / image.height;  

            var imageWidth = image.width * scale;
            var imageHeight = image.height * scale;

            console.log(imageWidth, imageHeight);

            ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

            var scaledImage = ctx.getImageData(0, 0, this.width, this.height);
            console.log(scaledImage.width, scaledImage.height, scale);
            this.scroll(scaledImage.data, {sleep:2000});

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
    runxxx() {
        this.getEmoji('beer').then((image) => {
            return this.displayImage(image);
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

var sample = new Sample({mode:'canvas', hardware_mapping:'adafruit-hat-pwm', led_rgb_sequence:'RBG', cols:64, rows:64, scan_mode:0});
sample.runxxx();
