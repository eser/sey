'use strict';

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
        let config = {};

        if (this.config.content.global !== undefined) {
            deepmerge(config, this.config.content.global);
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

            let opsLength = config.ops.length,
                runnerOpSets = new Array(opsLength);

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i] = new runnerOpSet(bundle, config.ops[i], config);
            }

            for (let phase of this.config.content.presets[preset]) {
                const phaseOps = registry.phases[phase];

                registry.events.emit('before-' + phase, config, bundle);

                if (phaseOps.length > 0) {
                    let promises = new Array(opsLength);
                    for (let i = 0; i < opsLength; i++) {
                        promises[i] = runnerOpSets[i].exec(phase, phaseOps);
                    }

                    await Promise.all(promises);
                }

                registry.events.emit('after-' + phase, config, bundle);
            }

            for (let i = 0; i < opsLength; i++) {
                runnerOpSets[i].outputFiles();
            }
        } catch (ex) {
            if (ex instanceof taskException) {
                console.log(ex.export());
            } else {
                console.log(ex);
            }
        }
    }

    async run(preset, options) {
        const bundleOnly = (options.bundle !== undefined);

        let bundleCount = 0;

        for (let bundle in this.config.content) {
            if (bundle === 'global' || bundle === 'presets') {
                continue;
            }
            if (bundleOnly && options.bundle !== bundle) {
                continue;
            }

            bundleCount++;
            await this.runBundle(preset, bundle);
        }

        if (bundleCount === 0) {
            if (bundleOnly) {
                console.log(chalk.red('no such bundle named', options.bundle));
            } else {
                console.log(chalk.red('no bundle available to run'));
            }

            return false;
        }

        console.log(chalk.green('done.'));

        return true;
    }
}

module.exports = runner;
