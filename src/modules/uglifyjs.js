'use strict';

const deepmerge = require('../utils/deepmerge.js');

class uglifyjs {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'optimization',
            formats: 'js',
            op: 'minify',
            weight: 0.6,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        let options = {
            fromString: true
        };
        if (runnerOpSet.config.uglifyjs !== undefined) {
            deepmerge(options, runnerOpSet.config.uglifyjs);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._uglifyjsLib === undefined) {
                this._uglifyjsLib = require('uglify-js');
            }

            let result = this._uglifyjsLib.minify(
                content,
                options
            );

            file.setContent(result.code);
        }
    }
}

module.exports = uglifyjs;
