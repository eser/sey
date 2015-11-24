var deepmerge = require('deepmerge');

var transpile = function () {
    var self = this,
        babel = null;

    self.processBundle = function (bundle, files) {
        var options = {
            ast: false,
            presets: ['es2015'],

            ignore: /(bower_components)|(node_modules)/,
            only: null
        };
        
        if (bundle.config.babelConfig !== undefined && bundle.config.babelConfig !== null) {
            options = deepmerge(bundle.config.babelConfig, options);
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (babel === null) {
                babel = require('babel-core');
            }

            options.filename = file.relativeFile;

            var content = file.getPreviousContent(),
                result = babel.transform(content, options);

            file.updateContent(result.code);
        }

        return files;
    };
};

module.exports = transpile;
