'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class preprocess {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'preprocess',
            formats: '*',
            op: 'preprocess',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const vars = process.env;

            vars.BUNDLE = runnerOpSet.bundleName;
            vars.ENV = runnerOpSet.getTarget();

            if (runnerOpSet.config.preprocessVars !== undefined) {
                deepmerge(vars, runnerOpSet.config.preprocessVars);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._preprocessLib === undefined) {
                    _this._preprocessLib = require('preprocess');
                }

                const result = _this._preprocessLib.preprocess(content, vars /* , { type: 'js' } */);

                file.setContent(result);
            }
        })();
    }
}

module.exports = preprocess;