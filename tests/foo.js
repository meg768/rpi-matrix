
var Matrix = require('../index.js');

var matrix = new Matrix({width:32, height:32});
var size = 32 * 32;

function RGB(red, green, blue) {
    return (red << 16) | (green << 8) | blue;;
}


var pixels  = new Uint32Array(size);

for (var x = 0; x < 32; x++) {
    for (var y = 0; y < 32; y++) {
        pixels[y * 32 + x] = RGB(128, 0, 0);
    }
}

/*
var pixels  = new Buffer(size * 4);
var offset = 0;
for (var x = 0; x < 32; x++) {
    for (var y = 0; y < 32; y++) {
        pixels[offset++] = 0;
        pixels[offset++] = 128;
        pixels[offset++] = 0;
        pixels[offset++] = 0;
    }
}
*/
matrix.draw(pixels);
matrix.update();



setTimeout(function(){ console.log("Hello"); }, 3000);

