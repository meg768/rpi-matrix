#!/usr/bin/env node
var Matrix = require('../../../index.js');
var ClockAnimation = require('../animations/clock-animation.js');

class Command {

    constructor() {
        module.exports.command  = 'clock [options]';
        module.exports.describe = 'Show time';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 clock [options]');

		args.option('help', {describe:'Displays this information'});
		args.option('duration', {describe:'Animation duration in milliseconds', default:15000});
		args.option('color', {describe:'Colorize with specified color'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}

	run(argv) {

		try {
            var matrix = new Matrix(Object.assign({}, argv, {mode:'canvas'}));
            var animation = new ClockAnimation(matrix, argv);
            
			animation.run();
		}
		catch (error) {
			console.error(error.stack);
		}

    }

    


};

new Command();
