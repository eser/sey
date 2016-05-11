'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'compile',
            formats: 'ts',
            op: 'typescript',
            weight: 0.5,
            method: 'exec'
        });
    }

    exec(value, runnerOpSet, files) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const options = {
                // allowJs: true,
                // emitDecoratorMetadata: true,
                // isolatedModules: true,
                // noImplicitAny: true,
                // noLib: true,
                // noResolve: true,
                // noEmit: true,
                declaration: false,
                preserveConstEnums: true,
                removeComments: false,
                sourceMap: false,
                module: 'commonjs' // this._tsLib.ModuleKind.CommonJS
            };

            if (runnerOpSet.isStandard(2015)) {
                options.target = 'ES6';
            }

            if (runnerOpSet.isStandard(2016)) {
                options.experimentalAsyncFunctions = true;
                // options.experimentalDecorators = true;
            }

            if (runnerOpSet.config.typescript !== undefined) {
                deepmerge(options, runnerOpSet.config.typescript);
            }

            // TODO runnerOpSet.outputFilesTo(tmppath); ?
            for (let file of files) {
                const content = file.getContent();

                if (_this._tsLib === undefined) {
                    _this._tsLib = require('typescript');
                }

                const result = _this._tsLib.transpile(content, options);
                // TODO compilation errors?

                file.setExtension('js');
                file.setContent(result);
            }
        })();
    }
}

module.exports = typescript;