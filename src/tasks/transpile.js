var deepmerge = require('deepmerge');

var transpile = function () {
    var self = this,
        babel = null,
        config = null;

    self.processBundle = function (bundle, files) {
        if (babel === null) {
            babel = require('babel-core');

            if (bundle.config.babelConfig !== undefined && bundle.config.babelConfig !== null) {
                config = bundle.config.babelConfig;
            } else {
                config = {};
            }
        }

        var options = deepmerge(config, {
                ast: false,
                presets: ['es2015']
            });

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
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
