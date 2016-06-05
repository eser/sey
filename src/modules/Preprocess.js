const deepmerge = require('../utils/deepmerge.js');

class Preprocess {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'preprocess',
            formats: '*',
            op: 'preprocess',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const vars = process.env;

        vars.BUNDLE = runnerOpSet.bundleName;
        vars.ENV = runnerOpSet.getTarget();

        if (runnerOpSet.config.preprocessVars !== undefined) {
            deepmerge(vars, runnerOpSet.config.preprocessVars);
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

module.exports = Preprocess;
