'use strict';

const deepmerge = require('../utils/deepmerge.js');

class cleancss {
    onLoad(registry) {
        registry.addTask(this, {
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
        let options = {
            advanced: true,
            keepBreaks: false,
            keepSpecialComments: false,
            mediaMerging: true,
            processImport: false,
            shorthandCompacting: true
        };
        if (runnerOpSet.config.cleancss !== undefined) {
            deepmerge(options, runnerOpSet.config.cleancss);
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

module.exports = cleancss;
