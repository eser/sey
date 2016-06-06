const chalk = require('chalk'),
    RunnerBundle = require('./RunnerBundle.js');

class Runner {
    constructor(moduleManager, config) {
        this.moduleManager = moduleManager;
        this.config = config;
        this.bundles = {};
    }

    async run(preset, options) {
        const bundleOnly = (options.bundle !== undefined),
            config = this.config.content;

        let bundleCount = 0;

        this.moduleManager.events.emit('runner-before', config);
        for (let bundle in config) {
            if (bundle === 'global' || bundle === 'common') {
                continue;
            }
            if (bundleOnly && options.bundle !== bundle) {
                continue;
            }

            bundleCount++;

            this.bundles[bundle] = new RunnerBundle(this.moduleManager, this.config, bundle);
            this.bundles[bundle].run(preset);
        }
        this.moduleManager.events.emit('runner-after', config);

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
