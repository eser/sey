'use strict';

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    info() {
        return [
            {
                phase: 'compile',
                formats: 'ts',
                op: 'typescript',
                weight: 0.5,
                method: 'exec'
            }
        ];
    }

    async exec(value, runnerOp, files) {
        let options = {
            // isolatedModules: true,
            // noLib: true,
            // noResolve: true,
            allowNonTsExtensions: true
        };

        if (runnerOp.isStandard(2015)) {
            options.target = 'ES6';
        }

        if (runnerOp.isStandard(2016)) {
            options.experimentalAsyncFunctions = true;
        }

        if (runnerOp.config.typescript !== undefined) {
            deepmerge(options, runnerOp.config.typescript);
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

module.exports = typescript;
