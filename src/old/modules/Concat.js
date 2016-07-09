const deepmerge = require('../utils/deepmerge.js'),
    RunnerSourceFile = require('../runner/SourceFile.js');

class Concat {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'bundling',
            formats: '*',
            op: 'concat',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const newLines = (value === undefined || value.newline !== false),
            newFile = new RunnerSourceFile({
                path: `/${value}`,
                fullpath: `./${value}`
            });

        let content = '';

        for (let file of files) {
            newFile.addHash(file.getHash());
            content += file.getContent();
            if (newLines && content.substr(content.length - 1) !== '\n') {
                content += '\n';
            }
        }

        newFile.setContent(content);
        runnerOpSet.opSetFiles = [ newFile ];

        return {
            processedFiles: runnerOpSet.opSetFiles
        };
    }
}

module.exports = Concat;
