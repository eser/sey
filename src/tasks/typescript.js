'use strict';

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    async exec(runnerOp, files) {
        let options = {};
        if (runnerOp.config.typescript !== undefined) {
            deepmerge(options, runnerOp.config.typescript);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._tsLib === undefined) {
                this._tsLib = require('typescript');
            }

            const result = this._tsLib.transpile(content, options);

            file.setContent(result);
        }
    }
}

module.exports = typescript;
