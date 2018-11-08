
var Matrix = require('../index.js');

var matrix = new Matrix({width:32, height:32});
var size = 32 * 32;
var pixels  = new Uint32Array(size);

function RGB(red, green, blue) {
    return (red << 16) | (green << 8) | blue;;
}

for (var x = 0; x < 32; x++) {
    for (var y = 0; y < 32; y++) {
        pixels[y * 32 + x] = RGB(128, 0, 0);
    }
}

console.log(typeof pixels);
console.log(typeof pixels.buffer);
matrix.draw(pixels.buffer);
matrix.update();



setTimeout(function(){ console.log("Hello"); }, 3000);

