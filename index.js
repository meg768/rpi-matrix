var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');


var Matrix = module.exports = function(config) {

    var self = this;

    matrix.configure(config);

    self.mode   = config.mode ? config.mode : 'canvas';
    self.width  = config.width;
    self.height = config.height;
    self.length = self.width * self.height;

    self.renderDelay = undefined;

    if (config.mode == 'rgb') {
        self.pixels = new Uint32Array(self.length);

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
    else {
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

}

Matrix.registerFont = function(font, options) {
    return Canvas.registerFont(font, options);
}
