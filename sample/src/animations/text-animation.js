var Animation = require('../scripts/animation.js');
var path = require('path');

module.exports = class TextAnimation extends Animation  {

    constructor(matrix, options) {

        var defaultOptions = {
            scrollDelay : 7.5 * (64*64) / (matrix.width * matrix.height),
            fontSize    : 0.45,
            emojiSize   : 0.60,
            fontName    : 'Arial',
            textColor   : 'purple'
        };

        super({...defaultOptions, ...options});

        this.matrix  = matrix;
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
        
        var myctx = this.matrix.canvas.getContext('2d');
        var textSize = myctx.measureText(text); 
        var canvas = this.matrix.createCanvas(textSize.width, this.matrix.height);

        var ctx = canvas.getContext('2d');
        ctx.font = myctx.font;
        ctx.fillStyle = myctx.fillStyle;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    createEmojiImage(image) {
        var margin = this.matrix.height * (1 - this.options.emojiSize);
        var scale = (this.matrix.height - margin) / image.height;  

        var imageWidth = image.width * scale;
        var imageHeight = image.height * scale;

        var canvas = this.matrix.createCanvas(imageWidth, imageHeight);
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
                        this.matrix.loadImage(item.fileName).then((image) => {
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
                    var ctx = this.matrix.canvas.getContext('2d');
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

        var canvas = this.matrix.createCanvas(totalWidth + this.matrix.width, this.matrix.height);
        var ctx = canvas.getContext('2d');

        items.forEach((item) => {
            if (item.image != undefined) {
                ctx.putImageData(item.image, offset, (this.matrix.height - item.image.height) / 2);
                offset += item.image.width;    
            }
        });

        return ctx.getImageData(0, 0, canvas.width, canvas.height);

    }

    run() {
        return new Promise((resolve, reject) => {
            var text = this.options.text || 'Hmmm ;)';
            var ctx = this.matrix.canvas.getContext('2d');
            ctx.font = '' + (this.matrix.height * this.options.fontSize) + 'px ' + this.options.fontName;
            ctx.fillStyle = this.options.textColor;
    
            this.loadEmojis(path.join(__dirname, '../../emojis'));
    
            this.parse(text).then((context) => {
                var image = this.createDisplayImage(context);
                this.matrix.render(image.data, {scroll:'left', scrollDelay:this.options.scrollDelay});

                resolve();
            })
            .catch(error => {
                reject(error);
            });
    
        });


    }
};





