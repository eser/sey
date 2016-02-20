'use strict';

class preprocess {
    exec(runnerOp, files) {
        let vars = process.env;
        // deepmerge(runnerOp.config.preprocessVars)

        for (let file of files) {
            const content = file.getContent();

            if (this._preprocessLib === undefined) {
                this._preprocessLib = require('preprocess');
            }

            const result = this._preprocessLib.preprocess(content, vars);

            file.setContent(result);
        }
    }
}

module.exports = preprocess;
