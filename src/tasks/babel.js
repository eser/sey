'use strict';

const deepmerge = require('../utils/deepmerge.js');

class babel {
    exec(runnerOp, files) {
        let options = {
            ast: false,
            code: true,
            sourceMaps: false,
            npmpath: __dirname,

            // presets: ['es2015', 'stage-3'],
            plugins: [
                'transform-es2015-destructuring',
                'transform-es2015-function-name',
                'transform-es2015-parameters',
                'transform-es2015-sticky-regex',
                'transform-es2015-unicode-regex',
                'transform-es2015-modules-commonjs',
                'transform-async-to-generator',
                'transform-exponentiation-operator'
            ],
            ignore: ['bower_components/', 'node_modules/']
        };
        if (runnerOp.config.babel !== undefined) {
            deepmerge(options, runnerOp.config.babel);
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

module.exports = babel;
