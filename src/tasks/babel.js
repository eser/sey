'use strict';

const deepmerge = require('../utils/deepmerge.js');

class babel {
    exec(runnerOp, files) {
        let options = {
            ast: false,
            presets: ['es2015', 'stage-3'],
            ignore: ['bower_components/', 'node_modules/'],
            only: null
        };
        if (runnerOp.config.babel !== undefined) {
            deepmerge(options, runnerOp.config.babel);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._babelLib === undefined) {
                this._babelLib = require('babel-core');
            }

            options.filename = file.file.path;

            const result = this._babelLib.transform(content, options);

            file.setContent(result.code);
        }
    }
}

module.exports = babel;
