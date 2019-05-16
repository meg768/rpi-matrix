

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
        var TextAnimation = require('../../../animations/text-animation.js');
        var AnimationQueue = require('../../../src/js/animation-queue.js');

        var {textColor, text, ...matrixOptions} = argv;
        var textOptions = {textColor, text};

        console.log('matrixOptions', matrixOptions);
        console.log('textOptions', textOptions);

        Matrix.configure(matrixOptions);

        try {

            var queue = new AnimationQueue();

            var A = new TextAnimation(textOptions);
            var B = new TextAnimation({...textOptions, ...{text:'Thats all folks! :sunglasses:', textColor:'blue'}});

            queue.enqueue(A);
            queue.enqueue(B);

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

new Command();



