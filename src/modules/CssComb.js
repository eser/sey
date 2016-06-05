const deepmerge = require('../utils/deepmerge.js');

class CssComb {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'optimization',
            formats: 'css',
            op: 'optimize',
            weight: 0.8,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
        };

        if (runnerOpSet.config.eser === true) {
            deepmerge(options, require('eser/.csscomb.json'));
        }

        if (runnerOpSet.config.csscomb !== undefined) {
            deepmerge(options, runnerOpSet.config.csscomb);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._csscombInstance === undefined) {
                const csscombType = require('csscomb');

                this._csscombInstance = new csscombType(options, 'css');
            }

            const result = this._csscombInstance.processString(content);

            file.setContent(result);
        }
    }
}

module.exports = CssComb;
