'use strict';

class renameExtension {
    async exec(value, runnerOpSet, files) {
        for (let file of files) {
            file.setExtension(value);
        }
    }
}

renameExtension.info = [
    {
        phase: 'bundling',
        formats: '*',
        op: 'renameExtension',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = renameExtension;
