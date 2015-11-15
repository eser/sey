var transpile = function (context) {
    var self = this,
    	babel = null;

    self.processFile = function (srcPath, file) {
        if (babel === null) {
        	babel = require('babel-core');
        }

        var options = {};

        file.content = babel.transform(file.content, options);

        return file;
    };
};

module.exports = transpile;
