
var Matrix = require('../../../index.js');
var RainAnimation = require('../animations/rain-animation.js');


class Command {

    constructor() {
        module.exports.command  = 'rain [options]';
        module.exports.describe = 'Fill matrix with rain';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        

    }

    defineArgs(args) {

		args.usage('Usage: $0 rain [options]');
		
		args.option('help', {describe:'Displays this information'});
		args.option('duration', {describe:'Animation duration', default:-1});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {

		try {
            var matrix = new Matrix(Object.assign({}, argv, {mode:'pixel'}));
            var animation = new RainAnimation(Object.assign({}, argv, {matrix:matrix}));
            
			animation.run();
		}
		catch (error) {
			console.error(error.stack);
		}

    }

};

new Command();



