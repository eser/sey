'use strict';

class addheader {
    async exec(value, runnerOpSet, files) {
        if (runnerOpSet.config.banner === undefined) {
            return;
        }

        for (let file of files) {
            let content = file.getContent();
            file.setContent(runnerOpSet.config.banner + content);
        }
    }
}

addheader.info = [
    {
        phase: 'branding',
        formats: '*',
        op: 'addheader',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = addheader;
