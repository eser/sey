'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class UglifyJs {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'optimization',
            formats: 'js',
            op: 'minify',
            weight: 0.6,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {
                fromString: true
            };

            const runnerBundle = runnerOpSet.runnerBundle;

            if (runnerBundle.config.uglifyjs !== undefined) {
                deepmerge(options, runnerBundle.config.uglifyjs);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._uglifyjsLib === undefined) {
                    _this._uglifyjsLib = require('uglify-js');
                }

                const result = _this._uglifyjsLib.minify(content, options);

                file.setContent(result.code);
            }
        })();
    }
}

module.exports = UglifyJs;