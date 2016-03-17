'use strict';

const deepmerge = require('../utils/deepmerge.js'),
    taskException = require('../taskException.js');

class jslint {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'lint',
            formats: 'js',
            op: 'lint',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        let options = {
            env: {
                es6: runnerOpSet.isStandard(2015),
                node: runnerOpSet.isTargeting('node'),
                browser: runnerOpSet.isTargeting('web')
            },
            extends: 'eslint:recommended'
        };
        if (runnerOpSet.isStandard(2015)) {
            options.parser = 'babel-eslint';
        }
        if (runnerOpSet.config.eslint !== undefined) {
            deepmerge(options, runnerOpSet.config.eslint);
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

module.exports = jslint;
