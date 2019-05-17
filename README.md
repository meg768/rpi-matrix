# rpi-matrix

A module for generating animations on a Raspberry PI connected to a RGB LED matrix display (See https://www.adafruit.com/product/607).

This module may be used in two modes, either simple **pixel-mode** or in **canvas-mode**
which enables you to draw graphics using the HTML5 Canvas API https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API.

Before you install this, please read this https://github.com/hzeller/rpi-rgb-led-matrix
and make sure you have the appropriate libraries installed on your Raspberry Pi.

This module also uses npm module **canvas** https://www.npmjs.com/package/canvas. Again, make sure your Raspberry
is updated with the proper components to compile.  

## Installation
	$ npm install rpi-matrix --save


## Usage

	var Matrix = require('rpi-matrix');
	var matrix = new Matrix({width:32, height:32});


## Constructor

### new Matrix(config)

Constructs a new matrix object. The **config** argument must contain the following values.

- **width**      - Specifies the width of the display. Same as **led-cols** below.
- **height**     - Specifies the height of the display. Same as **led-rows** below.
- **mode**       - Specifies mode, either **pixel** or **canvas**

This module also supports (almost) all of the command line options available with
the samples from H Zeller. See https://github.com/hzeller/rpi-rgb-led-matrix
for details.

- **led-rows**  
- **led-cols**  
- **led-row-addr-type**
- **led-multiplexing**
- **led-gpio-mapping**
- **led-chain**
- **led-parallel**
- **led-pixel-mapper**
- **led-brightness**
- **led-pwm-bits**
- **led-show-refresh**
- **led-scan-mode**
- **led-pwm-lsb-nanoseconds**
- **led-pwm-dither-bits**
- **led-slowdown-gpio**
- **led-no-hardware-pulse**
- **led-inverse**
- **led-rgb-sequence**

### Static Members

This module has two dependencies, the npm module **canvas** and **color**.
These may be accessed using the following static members.

- **Matrix.Canvas** - Contains the canvas API (same as **require('canvas')**)
- **Matrix.Color**  - Contains the color API (same as **require('color')**)
    

### Example

	var Matrix = require('rpi-matrix');

    class Sample extends Matrix {

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

### Methods

- **clear()**                       - Clears the matrix, all pixels off
- **fill(color)**                   - Fills entire matrix with a color
- **setPixel(x, y, color)**         - Set pixel at specified position
- **getPixel(x, y)**                - Returns color at specified location
- **setPixelRGB(x, y, r, g, b)**    - Sets a pixel using RGB colors
- **setPixelHLS(x, y, h, l, s)**    - Sets a pixel using HLS colors
- **render([image], [options])**    - Renders the current pixels (or specified image) to the matrix. The **options** parameter may contain **blend** or **scroll** values. See source code for details.
- **RGB(r, g, b)**                  - Returns a RGB color as an integer
- **HLS(h, l, s)**                  - Returns a HLS color as an integer
- **sleep(milliseconds)**           - Helper function. Sleep the number of milliseconds specified.

### Member Variables

- **mode**    - Specifies the matrix mode. Either **pixel** or **canvas**.
- **width**   - Specifies the width of the display
- **height**  - Specifies the height of the display
- **pixels**  - An array (Uint32Array) representing the pixels.

## Canvas Mode

You may also construct a Matrix object in **canvas** mode.
This gives you the ability to do more advanced graphics
by using the HTML5 canvas API (or close to it) thanks to 
the npm module **canvas** https://www.npmjs.com/package/canvas.
For more information about the Canvas API visit https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API.

Example

	var Matrix = require('rpi-matrix');
	var matrix = new Matrix({mode:'canvas', width:32, height:32});
    ...

When used in **canvas** mode the following methods are available

### Methods

- **render([image], [options])**    - Renders the current canvas (or specified image) to the matrix. The **options** parameter may contain **blend** or **scroll** values. See source code for details.
- **sleep(milliseconds)**           - Helper function. Sleep the number of milliseconds specified.

### Member Variables

- **mode**    - Specifies the matrix mode. Either **pixel** or **canvas**.
- **width**   - Specifies the width of the display
- **height**  - Specifies the height of the display
- **canvas**  - The canvas used.

### Simple Example using Canvas Mode

	var Matrix = require('rpi-matrix');

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

### Simple Example using Fonts in Canvas Mode

	var Matrix = require('rpi-matrix');
    var path = require("path");

    Matrix.Canvas.registerFont(path.join(__dirname, '../fonts/Verdana.ttf'), { family: 'what-ever' });

    class Sample extends Matrix {

        run() {
            var ctx = this.canvas.getContext('2d');

            ctx.font = 'bold 16px Verdana';
            ctx.fillStyle = 'blue';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('X', this.width / 2, this.height / 2);

            this.render();

            setTimeout(() => {}, 3000);
        }
    };
    var sample = new Sample({mode:'canvas', width:32, height:32});
    sample.run();


The example above displays the letter 'X' centered on the display.
To use fonts not already installed on you Raspberry Pi, make sure to
call **Matrix.Canvas.registerFont()** before any graphics are drawn.

See https://github.com/meg768/rpi-matrix/tree/master/examples/scripts for more examples.