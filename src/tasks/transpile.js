var deepmerge = require('deepmerge');

var transpile = function (context) {
    var self = this,
        babel = null,
        config = null;

    self.processBundle = function (files) {
        if (babel === null) {
            babel = require('babel-core');

            if (context.bundleConfig.babelConfig !== undefined && context.bundleConfig.babelConfig !== null) {
                config = context.bundleConfig.babelConfig;
            } else {
                config = {};
            }
        }

        var options = deepmerge(config, {
                ast: false,
                presets: ['es2015']
            });

        for (var file in files) {
            options.filename = files[file].file;

            files[file].content = babel.transform(files[file].content, options).code;
        }

        return files;
    };
};

module.exports = transpile;
