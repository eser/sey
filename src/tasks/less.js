'use strict';

const deepmerge = require('../utils/deepmerge.js');

class less {
    async exec(value, runnerOp, files) {
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
            let result = await this._lessLib.render(content, options);

            file.setExtension('css');
            file.setContent(result.css);
        }
    }
}

less.info = [
    {
        phase: 'compile',
        formats: 'less',
        op: 'transpile',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = less;
