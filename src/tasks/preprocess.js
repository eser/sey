var deepmerge = require('deepmerge');

var preprocess = function (context) {
    var self = this,
        preprocess = null,
        env = null;

    self.processBundle = function (files) {
        if (preprocess === null) {
            preprocess = require('preprocess');

            if (context.bundleConfig.preprocessVars !== undefined && context.bundleConfig.preprocessVars !== null) {
                env = deepmerge(process.env, context.bundleConfig.preprocessVars);
            } else {
                env = process.env;
            }
        }

        for (var file in files) {
            files[file].content = preprocess.preprocess(files[file].content, env);
        }

        return files;
    };
};

module.exports = preprocess;
