'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class cleancss {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'optimization',
            formats: 'css',
            op: 'minify',
            weight: 0.6,
            method: 'exec'
        });
    }

    execSingle(value, file, options) {
        return new Promise((resolve, reject) => {
            const content = file.getContent();

            this._cleancssInstance.minify(content, function (err, result) {
                if (err) {
                    reject(err);

                    return;
                }

                file.setContent(result.styles);
                resolve();
            });
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {
                advanced: true,
                keepBreaks: false,
                keepSpecialComments: false,
                mediaMerging: true,
                processImport: false,
                shorthandCompacting: true
            };

            if (runnerOpSet.config.cleancss !== undefined) {
                deepmerge(options, runnerOpSet.config.cleancss);
            }

            for (let file of files) {
                if (_this._cleancssInstance === undefined) {
                    const cleancssLib = require('clean-css');

                    _this._cleancssInstance = new cleancssLib(options);
                }

                yield _this.execSingle(value, file, options);
            }
        })();
    }
}

module.exports = cleancss;