'use strict';

const deepmerge = require('../utils/deepmerge.js');

class preprocess {
    info() {
        return [
            {
                phase: 'preprocess',
                formats: '*',
                op: 'preprocess',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
        let vars = process.env;
        vars.BUNDLE = runnerOp.bundleName;
        vars.ENV = runnerOp.getTarget();
        if (runnerOp.config.preprocessVars !== undefined) {
            deepmerge(vars, runnerOp.config.preprocessVars);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._preprocessLib === undefined) {
                this._preprocessLib = require('preprocess');
            }

            const result = this._preprocessLib.preprocess(content, vars/* , { type: 'js' } */);

            file.setContent(result);
        }
    }
}

module.exports = preprocess;
