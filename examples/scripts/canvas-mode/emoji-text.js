#!/usr/bin/env node

var Matrix = require('../../../index.js');
var path = require('path');

class Sample extends Matrix  {

    constructor(matrixOptions, options) {
        super(matrixOptions);

        var defaultOptions = {
            scrollDelay: 10,
            fontSize: 0.35,
            fontName: 'Arial'
        };

        this.options = {...defaultOptions, ...options};
        console.log('OPTIONS:', this.options);
    }

    loadEmojis(folder) {
        var fs = require('fs');
        var path = require('path');

        var emojis = [];

        fs.readdirSync(folder).forEach((file) => {

            var fileName = path.join(folder, file);
            var components = path.parse(fileName);

            if (components.ext == '.png') {
                emojis[components.name] = {fileName:fileName};
            }

        })


        this.colors = require('color-name');
        this.emojis = emojis;
    }


    createTextImage(text) {
        
        var myctx = this.canvas.getContext('2d');
        var textSize = myctx.measureText(text); 

        var canvas = this.createCanvas(textSize.width, this.height);

        var ctx = canvas.getContext('2d');
        ctx.font = myctx.font;
        ctx.fillStyle = myctx.fillStyle;
        ctx.textAlign = 'center';
        ctx.textBaseline = myctx.textBaseline;

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    createEmojiImage(image) {
        var margin = this.height * 0.5;
        var scale = (this.height - margin) / image.height;  

        var imageWidth = image.width * scale;
        var imageHeight = image.height * scale;

        var canvas = this.createCanvas(imageWidth, imageHeight);
        var ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, imageWidth, imageHeight);  
        
        return ctx.getImageData(0, 0, canvas.width, canvas.height);    

    }

    prepare(item) {
        var util = require('util');
        return new Promise((resolve, reject) => {

            try {
                if (item.type == 'emoji') {
                    if (item.fileName != undefined) {
                        this.loadImage(item.fileName).then((image) => {
                            item.image = this.createEmojiImage(image);    
                        })
                        .then(() => {
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        });
            
                    }
                    else
                        throw new Error('No image for emoji!');
                }
                else if (item.type == 'text') {
                    if (item.text.length > 0)
                       item.image = this.createTextImage(item.text);

                    resolve();
                }
                else if (item.type == 'color') {
                    var ctx = this.canvas.getContext('2d');
                    ctx.fillStyle = util.format('rgb(%d,%d,%d)', item.color[0], item.color[1], item.color[2]);
                    resolve();
                }
                else {
                    throw new Error('Invalid item: ' + JSON.stringify(item));
                }
    
            }
            catch(error) {
                reject(error);
            }
        });
    }

    parse(text) {

        return new Promise((resolve, reject) => {
            var output = [];
            var regexp = new RegExp(/(\:[\w\-\+]+\:|\{[\w\-\+]+\})/g);
            var emojiRegExp = new RegExp(/(\:[\w\-\+]+\:)/g);
            var colorRegExp = new RegExp(/(\{[\w\-\+]+\})/g);

            text.split(regexp).forEach((text) => {
    
                if (text.match(emojiRegExp)) {
                    var name  = text.replace(/:/g, '');
                    var emoji = this.emojis[name];
    
                    if (emoji != undefined) {
                        output.push({type:'emoji', name:name, fileName:emoji.fileName});
                    }
                    else
                        output.push({type:'text', text:text});
                }
                else if (text.match(colorRegExp)) {
                    var name  = text.replace('{', '').replace('}', '');    
                    var color = this.colors[name];
    
                    if (color != undefined) {
                        output.push({type:'color', name:name, color:color});
                    }
                    else
                        output.push({type:'text', text:text});
                }
                else {
                    output.push({type:'text', text:text});
                }
            });
    
            console.log(output);
            var promise = Promise.resolve();

            output.forEach((item) => {
                promise = promise.then(() => {
                    return this.prepare(item);
                })
            })

            promise.then(() => {
                resolve(output);
            })
            .catch(error => {
                reject(error);
            });
 
            
        });
    }

    createDisplayImage(items) {

        var totalWidth = 0;
        var offset = 0;

        items.forEach((item) => {
            if (item.image != undefined)
                totalWidth += item.image.width;
        });

        var canvas = this.createCanvas(totalWidth + this.width, this.height);
        var ctx = canvas.getContext('2d');

        items.forEach((item) => {
            if (item.image != undefined) {
                ctx.putImageData(item.image, offset, (this.height - item.image.height) / 2);
                offset += item.image.width;    
            }
        });

        return ctx.getImageData(0, 0, canvas.width, canvas.height);

    }

    run(text) {

        var ctx = this.canvas.getContext('2d');
        ctx.font = '' + this.height * this.options.fontSize + 'px ' + this.options.fontName;
        ctx.fillStyle = 'red';
        ctx.textBaseline = 'middle';

        this.loadEmojis(path.join(__dirname, '../../emojis'));

        this.parse(text).then((context) => {
            var image = this.createDisplayImage(context);
            this.render(image.data, {scroll:'left', scrollDelay:this.options.scrollDelay});
        })
        .catch(error => {
            console.log(error);
        });


    }
};





var sample = new Sample({mode:'canvas', 'led-gpio-mapping':'adafruit-hat-pwm', 'led-rgb-sequence':'RBG', 'led-cols':64, 'led-rows':64, 'led-scan-mode':1});
//sample.run('{red}Jag vill ha en :beer: tror jag. {blue}Nej, vill ha :grapes: istället. {white}Vädret i morgon :partly_sunny:...');

sample.run('{white}Fått regexp att funka! :sunglasses: {lightgreen}Nästa steg är att få det att funka med {blue}G{red}o{yellow}o{blue}g{green}l{red}e {white}home... :winking:');
