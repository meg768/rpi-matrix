
var Matrix = require('../index.js');


function main() {

    var matrix = new Matrix({width:32, height:32});

    for (var red = 0; red <= 255; red++) {
        matrix.fillRGB(red, 0, 0);
        matrix.render();
    
    }
    for (var red = 255; red >= 0; red--) {
        matrix.fillRGB(red, 0, 0);
        matrix.render();
    
    }

    setTimeout(function(){ console.log("Hello"); }, 3000);

}

main();




