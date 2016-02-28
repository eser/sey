'use strict';

const deepmerge = require('../utils/deepmerge.js');

class jsx {
    async exec(value, runnerOp, files) {
        let options = {
            ast: false,
            code: true,
            sourceMaps: false,

            // presets: [],
            plugins: [
                require('babel-plugin-transform-react-jsx')
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

module.exports = jsx;
