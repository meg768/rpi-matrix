# rpi-matrix

A module for generating animations on a Raspberry PI.
Before you install this, please read this https://github.com/hzeller/rpi-rgb-led-matrix.

## Installation
	$ npm install rpi-matrix --save


## Usage

	var Matrix = require('rpi-matrix');
	var matrix = new Matrix({width:32, height:32});



## Constructor

### new Matrix(config)

Constructs a new matrix object. The **config** argument must contain the following values.

- **width**      - Specifies the width of the display.
- **height**     - Specifies the height of the display.
- **mode**       - Specifies mode, either **pixel** or **canvas**

Example

	var Matrix = require('rpi-matrix');

    class Sample extends Matrix {

        constructor(options) {
            super(options);
        }

        run() {
            var red;

            for (red = 0; red <= 255; red++) {
                this.fill(this.RGB(red, 0, 0));
                this.render();
            
            }
            for (red = 255; red >= 0; red--) {
                this.fill(this.RGB(red, 0, 0));
                this.render();
            
            }    
        }
    }

    var sample = new Sample({mode:'pixel', width:32, height:32});
    sample.run();