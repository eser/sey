const deepmerge = require('../utils/deepmerge.js');

class TypeScript {
    onLoad(moduleManager) {
        moduleManager.addTask(this, {
            phase: 'compile',
            formats: 'ts',
            op: 'typescript',
            weight: 0.5,
            method: 'exec'
        });
    }

    async exec(value, runnerOpSet, files) {
        const options = {
            // allowJs: true,
            // emitDecoratorMetadata: true,
            // isolatedModules: true,
            // noImplicitAny: true,
            // noLib: true,
            // noResolve: true,
            // noEmit: true,
            // declaration: false,
            // preserveConstEnums: true,
            // removeComments: false,
            // sourceMap: false,
            module: 'commonjs' // this._tsLib.ModuleKind.CommonJS
        };

        const runnerBundle = runnerOpSet.bundle;

        if (runnerBundle.isStandard(2015)) {
            options.target = 'ES6';
        }

        if (runnerBundle.isStandard(2016)) {
            options.experimentalAsyncFunctions = true;
            // options.experimentalDecorators = true;
        }

        if (runnerBundle.config.typescript !== undefined) {
            deepmerge(options, runnerBundle.config.typescript);
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

        return {
            processedFiles: files
        };
    }
}

module.exports = TypeScript;
