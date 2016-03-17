'use strict';

class eolfix {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'preprocess',
            formats: '*',
            op: 'eolfix',
            weight: 0.1,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        for (let file of files) {
            let content = file.getContent();
            file.setContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }
    }
}

module.exports = eolfix;
