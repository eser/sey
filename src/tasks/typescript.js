'use strict';

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    async exec(value, runnerOpSet, files) {
        let options = {
            // isolatedModules: true,
            // noLib: true,
            // noResolve: true,
            allowNonTsExtensions: true
        };

        if (runnerOpSet.isStandard(2015)) {
            options.target = 'ES6';
        }

        if (runnerOpSet.isStandard(2016)) {
            options.experimentalAsyncFunctions = true;
        }

        if (runnerOpSet.config.typescript !== undefined) {
            deepmerge(options, runnerOpSet.config.typescript);
        }

        for (let file of files) {
            const content = file.getContent();

            if (this._tsLib === undefined) {
                this._tsLib = require('typescript');
            }

            const result = this._tsLib.transpile(content, options);
            // TODO compilation errors?

            file.setExtension('js');
            file.setContent(result);
        }
    }
}

typescript.info = [
    {
        phase: 'compile',
        formats: 'ts',
        op: 'typescript',
        weight: 0.5,
        method: 'exec'
    }
];

module.exports = typescript;
