var Matrix = require('../../index.js');

module.exports = class Sample {

    constructor(options) {
        this.matrix = new Matrix(options);
    }

    delay(ms = 3000) {
        return new Promise((resolve, reject) => {
            return setTimeout(resolve, ms);
        });
    }

    run() {
        console.log('Nothing to do...');
    }
};

