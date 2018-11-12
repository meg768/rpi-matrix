#!/usr/bin/env node


class EmojiParser  {

    constructor(emojis) {
        this.emojis = emojis;
    }

    exists(name) {
        var result = this.emojis.find((emoji) => {
            return emoji == name;
        });

        return result != undefined;
    }

    parse(text) {

        var output = [];
        var regexp = new RegExp(/(\:[\w\-\+]+\:)/g);

        text.split(regexp).forEach((text) => {

            if (text.match(regexp)) {
                var emoji = text.replace(/:/g, '');

                if (this.exists(emoji))
                    output.push({emoji:emoji});
                else
                    output.push({text:text});
            }
            else {
                output.push({text:text});
            }
        });

        console.log(output);
        return output;
    }


};


class Sample  {



    run() {
        var parser = new EmojiParser(['beer', 'ice_cream', 'joy', 'fries']);
        parser.parse('Jag vill ha en :beer:. Eller :ice_cream: :foo: nu. Eller kanske :kalle olle:?!');
    }
}


var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
