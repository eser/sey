'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class BabelJsx {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'compile',
            formats: 'jsx',
            op: 'compile',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {
                ast: false,
                code: true,
                sourceMaps: false,

                // presets: [],
                plugins: [require('babel-plugin-transform-react-jsx')],
                ignore: ['bower_components/', 'node_modules/']
            };

            if (runnerOpSet.bundleConfig.babel !== undefined) {
                deepmerge(options, runnerOpSet.bundleConfig.babel);
            }

            for (let file of files) {
                const content = file.getContent();

                if (_this._babelLib === undefined) {
                    _this._babelLib = require('babel-core');
                }

                options.filename = file.file.fullpath;
                // options.filenameRelative = file.file.path;
                // options.sourceFileName = file.file.path;

                const result = _this._babelLib.transform(content, options);

                file.setExtension('js');
                file.setContent(result.code);
            }
        })();
    }
}

module.exports = BabelJsx;