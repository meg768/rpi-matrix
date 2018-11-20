
class Command {

    constructor() {
        module.exports.command  = 'test [options]';
        module.exports.describe = 'A simple test script';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;
        
    }

    defineArgs(args) {

		args.usage('Usage: $0 [options]');
		args.option('help', {describe:'Displays this information'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});

		return args.argv;
	}


	run(argv) {

        console.log(argv);
		try {
			this._argv = argv;

            console.log('OK');
		}
		catch (error) {
			console.error(error.stack);
		}

    }
    


};

new Command();



