'use strict';

const deepmerge = require('../utils/deepmerge.js'),
    runnerOpSetFile = require('../runnerOpSetFile.js');

class concat {
    async exec(value, runnerOpSet, files) {
        let newFile = new runnerOpSetFile({
                path: '/' + value,
                fullpath: './' + value
            }),
            content = '';

        for (let file of files) {
            newFile.addHash(file.getHash());
            content += file.getContent();
        }

        newFile.setContent(content);
        runnerOpSet.opSetFiles = [newFile];
    }
}

concat.info = [
    {
        phase: 'bundling',
        formats: '*',
        op: 'concat',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = concat;
