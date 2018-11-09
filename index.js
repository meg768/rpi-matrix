var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));
var Canvas = require('canvas');



var Matrix = module.exports = function(config) {

    var self = this;

    self.getCanvas = function() {

        if (self.canvas == undefined) {
            matrix.configure(config);

            self.width  = config.width;
            self.height = config.height;
            self.canvas = Canvas.createCanvas(self.width, self.height);
    
            self.canvas.render = function() {
                return matrix.render(self.canvas.toBuffer('raw'));
            }    
    
            self.render = function() {
                return matrix.render(self.canvas.toBuffer('raw'));
            }      
        }

        return self.canvas;
    }

    self.registerFont = function(font, options) {
        return Canvas.registerFont(font, options);
    }
}

