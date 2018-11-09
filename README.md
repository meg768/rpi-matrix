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


Example

	var Matrix = require('rpi-matrix');
	var matrix = new Matrix({width:32, height:32})
	...
