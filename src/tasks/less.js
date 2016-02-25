'use strict';

const deepmerge = require('../utils/deepmerge.js');

class less {
    async exec(runnerOp, files) {
        let options = {};
        if (runnerOp.config.less !== undefined) {
            deepmerge(options, runnerOp.config.less);
        }

        for (let file of files) {
            let content = file.getContent();

            if (this._lessLib === undefined) {
                this._lessLib = require('less');
            }

            options.filename = file.file.path;
            let result = this._lessLib.parse(options, content);

            file.setContent(result.css);
        }
    }
}

module.exports = less;
