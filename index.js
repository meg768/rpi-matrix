var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');
var Color  = require('color');

function isPixels(value) {
    return (value instanceof Buffer) || (value instanceof Uint32Array) || (value instanceof Uint8ClampedArray);
}

function isObject(value) {
    return (value instanceof Object);
}

var Matrix = module.exports = function(config) {

    var self = this;

    var options = Object.assign({}, config);

    if (options.width)
        options.led_cols = options.width;

    if (options.height)
        options.led_rows = options.height;

    self.mode   = options.mode ? options.mode : 'pixel';
    self.width  = options['led-rows'] || options['led_rows'] || options['width'];
    self.height = options['led-cols'] || options['led_cols'] || options['height'];
    self.length = self.width * self.height;

    matrix.configure(options);


    self.sleep = function(ms) {
        matrix.sleep(ms)
    }

    self.loadImage = function(image) {
        return Canvas.loadImage(image);
    }
    
    self.renderImage = function(image, options) {
        return matrix.render(image, options);
    }
    

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

        self.scroll = function(image, options) {
            matrix.scroll(image, options);
        }

        self.getCanvas = function() {
            return self.canvas;
        }
        
        self.createCanvas = function(width, height) {
            return Canvas.createCanvas(width, height);
        }

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
        throw new Error("Invalid matrix mode. Specify 'pixel' or 'canvas'.");

}

Matrix.registerFont = function(font, options) {
    return Canvas.registerFont(font, options);
}
