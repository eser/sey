'use strict';

const deepmerge = require('../utils/deepmerge.js');

class optimize {
    async exec(runnerOp, files) {
        /*
        let options = {};
        if (runnerOp.config.closure !== undefined) {
            deepmerge(options, runnerOp.config.closure);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._closureLib === undefined) {
                this._closureLib = require('closurecompiler');
            }

            options.filename = file.file.fullpath;
            // options.filenameRelative = file.file.path;
            // options.sourceFileName = file.file.path;

            // TODO FIXME write content into a temporary file?
            // TODO callback mechanism
            const result = this._closureLib.compile(content, options);

            file.setContent(result.code);
        }
        */
    }
}

module.exports = optimize;
