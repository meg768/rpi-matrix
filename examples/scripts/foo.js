
var Matrix = require('../../index.js');
var matrix = new Matrix({width:32, height:32});

function pulse() {


    for (var red = 0; red <= 255; red++) {
        matrix.fillRGB(red, 0, 0);
        matrix.render();
    
    }
    for (var red = 255; red >= 0; red--) {
        matrix.fillRGB(red, 0, 0);
        matrix.render();
    
    }


}


function main() {

    matrix.fillRGB(0, 0, 0);
    matrix.render();

    var width   = matrix.width;
    var height  = matrix.height;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            matrix.fillRGB(128, 0, 0);
            matrix.setPixelRGB(x, y, 255, 255, 255);
            matrix.render();

        }
    }
 
 
}

main();
setTimeout(function(){ console.log("Hello"); }, 3000);




