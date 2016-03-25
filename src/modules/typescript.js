const deepmerge = require('../utils/deepmerge.js');

class typescript {
    onLoad(registry) {
        registry.addTask(this, {
            phase: 'compile',
            formats: 'ts',
            op: 'compile',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
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

        // TODO runnerOpSet.outputFilesTo(tmppath); ?
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
