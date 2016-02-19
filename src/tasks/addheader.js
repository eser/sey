'use strict';

class addheader {
    exec(runnerOp, files) {
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
