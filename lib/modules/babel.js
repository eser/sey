'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class babel {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'compile',
            formats: 'js',
            op: 'transpile',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
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
            if (runnerOpSet.config.babel !== undefined) {
                deepmerge(options, runnerOpSet.config.babel);
            }

            if (runnerOpSet.isStandard(2015)) {
                if (runnerOpSet.isTargeting('web')) {
                    options.plugins = options.plugins.concat([require('babel-plugin-transform-es2015-template-literals'), require('babel-plugin-transform-es2015-literals'), require('babel-plugin-transform-es2015-arrow-functions'), require('babel-plugin-transform-es2015-block-scoped-functions'), require('babel-plugin-transform-es2015-classes'), require('babel-plugin-transform-es2015-object-super'), require('babel-plugin-transform-es2015-shorthand-properties'),
                    // require('babel-plugin-transform-es2015-duplicate-keys'),
                    require('babel-plugin-transform-es2015-computed-properties'), require('babel-plugin-transform-es2015-for-of'), require('babel-plugin-check-es2015-constants'), require('babel-plugin-transform-es2015-spread'), require('babel-plugin-transform-es2015-block-scoping'), require('babel-plugin-transform-es2015-typeof-symbol'), [require('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }]]);
                }

                options.plugins = options.plugins.concat([require('babel-plugin-transform-es2015-destructuring'), require('babel-plugin-transform-es2015-function-name'), require('babel-plugin-transform-es2015-parameters'), require('babel-plugin-transform-es2015-sticky-regex'), require('babel-plugin-transform-es2015-unicode-regex'), require('babel-plugin-transform-es2015-modules-commonjs')]);
            }

            if (runnerOpSet.isStandard(2016)) {
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

module.exports = babel;