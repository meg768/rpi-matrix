

class Command {


    constructor() {
        module.exports.command  = 'server [options]';
        module.exports.describe = 'Run matrix server';
        module.exports.builder  = this.defineArgs;
        module.exports.handler  = this.run;        
    }

	defineArgs(args) {


		args.usage('Usage: $0 server [options]');
		args.option('help',     {alias:'h', describe:'Displays this information'});
		args.option('port',     {alias:'p', describe:'Specifies port', default:3013});

		args.wrap(null);

		args.check(function(argv) {

			return true;
		});

		return args.argv;
    }

	run(argv) {
        var Server = require('../scripts/server.js');
        var server = new Server(argv);

        server.run();
	}




};


new Command();