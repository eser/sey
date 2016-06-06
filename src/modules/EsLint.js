const deepmerge = require('../utils/deepmerge.js'),
    TaskException = require('../TaskException.js');

class EsLint {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'lint',
            formats: 'js',
            op: 'lint',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            env: {
                es6: runnerOpSet.isStandard(2015),
                node: runnerOpSet.isTargeting('node'),
                browser: runnerOpSet.isTargeting('web')
            }
        };

        if (runnerOpSet.bundleConfig.eser === true) {
            // options.configFile = `${__dirname}/../../node_modules/eser/.eslintrc.json`;
            deepmerge(options, require('eser/.eslintrc.json'));
        }

        if (runnerOpSet.isStandard(2016)) {
            options.parser = 'babel-eslint';
            options.parserOptions.ecmaVersion = 7;
        }
        else if (runnerOpSet.isStandard(2015)) {
            options.parser = 'babel-eslint';
            options.parserOptions.ecmaVersion = 6;
        }

        if (runnerOpSet.isTargeting('web')) {
            options.parserOptions.sourceType = 'script';
        }
        else {
            options.parserOptions.sourceType = 'module';
        }

        if (runnerOpSet.bundleConfig.eslint !== undefined) {
            deepmerge(options, runnerOpSet.bundleConfig.eslint);
        }

        const allIssues = [];
        let errorCount = 0;
        for (let file of files) {
            const content = file.getContent();

            if (this._lintLib === undefined) {
                const eslint = require('eslint');

                this._lintLib = new eslint.CLIEngine(options);
            }

            const report = this._lintLib.executeOnText(content, file.file.path);

            let issues = [];
            for (let result of report.results) {
                issues = issues.concat(result.messages);
            }

            if (issues.length > 0) {
                allIssues.push({
                    file: file,
                    issues: issues
                });

                const formatter = this._lintLib.getFormatter();
                console.log(formatter(report.results));
            }
            errorCount += report.errorCount;

            file.setContent(content);
        }

        if (errorCount > 0) {
            const taskEx = new TaskException();

            for (let item of allIssues) {
                for (let issue of item.issues) {
                    const message = `Line ${issue.line} Column ${issue.column}: '${issue.source}'\n${issue.message}`;

                    taskEx.add(
                        issue.fatal ? TaskException.ERROR : TaskException.WARNING,
                        item.file,
                        message,
                        true
                    );
                }
            }

            throw taskEx;
        }

        // FIXME temporarily quick fix for linter
        this._lintLib = undefined;
    }
}

module.exports = EsLint;
