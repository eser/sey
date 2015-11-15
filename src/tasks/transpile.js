var transpile = function (context) {
    var self = this,
    	babel = null;

    self.processFile = function (filename, content) {
        if (babel === null) {
        	babel = require('babel-core');
        }

        var options = {};

        return babel.transform(content, options);
    };
};

module.exports = transpile;
