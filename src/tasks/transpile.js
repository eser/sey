var transpile = function (context) {
    var self = this,
        babel = null;

    self.processBundle = function (files) {
        if (babel === null) {
            babel = require('babel-core');
        }

        for (var file in files) {
            var options = {
                filename: files[file].file,
                ast: false,
                presets: ['es2015']
            };

            files[file].content = babel.transform(files[file].content, options).code;
        }

        return files;
    };
};

module.exports = transpile;
