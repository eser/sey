'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js'),
      TaskException = require('../TaskException.js');

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

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
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

            if (runnerOpSet.config.eser === true) {
                // options.configFile = `${__dirname}/../../node_modules/eser/.eslintrc.json`;
                deepmerge(options, require('eser/.eslintrc.json'));
            }

            if (runnerOpSet.isStandard(2016)) {
                options.parser = 'babel-eslint';
                options.parserOptions.ecmaVersion = 7;
            } else if (runnerOpSet.isStandard(2015)) {
                options.parser = 'babel-eslint';
                options.parserOptions.ecmaVersion = 6;
            }

            if (runnerOpSet.isTargeting('web')) {
                options.parserOptions.sourceType = 'script';
            } else {
                options.parserOptions.sourceType = 'module';
            }

            if (runnerOpSet.config.eslint !== undefined) {
                deepmerge(options, runnerOpSet.config.eslint);
            }

            const allIssues = [];
            let errorCount = 0;
            for (let file of files) {
                const content = file.getContent();

                if (_this._lintLib === undefined) {
                    const eslint = require('eslint');

                    _this._lintLib = new eslint.CLIEngine(options);
                }

                const report = _this._lintLib.executeOnText(content, file.file.path);

                let issues = [];
                for (let result of report.results) {
                    issues = issues.concat(result.messages);
                }

                if (issues.length > 0) {
                    allIssues.push({
                        file: file,
                        issues: issues
                    });

                    const formatter = _this._lintLib.getFormatter();
                    console.log(formatter(report.results));
                }
                errorCount += report.errorCount;

                file.setContent(content);
            }

            if (errorCount > 0) {
                const taskEx = new TaskException();

                for (let item of allIssues) {
                    for (let issue of item.issues) {
                        const message = `Line ${ issue.line } Column ${ issue.column }: '${ issue.source }'\n${ issue.message }`;

                        taskEx.add(issue.fatal ? TaskException.ERROR : TaskException.WARNING, item.file, message, true);
                    }
                }

                throw taskEx;
            }

            // FIXME temporarily quick fix for linter
            _this._lintLib = undefined;
        })();
    }
}

module.exports = jslint;