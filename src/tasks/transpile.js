var deepmerge = require('deepmerge');

var transpile = function () {
    var self = this,
        babel = null,
        config = null;

    self.processBundle = function (bundle, files) {
        var options;

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('preprocess');
console.log(token);
            if (token.cached) {
                continue;
            }

            // load on demand
            if (babel === null) {
                babel = require('babel-core');
    
                if (bundle.config.babelConfig !== undefined && bundle.config.babelConfig !== null) {
                    config = bundle.config.babelConfig;
                } else {
                    config = {};
                }

                options = deepmerge(config, {
                    ast: false,
                    presets: ['es2015'],
    
                    ignore: /(bower_components)|(node_modules)/,
                    only: null
                });
            }

var now = Date.now();
            options.filename = file.relativeFile;

            var content = file.getPreviousContent(),
                result = babel.transform(content, options);
console.log('transform', Date.now() - now);

            file.updateContent(result.code);
        }

        return files;
    };
};

module.exports = transpile;
