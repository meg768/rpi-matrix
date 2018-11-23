#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});


var App = function() {


	this.fileName = __filename;

	function loadCommands(args) {
		var folder = path.join(__dirname, './src/commands');

		fs.readdirSync(folder).forEach((file) => {

			var fileName = path.join(folder, file);
			var components = path.parse(fileName);

			if (components.ext == '.js') {
				args.command(require(fileName));  
			}

		})

	}

	function run() {
		try {
			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]')

			var LED_COLS = process.env.LED_COLS || 32;
			var LED_ROWS = process.env.LED_ROWS || 32;
			var LED_GPIO_MAPPING = process.env.LED_GPIO_MAPPING || 'regular';
			var LED_RGB_SEQUENCE = process.env.LED_RGB_SEQUENCE || '';
			var LED_SCAN_MODE = process.env.LED_SCAN_MODE || 0;

			LED_COLS = parseInt(LED_COLS);
			LED_ROWS = parseInt(LED_ROWS);
			LED_SCAN_MODE = parseInt(LED_SCAN_MODE);

			args.option('led-cols',         {describe:'Number of columns for display', default:LED_COLS});
            args.option('led-rows',         {describe:'Number of rows for display', default:LED_ROWS});
            args.option('led-gpio-mapping', {describe:'Type of hardware used', default:LED_GPIO_MAPPING});
            args.option('led-rgb-sequence', {describe:'Matrix RGB color order', default:LED_RGB_SEQUENCE});
            args.option('led-scan-mode',    {describe:'Scan mode (0/1)', default:LED_SCAN_MODE});

			loadCommands(args);

			args.help();
			args.wrap(null);

			args.check(function(argv) {
				return true;
			});

			args.demand(1);

			args.argv;

		}
		catch(error) {
			console.error(error.stack);
		}

	};


	run();
};

module.exports = new App();
