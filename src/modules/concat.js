'use strict';

const deepmerge = require('../utils/deepmerge.js'),
    runnerOpSetFile = require('../runnerOpSetFile.js');

class concat {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'bundling',
            formats: '*',
            op: 'concat',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        let newLines = (value === undefined || value.newline !== false);

        let newFile = new runnerOpSetFile({
                path: '/' + value,
                fullpath: './' + value
            }),
            content = '';

        for (let file of files) {
            newFile.addHash(file.getHash());
            content += file.getContent();
            if (newLines && content.substr(content.length - 1) !== '\n') {
                content += '\n';
            }
        }

        newFile.setContent(content);
        runnerOpSet.opSetFiles = [newFile];
    }
}

module.exports = concat;
