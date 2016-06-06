const deepmerge = require('../utils/deepmerge.js');

class Less {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'compile',
            formats: 'less',
            op: 'compile',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {};

        const runnerBundle = runnerOpSet.runnerBundle;

        if (runnerBundle.config.less !== undefined) {
            deepmerge(options, runnerBundle.config.less);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._lessLib === undefined) {
                this._lessLib = require('less');
            }

            options.filename = file.file.path;

            const result = await this._lessLib.render(content, options);

            file.setExtension('css');
            file.setContent(result.css);
        }
    }
}

module.exports = Less;
