'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class lint {
    exec(runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let options = {};
            if (runnerOp.config.eslint !== undefined) {
                deepmerge(options, runnerOp.config.eslint);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._lintLib === undefined) {
                    const eslint = require('eslint');
                    _this._lintLib = new eslint.CLIEngine(options);
                }

                const results = _this._lintLib.executeOnText(content, file.file.path);

                // for (let result of results) {
                //     if (result.errorCount === 0 && result.warningCount === 0) {
                //         continue;
                //     }
                //
                //     throw Error(result);
                // }

                file.setContent(content);
            }
        })();
    }
}

module.exports = lint;