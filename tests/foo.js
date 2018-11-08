
var Matrix = require('../index.js');

var matrix = new Matrix({width:32, height:32});
var size = 32 * 32;
var buffer = new Buffer(size*4);
var offset = 0;
for (var x = 0; x < 32; x++) {
    for (var y = 0; y < 32; y++) {
        buffer[offset++] = 128;
        buffer[offset++] = 128;
        buffer[offset++] = 128;
        buffer[offset++] = 128;
    }
}


matrix.draw(buffer);
matrix.update();


setTimeout(function(){ console.log("Hello"); }, 3000);

