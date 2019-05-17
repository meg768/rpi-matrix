#!/usr/bin/env node

var fs = require('fs');
var path = require('path');



class TextSample {

    constructor() {
        module.exports.command  = 'text [options]';
        module.exports.describe = 'Scroll text';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;  
    }

    defineArgs(args) {

        args.usage('Usage: $0 [options]');

        args.option('help', {describe:'Displays this information'});
        args.option('text', {describe:'Text to display', default:'Hello World'});
        args.option('textColor', {describe:'Specifies text color'});

        args.wrap(null);

        args.check(function(argv) {
            return true;
        });

        return args.argv;
    }


    run(argv) {
        var root = '.';

        var Matrix = require(path.join(root, './matrix.js'));
        var TextAnimation = require(path.join(root, './animations/text-animation.js'));
        var AnimationQueue = require(path.join(root, './src/js/animation-queue.js'));

        Matrix.configure(argv);

        try {

            var queue = new AnimationQueue();

            var A = new TextAnimation(argv);
            var B = new TextAnimation({...argv, ...{text:'Thats all folks! :sunglasses:', textColor:'blue'}});

            queue.enqueue(A);
//            queue.enqueue(B);

            queue.dequeue().then(() => {
                console.log('Done!')
            })
            .catch(error => {
                console.error(error.stack);
            })
        }
        catch (error) {
            console.error(error.stack);
        }

    }
    


};





var App = function() {




	function run() {
		try {
			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]')

            args.option('led-cols',         {describe:'Number of columns for display', default:64});
            args.option('led-rows',         {describe:'Number of rows for display', default:32});
            args.option('led-gpio-mapping', {describe:'Type of hardware used', default:'regular'});
            args.option('led-rgb-sequence', {describe:'Matrix RGB color order', default:'RGB'});
            args.option('led-scan-mode',    {describe:'Scan mode (0/1)', default:0});

			args.command(new TextSample);  

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
