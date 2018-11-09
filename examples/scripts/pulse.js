
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


pulse();
setTimeout(function(){ console.log("Hello"); }, 3000);




