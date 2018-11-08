
var Matrix = require('../index.js');

var matrix = new Matrix({width:32, height:32});
var size = 32 * 32;
var buffer = Buffer.Buffer.allocUnsafe(size*4);

for (var x = 0; x < 32; x++) {
    for (var y = 0; y < 32; y++) {
        var offset = y * 32 + x;
        buffer[offset+0] = 128;
        buffer[offset+1] = 128;
        buffer[offset+2] = 128;
        buffer[offset+3] = 128;
    }
}


matrix.draw(buffer);
matrix.update();

setTimeout(1000, function(){
    
});