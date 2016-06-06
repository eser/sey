'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class CssComb {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'optimization',
            formats: 'css',
            op: 'optimize',
            weight: 0.8,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {};

            if (runnerOpSet.bundleConfig.eser === true) {
                deepmerge(options, require('eser/.csscomb.json'));
            }

            if (runnerOpSet.bundleConfig.csscomb !== undefined) {
                deepmerge(options, runnerOpSet.bundleConfig.csscomb);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._csscombInstance === undefined) {
                    const csscombType = require('csscomb');

                    _this._csscombInstance = new csscombType(options, 'css');
                }

                const result = _this._csscombInstance.processString(content);

                file.setContent(result);
            }
        })();
    }
}

module.exports = CssComb;