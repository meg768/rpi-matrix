
var Matrix = require('../index.js');


function Canvas() {


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
                this.pixels[y * 32 + x] = color;
            }
        }
    }

    this.render = function() {
        this.matrix.draw(this.pixels);
        this.matrix.update();
    }
}


function main() {

    var canvas = new Canvas();
    canvas.fillRGB(128, 0, 0);

    setTimeout(function(){ console.log("Hello"); }, 3000);

}

main();




