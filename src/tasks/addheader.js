'use strict';

class addheader {
    info() {
        return [
            {
                phase: 'branding',
                formats: '*',
                op: 'addheader',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
        if (runnerOp.config.banner === undefined) {
            return;
        }

        for (let file of files) {
            let content = file.getContent();
            file.setContent(runnerOp.config.banner + content);
        }
    }
}

module.exports = addheader;
