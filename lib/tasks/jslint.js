'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js'),
      taskException = require('../taskException.js');

class jslint {
    info() {
        return [{
            phase: 'lint',
            formats: 'js',
            op: 'lint',
            weight: 0.5,
            method: 'exec'
        }];
    }

    exec(value, runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
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

                if (_this._lintLib === undefined) {
                    const eslint = require('eslint');
                    _this._lintLib = new eslint.CLIEngine(options);
                }

                const report = _this._lintLib.executeOnText(content, file.file.path);

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
                        const message = `Line ${ issue.line } Column ${ issue.column }: '${ issue.source }'\n${ issue.message }`;

                        taskEx.add(issue.fatal ? taskException.ERROR : taskException.WARNING, item.file, message);
                    }
                }

                throw taskEx;
            }
        })();
    }
}

module.exports = jslint;