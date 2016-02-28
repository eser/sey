'use strict';

class eolfix {
    async exec(value, runnerOp, files) {
        for (let file of files) {
            let content = file.getContent();
            file.setContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }
    }
}

module.exports = eolfix;
