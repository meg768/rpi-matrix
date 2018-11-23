var Animation = require('../scripts/animation.js');


function random() {

    var isType = function (obj, type) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
    };

    var isArray = function (obj) {
        return isType(obj, 'Array');
    };

    var isObject = function (obj) {
        return obj !== null && isType(obj, 'Object');
    };

    var isInteger = function (n) {
        return Number(n) === n && n % 1 === 0;
    }

    if (arguments.length == 0)
        return Math.random();

    if (arguments.length == 1) {
        var arg = arguments[0];

        if (isArray(arg)) {
            return arg[Math.floor((Math.random() * arg.length))];
        }

        if (isInteger(arg)) {
            return Math.floor(Math.random() * arg);
        }

        if (isObject(arg)) {
            return arg[choose(Object.keys(arg))];
        }

    }

    if (arguments.length == 2) {
        if (isInteger(arguments[0]) && isInteger(arguments[1])) {
            return Math.floor(Math.random() * (arguments[1] - arguments[0] + 1)) + arguments[0];
        }
    }

    return 42;

}

class Worm {

    constructor(matrix, column) {
        this.column = column;
        this.height = matrix.height;
        this.width = matrix.width;
        this.matrix = matrix;

        this.reset();
    }

    render() {
        var x = this.column;
        var y = this.row;
        var length = this.length;

        
        if (y >= 0)
            this.matrix.setPixelHSL(x, y--, this.hue, 100, 80);

        for (var i = 0; i <= length; i++) {
            // Calculate brightness
            var luminanceIndex = (length - i) / length;

            if (y >= 0) {
                this.matrix.setPixelHSL(x, y--, this.hue, 100, Math.floor(luminanceIndex * 50));
            }
        }

        this.ticks++;

        if (this.ticks >= this.loops) {
            this.ticks = 0;
            this.row++;

            if (this.row - this.length > this.height)
                this.reset();

        }
    }

    reset() {
        var now = new Date();

        this.length = Math.floor(this.height * 0.1 + this.height * 0.9 * random(100) / 100);
        this.row = -this.length;
        this.loops = random([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5]);
        this.ticks = 0;
        this.hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }
}

module.exports = class RainAnimation extends Animation {

    constructor(matrix, options) {
        super(options);

        this.matrix = matrix;
        this.worms = [];

    }

    start()  {
        return new Promise((resolve, reject) => {
            this.worms = [];
    
            for (var offset = 0; offset < this.matrix.width; offset++) {
                this.worms.push(new Worm(this.matrix, offset));
            }

            resolve();
        });
    }

    stop() {
        return new Promise((resolve, reject) => {

            super.stop().then(() => {
                this.matrix.clear();
                this.matrix.render({blend:50});
            })
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            })

        });
    }    

    render() {
        for (var i = 0; i < this.worms.length; i++) {
            this.worms[i].render();
        }

        this.matrix.render();
    }

}

