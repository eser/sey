'use strict';

const deepmerge = require('../utils/deepmerge.js');

class preprocess {
    async exec(value, runnerOp, files) {
        let vars = process.env;
        if (runnerOp.config.preprocessVars !== undefined) {
            deepmerge(vars, runnerOp.config.preprocessVars);
        }

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
