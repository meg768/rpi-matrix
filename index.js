var path   = require("path");
var matrix = require(path.join(__dirname, "build", "Release", "rpi-matrix.node"));

var Matrix = module.exports = function(config) {

    matrix.configure(config);

    this.width  = matrix.width;
    this.height = matrix.height;

    this.render = function() {
        return matrix.render.apply(this, arguments);
    }
    
    this.update = function() {
        return matrix.update.apply(this, arguments);
    }

}
