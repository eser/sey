'use strict';

const deepmerge = require('../utils/deepmerge.js'),
    taskException = require('../taskException.js');

class jslint {
    async exec(value, runnerOp, files) {
        let options = {
            env: {
                es6: runnerOp.isStandard(2015),
                node: runnerOp.isTargeting('node'),
                browser: runnerOp.isTargeting('web')
            },
            extends: 'eslint:recommended'
        };
        if (runnerOp.isStandard(2015)) {
            options.parser = 'babel-eslint';
        }
        if (runnerOp.config.eslint !== undefined) {
            deepmerge(options, runnerOp.config.eslint);
        }

        let allIssues = [];
        for (let file of files) {
            const content = file.getContent();

            if (this._lintLib === undefined) {
                const eslint = require('eslint');
                this._lintLib = new eslint.CLIEngine(options);
            }

            const report = this._lintLib.executeOnText(content, file.file.path);

            let issues = [];
            for (let result of report.results) {
                if (result.errorCount === 0 && result.warningCount === 0) {
                    continue;
                }

                issues = issues.concat(result.messages);
            }

            if (issues.length > 0) {
                allIssues.push({
                    file: file,
                    issues: issues
                });
                continue;
            }

            file.setContent(content);
        }

        if (allIssues.length > 0) {
            let taskEx = new taskException();

            for (let item of allIssues) {
                for (let issue of item.issues) {
                    const message = `Line ${issue.line} Column ${issue.column}: '${issue.source}'\n${issue.message}`;

                    taskEx.add(
                        issue.fatal ? taskException.ERROR : taskException.WARNING,
                        item.file,
                        message
                    );
                }
            }

            throw taskEx;
        }
    }
}

jslint.info = [
    {
        phase: 'lint',
        formats: 'js',
        op: 'lint',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = jslint;
