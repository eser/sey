const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    RunnerBundle = require('./RunnerBundle.js'),
    TaskException = require('./TaskException.js');

class Runner {
    constructor(moduleManager, config) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundles = {};
    }

    getBundleConfig(bundleName) {
        const bundleConfig = {};

        if (/* bundleName !== 'global' && bundleName !== 'common' && */this.config.content.common !== undefined) {
            deepmerge(bundleConfig, this.config.content.common);
        }

        if (this.config.content[bundleName] !== undefined) {
            deepmerge(bundleConfig, this.config.content[bundleName]);
        }

        return bundleConfig;
    }

    async run(preset, options) {
        const bundleOnly = (options.bundle !== undefined),
            config = this.config.content;

        let bundleCount = 0;

        try {
            this.moduleManager.events.emit('runner-before', config);

            for (let bundleName in config) {
                if (bundleName === 'global' || bundleName === 'common') {
                    continue;
                }
                if (bundleOnly && options.bundle !== bundleName) {
                    continue;
                }

                bundleCount++;

                const bundleConfig = this.getBundleConfig(bundleName);

                this.bundles[bundleName] = new RunnerBundle(bundleName, bundleConfig, this.moduleManager);
                await this.bundles[bundleName].run(preset);
            }

            this.moduleManager.events.emit('runner-after', config);
        }
        catch (ex) {
            if (ex instanceof TaskException) {
                console.log(ex.export());
            }
            else {
                console.log(ex);
            }
        }

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

module.exports = Runner;
