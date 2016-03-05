'use strict';

const deepmerge = require('../utils/deepmerge.js'),
    runnerOpFile = require('../runnerOpFile.js');

class concat {
    info() {
        return [
            {
                phase: 'bundling',
                formats: '*',
                op: 'concat',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
        let newFile = new runnerOpFile({
                path: '/' + value,
                fullpath: './' + value
            }),
            content = '';

        for (let file of files) {
            newFile.addHash(file.getHash());
            content += file.getContent();
        }

        newFile.setContent(content);
        runnerOp.opFiles = [newFile];
    }
}

module.exports = concat;
