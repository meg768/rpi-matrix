
var Matrix = require('../index.js');
var matrix = new Matrix({width:32, height:32});
var Canvas = require('canvas');



function main() {

    matrix.fillRGB(0, 0, 0);
    matrix.render();

    var width   = matrix.width;
    var height  = matrix.height;

    Canvas.registerFont('./fonts/Verdana.ttf', { family: 'Comic Sans' });

    const canvas = Canvas.createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    
    function scrollText(text) {

        return new Promise(function(resolve, reject) {
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
    
            var textSize = ctx.measureText(text); 
        
            for (var offset = canvas.width; offset > -textSize.width; offset--) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillText(text, offset, canvas.height / 2);
                matrix.render(canvas.toBuffer('raw'));
                matrix.render(canvas.toBuffer('raw'));
                matrix.render(canvas.toBuffer('raw'));
                matrix.render(canvas.toBuffer('raw'));
                matrix.render(canvas.toBuffer('raw'));
        
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




