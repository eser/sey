const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    RunnerOpSet = require('./RunnerOpSet.js'),
    TaskException = require('./TaskException.js');

class RunnerBundle {
    constructor(moduleManager, config, bundle) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundle = bundle;

        this.sourcesToWatch = [];
    }

    getBundleConfig(bundle) {
        const bundleConfig = {};

        if (/* bundle !== 'global' && bundle !== 'common' && */this.config.content.common !== undefined) {
            deepmerge(bundleConfig, this.config.content.common);
        }

        if (this.config.content[bundle] !== undefined) {
            deepmerge(bundleConfig, this.config.content[bundle]);
        }

        return bundleConfig;
    }

    async run(preset) {
        console.log(chalk.green('bundle:'), chalk.bold.white(this.bundle));
        try {
            const bundleConfig = this.getBundleConfig(this.bundle);
            if (bundleConfig.ops === undefined) {
                return;
            }

            const opsLength = bundleConfig.ops.length,
                runnerOpSets = new Array(opsLength);

            for (let i = 0; i < opsLength; i++) {
                const bundleOpConfig = bundleConfig.ops[i];

                if (bundleOpConfig.src !== undefined) {
                    if (bundleOpConfig.src.constructor === Array) {
                        for (let bundleOpConfigSrcIndex in bundleOpConfig.src) {
                            this.sourcesToWatch.push(bundleOpConfig.src[bundleOpConfigSrcIndex]);
                        }
                    }
                    else {
                        this.sourcesToWatch.push(bundleOpConfig.src);
                    }
                }

                runnerOpSets[i] = new RunnerOpSet(this.moduleManager, this.bundle, bundleConfig, bundleOpConfig);
            }

            for (let phase of this.config.content.global.presets[preset]) {
                const phaseOps = this.moduleManager.phases[phase];

                this.moduleManager.events.emit(`bundle-before-${phase}`, bundleConfig, this.bundle);

                if (phaseOps.length > 0) {
                    const promises = new Array(opsLength);

                    for (let i = 0; i < opsLength; i++) {
                        promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                    }

                    await Promise.all(promises);
                }

                this.moduleManager.events.emit(`bundle-after-${phase}`, bundleConfig, this.bundle);
            }

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i].outputFiles();
            }
        }
        catch (ex) {
            if (ex instanceof TaskException) {
                console.log(ex.export());
            }
            else {
                console.log(ex);
            }
        }
    }
}

module.exports = RunnerBundle;
