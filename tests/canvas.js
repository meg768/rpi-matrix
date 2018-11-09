
var Matrix = require('../index.js');
var Canvas = require('canvas');



function main() {


    var matrix = new Matrix({width:32, height:32});
    
    matrix.registerFont('./fonts/Verdana.ttf', { family: 'Comic Sans' });

    var canvas = matrix.getCanvas();
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, matrix.width, matrix.height);
    matrix.render();
    
    function scrollText(text) {

        return new Promise(function(resolve, reject) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
    
            var textSize = ctx.measureText(text); 
        
            for (var offset = matrix.width; offset > -textSize.width; offset--) {
                ctx.clearRect(0, 0, matrix.width, matrix.height);
                ctx.fillText(text, offset, matrix.height / 2);

                matrix.render();
                matrix.render();
                matrix.render();
                matrix.render();

            }
            console.log('Done!');
            resolve();
        });
    
    }

    scrollText('Hello World').then(function(){
        return scrollText('Done!');
    });



 
}

main();




