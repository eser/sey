'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class transpile {
    exec(runnerOp, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let options = {
                ast: false,
                code: true,
                sourceMaps: false,

                // presets: [],
                plugins: [],
                ignore: ['bower_components/', 'node_modules/']
            };
            if (runnerOp.config.babel !== undefined) {
                deepmerge(options, runnerOp.config.babel);
            }

            if (runnerOp.config.standard >= 2015) {
                options.plugins = options.plugins.concat([require('babel-plugin-transform-es2015-destructuring'), require('babel-plugin-transform-es2015-function-name'), require('babel-plugin-transform-es2015-parameters'), require('babel-plugin-transform-es2015-sticky-regex'), require('babel-plugin-transform-es2015-unicode-regex'), require('babel-plugin-transform-es2015-modules-commonjs')]);
            }

            if (runnerOp.config.standard >= 2016) {
                options.plugins = options.plugins.concat([require('babel-plugin-transform-async-to-generator'), require('babel-plugin-transform-exponentiation-operator')]);
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

                file.setContent(result.code);
            }
        })();
    }
}

module.exports = transpile;