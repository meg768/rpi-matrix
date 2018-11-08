
var Matrix = require('../index.js');


function Canvas(options) {


    this.matrix = new Matrix({width:32, height:32});
    this.width = 32;
    this.height = 32;
    this.pixels = new Uint32Array(this.width * this.height);

    function RGB(red, green, blue) {
        return (red << 16) | (green << 8) | blue;;
    }

    this.fillRGB = function(r, g, b) {
        var color = RGB(r, g, b);

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                //this.pixels[y * 32 + x] = color;
                this.setPixel(x, y, color);
            }
        }
    }

    this.setPixel = function(x, y, color) {
        this.pixels[y * this.height + x] = color;

    }

    this.render = function() {
        this.matrix.render(this.pixels);
    }
}


function main() {

    var canvas = new Canvas({width:32, height:32});
    for (var red = 0; red <= 255; red++) {
        canvas.fillRGB(red, 0, 0);
        canvas.render();
    
    }
    for (var red = 255; red >= 0; red--) {
        canvas.fillRGB(red, 0, 0);
        canvas.render();
    
    }

    setTimeout(function(){ console.log("Hello"); }, 3000);

}

main();




