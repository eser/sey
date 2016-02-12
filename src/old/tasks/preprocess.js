import deepmerge from 'deepmerge';

let preprocess = function () {
    let preprocess = null;

    this.processBundle = async (bundle, files) => {
        let env = process.env;

        if (bundle.config.preprocessVars !== undefined && bundle.config.preprocessVars !== null) {
            env = deepmerge(env, bundle.config.preprocessVars);
        }

        for (let fileKey in files) {
            let file = files[fileKey],
                token = file.addTask('preprocess');

            if (token.cached) {
                continue;
            }

            // load on demand
            if (preprocess === null) {
                preprocess = require('preprocess');
            }

            let content = file.getPreviousContent();
            file.updateContent(preprocess.preprocess(content, env));
        }

        return files;
    };
};

export default preprocess;
