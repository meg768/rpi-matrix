var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');
var Color  = require('color');

var Matrix = module.exports = function(config) {

    var self = this;

    matrix.configure(config);

    self.mode   = config.mode ? config.mode : 'pixel';
    self.width  = config.width;
    self.height = config.height;
    self.length = self.width * self.height;

    self.renderDelay = undefined;

    if (this.mode == 'rgb' || this.mode == 'pixel') {
        self.pixels = new Uint32Array(self.length);

        self.RGB = function(red, green, blue) {        
            return ((red << 16) | (green << 8) | blue);
        }

        self.HSL = function(h, s, l) {
            return Color.hsl(h, s, l).rgbNumber();
        }

        self.fill = function(color) {

            if (typeof color == 'string')
                color = Color(color).rgbNumber();
    
            for (var i = 0; i < this.length; i++)
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
                    if (typeof arguments[0] == 'object') {
                        return matrix.render(arguments[0]);
                    }
                    if (typeof arguments[0] == 'number') {
                        return matrix.render(self.pixels, arguments[0]);
                    }
                    break;
                }
                case 2: {
                    if (typeof arguments[0] == 'object' && typeof arguments[1] == 'number') {
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

        self.createCanvas = function(width, height) {
            return Canvas.createCanvas(width, height);
        }

        self.loadImage = function(image) {
            return Canvas.loadImage(image);
        }

        self.render = function() {

            switch (arguments.length) {
                case 0: {
                    return matrix.render(self.canvas.toBuffer('raw'));
                }
                case 1: {
                    if (typeof arguments[0] == 'object') {
                        return matrix.render(arguments[0]);
                    }
                    if (typeof arguments[0] == 'number') {
                        return matrix.render(self.canvas.toBuffer('raw'), arguments[0]);
                    }
                    break;
                }
                case 2: {
                    if (typeof arguments[0] == 'object' && typeof arguments[1] == 'number') {
                        return matrix.render(arguments[0], arguments[1]);
                    }
                    break;
                }
            }

            throw new Error('Invalid arguments.');
        }     

    
    }
    else
        throw new Error("Invalid matrix mode. Specify 'pixel' or 'canvas'.");

}

Matrix.registerFont = function(font, options) {
    return Canvas.registerFont(font, options);
}
