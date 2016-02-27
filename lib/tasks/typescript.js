'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    exec(runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let options = {
                // isolatedModules: true,
                allowNonTsExtensions: true
            };

            // noLib: true,
            // noResolve: true
            if (runnerOp.config.typescript !== undefined) {
                deepmerge(options, runnerOp.config.typescript);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._tsLib === undefined) {
                    _this._tsLib = require('typescript');
                }

                const result = _this._tsLib.transpile(content, options);
                // TODO compilation errors?

                file.setContent(result);
            }
        })();
    }
}

module.exports = typescript;