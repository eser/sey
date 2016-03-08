'use strict';

const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    // fsManager = require('./utils/fsManager.js'),
    runnerOpSet = require('./runnerOpSet.js'),
    taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
        this.presets = {
            'lint': ['init', 'preprocess', 'lint', 'finalize'],
            'build': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'finalize'],
            'publish': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize'],
            'test': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'testing', 'finalize'],
            'server': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'development-server'],
            'deploy': ['init', 'preprocess', 'lint', 'compile', 'bundling', 'optimization', 'branding', 'finalize', 'deploy']
        };
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
            // if (config.clean !== undefined && config.clean.beforeBuild !== undefined) {
            //     const pathArray = (config.clean.beforeBuild.constructor === Array) ?
            //         config.clean.beforeBuild :
            //         [config.clean.beforeBuild];
            //
            //     for (let path of pathArray) {
            //         console.log(chalk.gray('  cleaning', path));
            //         fsManager.rmdir(path);
            //     }
            // }

            if (config.ops !== undefined) {
                let runnerOpSets = [];
                for (let i = 0, length = config.ops.length; i < length; i++) {
                    runnerOpSets.push(new runnerOpSet(bundle, config.ops[i], config));
                }

                for (let phase of this.presets[preset]) {
                    const phaseOps = sey.registry.phases[phase];

                    for (let currentRunnerOpSet of runnerOpSets) {
                        // FIXME: await Promise.all([]) for each phase?
                        await currentRunnerOpSet.exec(phase, phaseOps);
                    }
                }
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
            if (bundle === 'global') {
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
        }

        return (bundleCount > 0);
    }
}

module.exports = runner;
