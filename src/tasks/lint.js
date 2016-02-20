'use strict';

class lint {
    exec(runnerOp, files) {
        let options = runnerOp.config.eslint || {};

        for (let file of files) {
            const content = file.getContent();

            if (this._lintLib === undefined) {
                const eslint = require('eslint');
                this._lintLib = new eslint.CLIEngine(options);
            }

            const results = linter.executeOnText(content, file.file.path);

            for (let result of results) {
                if (result.errorCount === 0 && result.warningCount === 0) {
                    continue;
                }

                throw Error(result);
            }

            file.setContent(content);
        }
    }
}

module.exports = lint;
