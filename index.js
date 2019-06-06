var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');
var Color  = require('color');
var Pixels = require('rpi-pixels');

var matrixConfig = undefined;

function isPixels(value) {
    return (value instanceof Buffer) || (value instanceof Uint32Array) || (value instanceof Uint8ClampedArray);
}

function isObject(value) {
    return (value instanceof Object);
}

class Matrix extends Pixels {

    constructor(options) {
        var {mode, ...other} = options;

        if (matrixConfig == undefined) {
            throw new Error('Must call Matrix.configure() first.');
        }
    
        if (matrixConfig['led-rows'] == undefined || matrixConfig['led-cols'] == undefined) {
            throw new Error('Must specify led-rows and led-cols in Matrix.configure().');
        }
    
        if (matrixConfig['led-chain'] == undefined || matrixConfig['led-parallel'] == undefined) {
            throw new Error('Must specify led-chain and led-parallel in Matrix.configure().');
        }

        var height = parseInt(matrixConfig['led-rows']) * parseInt(matrixConfig['led-parallel']);
        var width  = parseInt(matrixConfig['led-cols']) * parseInt(matrixConfig['led-chain']);
    
        super({...other, width:width, height:height});
        var self = this;

        this.mode = mode;

        if (mode == 'canvas') {
            this.canvas = Canvas.createCanvas(this.width, this.height);

            this.render = function() {

                switch (arguments.length) {
                    case 0: {
                        return matrix.render(self.canvas.toBuffer('raw'));
                    }
                    case 1: {
                        if (isPixels(arguments[0])) {
                            return matrix.render(arguments[0]);
                        }
                        if (isObject(arguments[0])) {
                            return matrix.render(self.canvas.toBuffer('raw'), arguments[0]);
                        }
                        break;
                    }
                    case 2: {
                        if (isPixels(arguments[0]) && isObject(arguments[1])) {
                            return matrix.render(arguments[0], arguments[1]);
                        }
                        break;
                    }
                }
    
                throw new Error('Invalid arguments.');
        
            }
        }
        else if (mode == 'pixel') {
            this.render = function() {
                switch (arguments.length) {
                    case 0: {
                        return matrix.render(self.pixels);
                    }
                    case 1: {
                        if (isPixels(arguments[0])) {
                            return matrix.render(arguments[0]);
                        }
                        if (isObject(arguments[0])) {
                            return matrix.render(self.pixels, arguments[0]);
                        }
                        break;
                    }
                    case 2: {
                        if (isPixels(arguments[0]) && isObject(arguments[1])) {
                            return matrix.render(arguments[0], arguments[1]);
                        }
                        break;
                    }
                }
    
                throw new Error('Invalid arguments.');
    
            };
        }
        else {
            this.render = () => {

            };
        }
    }

    sleep(ms) {
        matrix.sleep(ms);
    }
};


Matrix.configure = function(config) {


    var defaultConfig = {
        'led-rows'     : 32,
        'led-cols'     : 32,
        'led-chain'    : 1,
        'led-parallel' : 1
    };

    matrix.configure(matrixConfig = Object.assign({}, defaultConfig, config));
}

Matrix.Canvas = Canvas;
Matrix.Color  = Color;

module.exports = Matrix;
