'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class Less {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'compile',
            formats: 'less',
            op: 'compile',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {};

            if (runnerOpSet.bundleConfig.less !== undefined) {
                deepmerge(options, runnerOpSet.bundleConfig.less);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._lessLib === undefined) {
                    _this._lessLib = require('less');
                }

                options.filename = file.file.path;

                const result = yield _this._lessLib.render(content, options);

                file.setExtension('css');
                file.setContent(result.css);
            }
        })();
    }
}

module.exports = Less;