'use strict';

class renameExtension {
    info() {
        return [
            {
                phase: 'bundling',
                formats: '*',
                op: 'renameExtension',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
        for (let file of files) {
            file.setExtension(value);
        }
    }
}

module.exports = renameExtension;
