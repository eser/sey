const deepmerge = require('../utils/deepmerge.js');

class CleanCss {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'optimization',
            formats: 'css',
            op: 'minify',
            weight: 0.6,
            method: 'exec'
        });
    }

    execSingle(value, file, options) {
        return new Promise((resolve, reject) => {
            const content = file.getContent();

            this._cleancssInstance.minify(
                content,
                function (err, result) {
                    if (err) {
                        reject(err);

                        return;
                    }

                    file.setContent(result.styles);
                    resolve();
                }
            );
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            advanced: true,
            keepBreaks: false,
            keepSpecialComments: false,
            mediaMerging: true,
            processImport: false,
            shorthandCompacting: true
        };

        if (runnerOpSet.bundleConfig.cleancss !== undefined) {
            deepmerge(options, runnerOpSet.bundleConfig.cleancss);
        }

        for (let file of files) {
            if (this._cleancssInstance === undefined) {
                const cleancssLib = require('clean-css');

                this._cleancssInstance = new cleancssLib(options);
            }

            await this.execSingle(value, file, options);
        }
    }
}

module.exports = CleanCss;
