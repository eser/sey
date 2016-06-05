class EolFix {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'preprocess',
            formats: '*',
            op: 'eolfix',
            weight: 0.1,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        for (let file of files) {
            const content = file.getContent();

            file.setContent(content.replace(/(?:\r\n|\r)/g, '\n'));
        }
    }
}

module.exports = EolFix;
