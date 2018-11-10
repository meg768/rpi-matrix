# rpi-matrix

A module for generating animations on a Raspberry PI.
Before you install this, please read this https://github.com/hzeller/rpi-rgb-led-matrix
and make sure you have the appropriate libraries installed on your Raspberry Pi.

This module also uses npm module **canvas** (https://www.npmjs.com/package/canvas). Again, make sure your Raspberry
is updated with the proper components to compile.  

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

### Example

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

## Pixel Mode


When used in **pixel** mode the following methods are available

- **clear()**                    - Clears the matrix, all pixels off
- **fill(color)**                - Fills entire matrix with a color
- **setPixel(x, y, color)**      - Set pixel at specified position
- **getPixel(x, y)**             - Returns color at specified location
- **setPixelRGB(x, y, r, g, b)** - Sets a pixel using RGB colors
- **setPixelHLS(x, y, h, l, s)** - Sets a pixel using HLS colors
- **render([pixels], [delay])**  - Renders the current pixels to the matrix

## Canvas Mode

You may also construct a Matrix object in **canvas** mode.
This gives you the ability to do more advanced graphics
by using the HTML-5 canvas API (or close to it).

Example

	var Matrix = require('rpi-matrix');
	var matrix = new Matrix({mode:'canvas', width:32, height:32});
    ...

When used in **canvas** mode the following methods are available

- **getCanvas()**                 - Returns the canvas associated with the matrix display. Also available as member variable **matrix.canvas**.
- **createCanvas(width, height)** - Creates and returns an off-screen canvas that may be used for more advanced graphics.
- **loadImage(image)**            - Helper function to load PNG or JPEG images. Returns a **Promise**.
- **render([image], [delay])**    - Renders the current canvas (or specified image) to the matrix.

### Simple Example using Canvas Mode

    class Sample extends Matrix {

        run() {
            var ctx = this.canvas.getContext('2d');

            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, this.width, this.height);

            this.render();
            setTimeout(() => {}, 3000);
        }
    };

    var sample = new Sample({mode:'canvas', width:32, height:32});
    sample.run();

