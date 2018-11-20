#!/usr/bin/env node

var Matrix = require('../../../index.js');
var PSD = require('psd');
var path = require('path');
var fs = require('fs');

class Sample extends Matrix {


    constructor(options) {
		super({ ...options, ...{mode: 'canvas' } });

    }

    getLayer(psd, name) {

        var psdWidth = psd.header.rows; 
        var psdHeight = psd.header.cols; 

        return new Promise((resolve, reject) => {
            var layer = psd.tree().childrenAtPath(name)[0];
            var image = layer.get('image');
            var fileName = '/tmp/_tmpImage.png';

            var canvas = this.createCanvas(psdWidth, psdHeight);
            var ctx = canvas.getContext('2d');
            
            image.saveAsPng(fileName).then(() => {
                return Promise.resolve();
            })
            .then(() => {
                return this.loadImage(fileName);
            })
            .then((image) => {
                fs.unlinkSync(fileName);

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
        var fileName = path.join(__dirname, '../../psd', 'clock.psd');

        var psd = PSD.fromFile(fileName);

        psd.parse();

        var psdWidth = psd.header.rows; 
        var psdHeight = psd.header.cols; 

        this.getLayers(psd).then((layers) => {
            for (;;) {

                var date = new Date();

                var hour   = (date.getHours() + date.getMinutes() / 60) / 12;
                var minute = date.getMinutes() / 60; 
                var second = date.getSeconds() / 60;
                var hue    = 360 * ((date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds()) / (60 * 60 * 12);
    
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
    
                ctx = this.canvas.getContext('2d');
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.drawImage(canvas, 0, 0, this.width, this.height);

                // Colorize
                var image = ctx.getImageData(0, 0, this.width, this.height);

                for (var i = 0, length = image.data.length; i < length; i += 4) {
                    var color;

                    color = Matrix.Color.rgb(image.data[i + 0], image.data[i + 1], image.data[i + 2]).hsl();
                    color = Matrix.Color.hsl(hue, color.color[1], color.color[2]).rgb().array();

                    image.data[i + 0] = color[0];
                    image.data[i + 1] = color[1];
                    image.data[i + 2] = color[2];
                }

                ctx.putImageData(image, 0, 0);

                this.render();
                this.sleep(10);
    
            }
    
        })
        .catch(error => {
            console.log(error);
        })
        
    }
};




class Command {

    constructor() {
        module.exports.command  = 'clock [options]';
        module.exports.describe = 'Show time';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 [options]');

		args.option('help', {describe:'Displays this information'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {

		try {
			var sample = new Sample(argv);
			sample.run();
		}
		catch (error) {
			console.error(error.stack);
		}

    }
    


};

new Command();
