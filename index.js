var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');



var Matrix = module.exports = function(config) {

    var self = this;

    matrix.configure(config);

    self.width  = config.width;
    self.height = config.height;
    self.length = self.width * self.height;
    self.pixels = new Uint32Array(self.length);

    self.createCanvas = function(width, height) {
        return Canvas.createCanvas(width, height);
    }

    self.getCanvas = function() {

        if (self.canvas == undefined) {

            self.width  = config.width;
            self.height = config.height;
            self.canvas = Canvas.createCanvas(self.width, self.height);
    
            self.canvas.render = function(delay) {
                return matrix.render(self.canvas.toBuffer('raw'), delay);
            }    

            self.canvas.loadImage = function(image) {
                return Canvas.loadImage(image);
            }        
        }

        return self.canvas;
    }

    self.RGB = function(red, green, blue) {        
		return ((red << 16) | (green << 8) | blue);
    }

    self.setPixelRGB = function(x, y, red, green, blue) {
        this.pixels[y * self.width + x] = self.RGB(red, green, blue);
    }

	self.fillRGB = function(red, green, blue) {
        var color = self.RGB(red, green, blue);
        
        for (var i = 0; i < self.length; i++)
            this.pixels[i] = color;
	}

    self.render = function(pixels, delay) {
        return matrix.render(pixels == undefined ? self.pixels : pixels, delay);
    }      

    self.registerFont = function(font, options) {
        return Canvas.registerFont(font, options);
    }


}

