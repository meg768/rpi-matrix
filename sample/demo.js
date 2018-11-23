#!/usr/bin/env node

var fs = require('fs');
var path = require('path');


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
			var defaults = require('./demo.config.js');

			args.usage('Usage: $0 <command> [options]')

            args.option('led-cols',         {describe:'Number of columns for display', default:defaults['led-cols']});
            args.option('led-rows',         {describe:'Number of rows for display', default:defaults['led-rows']});
            args.option('led-gpio-mapping', {describe:'Type of hardware used', default:defaults['led-gpio-mapping']});
            args.option('led-rgb-sequence', {describe:'Matrix RGB color order', default:defaults['led-rgb-sequence']});
            args.option('led-scan-mode',    {describe:'Scan mode (0/1)', default:0});

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
