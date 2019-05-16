var Matrix = require('../matrix.js');
var Animation = require('../src/js/animation.js');


module.exports = class ScrollAnimation extends Animation  {

    constructor(options) {

        super(options);


        var {scrollDelay = 10, scrollDirection = 'right', scrollImage = undefined} = options;

        this.matrix = new Matrix({mode: 'canvas'});
        this.scrollDelay = scrollDelay;
        this.scrollDirection = scrollDirection;
        this.scrollImage = scrollImage;

    }

    loop() {
        return new Promise((resolve, reject) => {

            if (this.scrollImage == undefined) {
                throw new Error('scrollImage needed.')
            }
    
            Promise.resolve().then(() => {
                var image = this.scrollImage;
                this.matrix.render(image.data, {scroll:this.scrollDirection, scrollDelay:this.scrollDelay});

                resolve();
            })
            .catch(error => {
                reject(error);
            });
    
        });


    }    

};



