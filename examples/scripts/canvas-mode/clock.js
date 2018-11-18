#!/usr/bin/env node


var Matrix = require('../../../index.js');
var PSD = require('psd');
var path = require('path');
var fs = require('fs');


class Sample extends Matrix {


    loadGIF(name) {

        function fileExists(path) {

            try {
                fs.accessSync(path);		
                return true;
            }
            catch (error) {
            }
        
            return false;		
        }

        var fileName = '';

        if (!fileExists(fileName))
            fileName = path.join(__dirname, '../../gifs/96x96', name + '.gif');
 
        if (!fileExists(fileName))
            fileName = path.join(__dirname, '../../gifs/32x32', name + '.gif');

 
        return fs.readFileSync(fileName);    
    }

    getLayerImage(psd, name) {
        return new Promise((resolve, reject) => {
            var layer = psd.tree().childrenAtPath(name)[0];
            var image = layer.get('image');
    
            image.saveAsPng('X.png').then(() => {
                return Promise.resolve();
            })
            .then(() => {
                return this.loadImage('X.png');
            })
            .then((image) => {
                resolve(image);
            })
            .catch(error => {
                reject(error);
            });
    
        });

    }

    run() {
        var fileName = path.join(__dirname, '../../clocks', 'swiss-red' + '.psd');
        var psd = PSD.fromFile(fileName);


        psd.parse();

        this.getLayerImage(psd, 'background').then((image) => {
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, this.width, this.height);
            this.render();
            this.sleep(3000);
    
        })
        .catch(error => {
            console.log(error);
        })
/*
        var background = psd.tree().childrenAtPath('background')[0];
        var image = background.get('image');
        var png = image.toPng();

        var stream = this.canvas.createPNGStream();
        console.log(png instanceof Buffer);
        console.log(png instanceof Object);
        console.log(png);
        image.saveAsPng('X.png');

        
        var ctx = this.canvas.getContext('2d');
        ctx.drawImage(png, 0, 0, this.width, this.height);
        this.render();
        this.sleep(1000);
*/
//        console.log(background.get('image'));
//        background.toPng();
  //      console.log(background.export());
//        console.log(psd.tree().export());
        
    }
};

var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', width:64, height:64, 'led-scan-mode':0});
sample.run();

