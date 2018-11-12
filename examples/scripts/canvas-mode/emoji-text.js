#!/usr/bin/env node


var path = require('path');


class EmojiParser  {

    constructor(options) {
        this.emojis = [];
    }

    load(folder) {
        var fs = require('fs');
        var path = require('path');

        var emojis = [];

        fs.readdirSync(folder).forEach((file) => {

            var fileName = path.join(folder, file);
            var components = path.parse(fileName);

            if (components.ext == '.png') {
                emojis.push({
                    name: components.name,
                    fileName: fileName
                });
    
            }

        })
        
        console.log(emojis);

        this.emojis = emojis;
    }

    lookup(name) {
        return this.emojis.find((emoji) => {
            return emoji.name == name;
        });

    }

    parse(text) {

        var output = [];
        var regexp = new RegExp(/(\:[\w\-\+]+\:)/g);

        text.split(regexp).forEach((text) => {

            if (text.match(regexp)) {
                var name = text.replace(/:/g, '');

                var lookup = this.lookup(name);

                if (lookup != undefined)
                    output.push({emoji:name, fileName:lookup.fileName});
                else
                    output.push({text:text});
            }
            else {
                output.push({text:text});
            }
        });

        return output;
    }
};





class Sample  {



    run() {

        var parser = new EmojiParser();

        parser.load(path.join(__dirname, '../../emojis'));

        var result = parser.parse('Jag vill ha en :beer:. Eller :ice_cream: :foo: nu. Eller kanske :kalle olle:?!');


        console.log(result);
    }
}


var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
