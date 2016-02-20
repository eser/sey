'use strict';

class less {
    exec(runnerOp, files) {
        let options = runnerOp.config.less || {};

        if (this._lessLib === undefined) {
            this._lessLib = require('less');
        }

        for (let file of files) {
            let content = file.getContent();

            options.filename = file.file.path;
            let result = this._lessLib.parse(options, content);

            file.setContent(result.css);
        }
    }
}

module.exports = less;
