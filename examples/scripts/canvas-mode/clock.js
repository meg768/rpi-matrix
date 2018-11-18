#!/usr/bin/env node


var Matrix = require('../../../index.js');
var PSD = require('psd');
var path = require('path');
var fs = require('fs');


class Sample extends Matrix {


    constructor(options) {
        super(options);


    }

    getLayer(psd, name) {
        var psdWidth = psd.header.rows; 
        var psdHeight = psd.header.cols; 

        return new Promise((resolve, reject) => {
            var layer = psd.tree().childrenAtPath(name)[0];
            var image = layer.get('image');

            var canvas = this.createCanvas(psdWidth, psdHeight);
            var ctx = canvas.getContext('2d');
    
            image.saveAsPng('X.png').then(() => {
                return Promise.resolve();
            })
            .then(() => {
                return this.loadImage('X.png');
            })
            .then((image) => {
                ctx.drawImage(image, layer.left, layer.top, layer.width, layer.height);
                resolve(canvas);
            })
            .catch(error => {
                reject(error);
            });
    
        });
    }

    
    getLayers(psd) {
        return new Promise((resolve, reject) => {

            var layersNames = ['background', 'hours', 'minutes', 'seconds'];
            var promise = Promise.resolve();
            var layers = {};

            layersNames.forEach((layerName) => {
                promise = promise.then(() => {
                    return this.getLayer(psd, layerName);
                })
                .then((canvas) => {
                    layers[layerName] = canvas;
                });
            });

            promise.then(() => {
                resolve(layers);
            })
            .catch(error => {
                reject(error);
            })
        });
    }



    run() {
        var fileName = path.join(__dirname, '../../clocks', 'swiss-red' + '.psd');


        console.log('Loading PSD...');
        var psd = PSD.fromFile(fileName);
        psd.parse();
        

        var psdWidth = psd.header.rows; 
        var psdHeight = psd.header.cols; 

        console.log(psdWidth, psdHeight);

        this.getLayers(psd).then((layers) => {
            for (;;) {

                var date = new Date();

                var hour   = (date.getHours() + date.getMinutes() / 60) / 12;
                var minute = date.getMinutes() / 60; 
                var second = date.getSeconds() / 60;
    
                var canvas = this.createCanvas(psdWidth, psdHeight);
                var ctx = canvas.getContext('2d');
    
    
                ctx.drawImage(layers['background'], 0, 0, canvas.width, canvas.height);
    
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(hour * 2 * Math.PI);
                ctx.drawImage(layers['hours'], -canvas.width/2, -canvas.height/2);
                ctx.restore();
    
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(minute * 2 * Math.PI);
                ctx.drawImage(layers['minutes'], -canvas.width/2, -canvas.height/2);
                ctx.restore();
    
                ctx.save();
                ctx.translate(canvas.width/2, canvas.height/2);
                ctx.rotate(second * 2 * Math.PI);
                ctx.drawImage(layers['seconds'], -canvas.width/2, -canvas.height/2);
                ctx.restore();
    
                this.canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
                this.canvas.getContext('2d').drawImage(canvas, 0, 0, this.width, this.height);

                this.render();
                this.sleep(0);
    
            }
    
        })
        .catch(error => {
            console.log(error);
        })
        
    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', width:64, height:64, 'led-scan-mode':0});
sample.run();

