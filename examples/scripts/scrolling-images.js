#!/usr/bin/env node
var Matrix = require('../../index.js');
var path = require("path");

class Sample extends Matrix {

    constructor(options) {
        super({...options, ...{mode:'canvas'}});
    }

    getImage(image) {
        return this.loadImage(path.join(__dirname, '../images', `${this.canvas.width}x${this.canvas.height}`, image));
    }

    scrollImage(image) {
        return new Promise((resolve, reject) => {
            try {
                var ctx = this.canvas.getContext('2d');

                for (var offset = this.canvas.width; offset > -image.width; offset--) {
                    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    ctx.drawImage(image, offset, 0);

                    this.render({sleep:18});
    
                }
                resolve();
    
            }
            catch(error) {
                reject(error);
            }
        });

    }

    displayImage(image) {
        return this.getImage(image).then((image) => {
            return this.scrollImage(image);
        })
    }

    run() {
        var promise = Promise.resolve();

        promise.then(() => {
            return this.displayImage('123.png');
        })
        .then(() => {
            return this.displayImage('124.png');
        })
        .then(() => {
            return this.displayImage('125.png');
        })
        .then(() => {
            return this.displayImage('632.png');
        })
        .catch((error) => {
            console.error(error);
        });

    }
};

var sample = new Sample({width:32, height:32});
sample.run();
