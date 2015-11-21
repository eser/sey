var deepmerge = require('deepmerge');

var preprocess = function () {
    var self = this,
        preprocess = null,
        env = null;

    self.processBundle = function (bundle, files) {
        if (preprocess === null) {
            preprocess = require('preprocess');

            if (bundle.config.preprocessVars !== undefined && bundle.config.preprocessVars !== null) {
                env = deepmerge(process.env, bundle.config.preprocessVars);
            } else {
                env = process.env;
            }
        }

        for (var fileKey in files) {
            var file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
            }

            var content = file.getPreviousContent();
            file.updateContent(preprocess.preprocess(content, env));
        }

        return files;
    };
};

module.exports = preprocess;
