#!/usr/bin/env node

class Sample  {


    parse(text) {
        var regexp = new RegExp(':*:');

        var match = regexp.split(text);
        console.log(match);

        //var split = text.split(/:*:/);

        //console.log('Text', text);
        //split.forEach((element, index) => {
          //  console.log(index, element);
            
        //});
    }
    run() {
        this.parse('Jag vill ha en :beer:. Eller en :hotdog: nu. Eller kanske ::kalle olle::?!');
    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
