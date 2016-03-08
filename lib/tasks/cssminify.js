'use strict';

const deepmerge = require('../utils/deepmerge.js');

class cssminify {
    exec(value, runnerOpSet, files) {
        return new Promise((resolve, reject) => {
            let options = {
                fromString: true
            };
            if (runnerOpSet.config.cleancss !== undefined) {
                deepmerge(options, runnerOpSet.config.cleancss);
            }

            for (let file of files) {
                const content = file.getContent();

                if (this._cleancssLib === undefined) {
                    const cleancss = require('clean-css');
                    this._cleancssLib = new cleancss(options);
                }

                this._cleancssLib.minify(content, function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    file.setContent(result.styles);
                    resolve();
                });
            }
        });
    }
}

cssminify.info = [{
    phase: 'optimization',
    formats: 'css',
    op: 'minify',
    weight: 0.6,
    method: 'exec'
}];

module.exports = cssminify;