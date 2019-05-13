
var Matrix = require('../../../index.js');
var path = require('path');

class Command {

    constructor() {
        module.exports.command  = 'text [options]';
        module.exports.describe = 'Scroll text';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 text [options]');

		args.option('help', {describe:'Displays this information'});
		args.option('text', {describe:'Text to display', default:'Hello World'});
		args.option('textColor', {describe:'Specifies text color', default:'blue'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {
        var Matrix = require('../../../index.js');
        var TextAnimation = require('../animations/text-animation.js');

        try {
            var matrix = new Matrix(Object.assign({}, argv, {mode:'canvas', 'led-scan-mode':1}));
			var animation = new TextAnimation(matrix, argv);
			
            animation.run().then(() => {

            })
            .catch((error) => {
                console.error(error.stack);
            });
		}
		catch (error) {
			console.error(error.stack);
		}

    }
    


};

new Command();



