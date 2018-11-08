var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));

var Matrix = module.exports = function(config) {

    matrix.configure(config);

    this.width  = matrix.width;
    this.height = matrix.height;
    this.pixels = new Uint32Array(this.width * this.height);

    function RGB(red, green, blue) {
        return (red << 16) | (green << 8) | blue;;
    }

    this.fillRGB = function(r, g, b) {
        var color = RGB(r, g, b);

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.setPixel(x, y, color);
            }
        }
    }

    this.setPixel = function(x, y, color) {
        this.pixels[y * this.height + x] = color;
    }

    this.render = function() {
        return matrix.render(this.pixels);
    }


}
