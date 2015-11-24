var deepmerge = require('deepmerge');

var preprocess = function () {
    var self = this,
        preprocess = null;

    self.processBundle = function (bundle, files) {
        var env = process.env;

        if (bundle.config.preprocessVars !== undefined && bundle.config.preprocessVars !== null) {
            env = deepmerge(env, bundle.config.preprocessVars);
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (preprocess === null) {
                preprocess = require('preprocess');
            }

            var content = file.getPreviousContent();
            file.updateContent(preprocess.preprocess(content, env));
        }

        return files;
    };
};

module.exports = preprocess;
