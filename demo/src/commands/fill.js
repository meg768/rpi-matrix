
var Matrix = require('../../../matrix.js');

class Sample extends Matrix {


	constructor(options) {
		super({...options, ...{mode:'canvas'}});

		this.options = options;
	}

    run() {
        var ctx = this.canvas.getContext('2d');

        // Fill matrix with blue and blend in using 100 steps
        ctx.fillStyle = this.options.color;
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:this.options.blend});

        // Clear and blend using 100 steps (fade out)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);
        this.render({blend:this.options.blend});

    }
};


class Command {

    constructor() {
        module.exports.command  = 'fill [options]';
        module.exports.describe = 'Fill matrix with a color';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 [options]');

		args.option('help',     {describe:'Displays this information'});
		args.option('color',    {describe:'Specifies color', default:'rgb(128, 0, 0)'});
		args.option('blend',    {describe:'Specifies blend (fade in/fade out) speed', default:100});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {

		try {
			var sample = new Sample(argv);
			sample.run();
		}
		catch (error) {
			console.error(error.stack);
		}

    }
    


};

new Command();



