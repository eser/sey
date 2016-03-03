'use strict';

const deepmerge = require('../utils/deepmerge.js');

class typescript {
    async exec(value, runnerOp, files) {
        let options = {
            // isolatedModules: true,
            allowNonTsExtensions: true,
            // noLib: true,
            // noResolve: true
        };

        if (runnerOp.config.standard >= 2015) {
            options.target = 'ES6';
        }

        if (runnerOp.config.standard >= 2016) {
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
