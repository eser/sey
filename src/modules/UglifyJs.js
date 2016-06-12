const deepmerge = require('../utils/deepmerge.js');

class UglifyJs {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'optimization',
            formats: 'js',
            op: 'minify',
            weight: 0.6,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            fromString: true
        };

        const runnerBundle = runnerOpSet.bundle;

        if (runnerBundle.config.uglifyjs !== undefined) {
            deepmerge(options, runnerBundle.config.uglifyjs);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._uglifyjsLib === undefined) {
                this._uglifyjsLib = require('uglify-js');
            }

            const result = this._uglifyjsLib.minify(
                content,
                options
            );

            file.setContent(result.code);
        }

        return {
            processedFiles: files
        };
    }
}

module.exports = UglifyJs;
