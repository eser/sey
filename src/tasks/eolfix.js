'use strict';

class eolfix {
    async exec(value, runnerOp, files) {
        for (let file of files) {
            let content = file.getContent();
            file.setContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }
    }
}

eolfix.info = [
    {
        phase: 'preprocess',
        formats: '*',
        op: 'eolfix',
        weight: 0.1,
        method: 'exec'
    }
];

module.exports = eolfix;
