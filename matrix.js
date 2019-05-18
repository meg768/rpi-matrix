var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');
var Color  = require('color');

var matrixConfig = undefined;

function isPixels(value) {
    return (value instanceof Buffer) || (value instanceof Uint32Array) || (value instanceof Uint8ClampedArray);
}

function isObject(value) {
    return (value instanceof Object);
}

var Matrix = module.exports = function(options) {

    var self = this;

    if (matrixConfig == undefined) {
        throw new Error('Must call Matrix.configure() first.');
    }

    if (matrixConfig['led-rows'] == undefined || matrixConfig['led-cols'] == undefined) {
        throw new Error('Must specify led-rows and led-cols in Matrix.configure().');
    }

    self.mode   = options.mode ? options.mode : 'pixel';
    self.height = parseInt(matrixConfig['led-rows']);
    self.width  = parseInt(matrixConfig['led-cols']);

    if (!self.width || !self.height) {
        throw new Error('Must specify led-rows and led-cols in Matrix.configure().');
    }
    

    self.sleep = function(ms) {
        matrix.sleep(ms)
    }
    
    
    if (self.mode == 'raw') {
    
    }

    else if (this.mode == 'pixel') {
        self.pixels = new Uint32Array(self.width * self.height);

        self.RGB = function(red, green, blue) {        
            return ((red << 16) | (green << 8) | blue);
        }

        self.HSL = function(h, s, l) {
            return Color.hsl(h, s, l).rgbNumber();
        }

        self.fill = function(color) {
            if (typeof color == 'string')
                color = Color(color).rgbNumber();
    
            for (var i = 0; i < this.pixels.length; i++)
                this.pixels[i] = color;
        }

        self.clear = function() {
            self.fill(0);
        }

        self.setPixel = function(x, y, color) {
            this.pixels[y * self.width + x] = color;
        }

        self.getPixel = function(x, y) {
            return this.pixels[y * self.width + x];
        }
    
        self.setPixelRGB = function(x, y, red, green, blue) {
            this.pixels[y * self.width + x] = self.RGB(red, green, blue);
        }
 
        self.setPixelHSL = function(x, y, h, s, l) {
            this.pixels[y * self.width + x] = self.HSL(h, s, l);
        }
 

        self.render = function() {


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
        }     

    }
    else if (this.mode == 'canvas') {
        self.canvas = Canvas.createCanvas(self.width, self.height);


        self.render = function() {

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
    else
        throw new Error("Invalid matrix mode. Specify 'raw', 'pixel' or 'canvas'.");

}


Matrix.configure = function(config) {

    
        
    matrix.configure(matrixConfig = config);
}

Matrix.Canvas = Canvas;
Matrix.Color  = Color;
