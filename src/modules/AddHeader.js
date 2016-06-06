class AddHeader {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'branding',
            formats: '*',
            op: 'addheader',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const runnerBundle = runnerOpSet.runnerBundle;

        if (runnerBundle.config.banner === undefined) {
            return;
        }

        for (let file of files) {
            const content = file.getContent();

            file.setContent(runnerBundle.config.banner + content);
        }
    }
}

module.exports = AddHeader;
