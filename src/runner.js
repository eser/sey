const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    // fsManager = require('./utils/fsManager.js'),
    registry = require('./registry.js'),
    runnerOpSet = require('./runnerOpSet.js'),
    taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
    }

    getBundleConfig(bundle) {
        const config = {};

        if (bundle !== 'global' && bundle !== 'common' && this.config.content.common !== undefined) {
            deepmerge(config, this.config.content.common);
        }

        if (this.config.content[bundle] !== undefined) {
            deepmerge(config, this.config.content[bundle]);
        }

        return config;
    }

    async runBundle(preset, bundle) {
        const config = this.getBundleConfig(bundle);

        console.log(chalk.green('bundle:'), chalk.bold.white(bundle));
        try {
            if (config.ops === undefined) {
                return;
            }

            const opsLength = config.ops.length,
                runnerOpSets = new Array(opsLength);

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i] = new runnerOpSet(bundle, config.ops[i], config);
            }

            for (let phase of this.config.content.global.presets[preset]) {
                const phaseOps = registry.phases[phase];

                registry.events.emit(`bundle-before-${phase}`, config, bundle);

                if (phaseOps.length > 0) {
                    const promises = new Array(opsLength);

                    for (let i = 0; i < opsLength; i++) {
                        promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                    }

                    await Promise.all(promises);
                }

                registry.events.emit(`bundle-after-${phase}`, config, bundle);
            }

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i].outputFiles();
            }
        }
        catch (ex) {
            if (ex instanceof taskException) {
                console.log(ex.export());
            }
            else {
                console.log(ex);
            }
        }
    }

    async run(preset, options) {
        const bundleOnly = (options.bundle !== undefined),
            config = this.config.content;

        let bundleCount = 0;

        registry.events.emit(`runner-before`, config);
        for (let bundle in config) {
            if (bundle === 'global' || bundle === 'common') {
                continue;
            }
            if (bundleOnly && options.bundle !== bundle) {
                continue;
            }

            bundleCount++;
            await this.runBundle(preset, bundle);
        }
        registry.events.emit(`runner-after`, config);

        if (bundleCount === 0) {
            if (bundleOnly) {
                console.log(chalk.red('no such bundle named', options.bundle));
            }
            else {
                console.log(chalk.red('no bundle available to run'));
            }

            return false;
        }

        console.log(chalk.green('done.'));

        return true;
    }
}

module.exports = runner;
