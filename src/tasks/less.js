var deepmerge = require('deepmerge');

var less = function () {
    var self = this,
        lessLib = null;

    self.processBundle = async function (bundle, files) {
        var options = {
        };
        
        if (bundle.config.lessConfig !== undefined && bundle.config.lessConfig !== null) {
            options = deepmerge(bundle.config.lessConfig, options);
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('less');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (lessLib === null) {
                lessLib = require('less');
            }

            options.filename = file.relativeFile;

            var content = file.getPreviousContent();

            var result = await lessLib.parse(options, content);
            file.updateContent(result.css);
        }

        return files;
    };
};

module.exports = less;
