'use strict';

class renameExtension {
    async exec(value, runnerOp, files) {
        for (let file of files) {
            file.setExtension(value);
        }
    }
}

module.exports = renameExtension;
