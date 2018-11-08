
var Matrix = require('../index.js');


class Canvas {
    constructor() {
        this.matrix = new Matrix({width:32, height:32});
        this.width = 32;
        this.height = 32;
        this.pixels = new Uint32Array(this.width * this.height);
    }

    static RGB(red, green, blue) {
        return (red << 16) | (green << 8) | blue;;
    }

    fill(color) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.pixels[y * 32 + x] = this.RGB(0, 0, 128);
            }
        }
    }

    render() {

    }
}


function main() {

    var canvas = new Canvas();
    canvas.fill(canvas.RGB(128, 0, 0));

    setTimeout(function(){ console.log("Hello"); }, 3000);

}

main();




