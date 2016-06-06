const deepmerge = require('../utils/deepmerge.js');

class Babel {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'compile',
            formats: 'js',
            op: 'transpile',
            weight: 0.8,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            ast: false,
            code: true,
            sourceMaps: false,

            // presets: [],
            plugins: [],
            ignore: [ 'bower_components/', 'node_modules/' ]
        };

        if (runnerOpSet.bundleConfig.babel !== undefined) {
            deepmerge(options, runnerOpSet.bundleConfig.babel);
        }

        if (runnerOpSet.isStandard(2015)) {
            if (runnerOpSet.isTargeting('web')) {
                options.plugins = options.plugins.concat([
                    require('babel-plugin-transform-es2015-template-literals'),
                    require('babel-plugin-transform-es2015-literals'),
                    require('babel-plugin-transform-es2015-arrow-functions'),
                    require('babel-plugin-transform-es2015-block-scoped-functions'),
                    require('babel-plugin-transform-es2015-classes'),
                    require('babel-plugin-transform-es2015-object-super'),
                    // require('babel-plugin-transform-es2015-duplicate-keys'),
                    require('babel-plugin-transform-es2015-computed-properties'),
                    require('babel-plugin-transform-es2015-for-of'),
                    require('babel-plugin-check-es2015-constants'),
                    require('babel-plugin-transform-es2015-block-scoping'),
                    require('babel-plugin-transform-es2015-typeof-symbol'),
                    [
                        require('babel-plugin-transform-regenerator'),
                        { async: false, asyncGenerators: false }
                    ]
                ]);
            }

            // v4.0.0 and upper
            options.plugins = options.plugins.concat([
                require('babel-plugin-transform-es2015-destructuring'),
                require('babel-plugin-transform-es2015-function-name'),
                require('babel-plugin-transform-es2015-parameters'),
                require('babel-plugin-transform-es2015-spread'),
                require('babel-plugin-transform-es2015-sticky-regex'),
                require('babel-plugin-transform-es2015-unicode-regex'),
                require('babel-plugin-transform-es2015-shorthand-properties'),
                require('babel-plugin-transform-es2015-modules-commonjs')
            ]);
        }

        if (runnerOpSet.isStandard(2016)) {
            options.plugins = options.plugins.concat([
                require('babel-plugin-transform-async-to-generator'),
                require('babel-plugin-transform-exponentiation-operator')
            ]);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._babelLib === undefined) {
                this._babelLib = require('babel-core');
            }

            options.filename = file.file.fullpath;
            // options.filenameRelative = file.file.path;
            // options.sourceFileName = file.file.path;

            const result = this._babelLib.transform(content, options);

            file.setContent(result.code);
        }
    }
}

module.exports = Babel;
