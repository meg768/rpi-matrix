

class Command {

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
        args.option('textColor', {describe:'Specifies text color', default:'blue'});

        args.wrap(null);

        args.check(function(argv) {
            return true;
        });

        return args.argv;
    }


    run(argv) {
        var Matrix = require('../../../matrix.js');
        var TextAnimation = require('../../../animations/text.js');

        Matrix.configure(argv);


        try {



            Promise.resolve().then(() => {
                var animation = new TextAnimation(argv);
                return animation.run();
            })
            .then(() => {
                var options = {...argv, ...{text:'Thats all folks!', textColor:'blue'}};
                var animation = new TextAnimation(options);
                return animation.run();

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

new Command();



