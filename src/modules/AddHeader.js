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

    async exec(value, opSet, opFiles) {
        if (opSet.bundle.config.banner === undefined) {
            return;
        }

        /*
        for (let opFile of opFiles) {
            const content = opFile.getContent();

            opFile.setContent(opSet.bundle.config.banner + content);
        }
        */

        return {
            processedFiles: opFiles
        };
    }
}

module.exports = AddHeader;
