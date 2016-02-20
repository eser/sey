'use strict';

const deepmerge = require('../utils/deepmerge.js');

class lint {
    exec(runnerOp, files) {
        let options = {};
        if (runnerOp.config.eslint !== undefined) {
            deepmerge(options, runnerOp.config.eslint);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._lintLib === undefined) {
                const eslint = require('eslint');
                this._lintLib = new eslint.CLIEngine(options);
            }

            const results = this._lintLib.executeOnText(content, file.file.path);

            // for (let result of results) {
            //     if (result.errorCount === 0 && result.warningCount === 0) {
            //         continue;
            //     }
            //
            //     throw Error(result);
            // }

            file.setContent(content);
        }
    }
}

module.exports = lint;
