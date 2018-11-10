#!/usr/bin/env node

class Sample  {


    parse(text) {
        var regexp = new RegExp();

///        var split = text.split(/:*:/);

//        var split = text.split(/:[a-z,-]+:/);

       // var split = text.split(/:*^[\w]*:/);

        var split = text.split(/:*:/);
        split.forEach((element, index) => {
            console.log(index, element);
            
        });
    }
    run() {
        this.parse('Hello :funny: :kalle olle: baby. I want some juice. And some :ice-gream: now!');
    }
};

var sample = new Sample({mode:'canvas', width:32, height:32});
sample.run();
