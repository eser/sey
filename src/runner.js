'use strict';

const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    runnerOp = require('./runnerOp.js');

class runner {
    constructor(config) {
        this.config = config;
    }

    getBundleConfig(name) {
        let config = {};

        if (this.config.content.global !== undefined) {
            deepmerge(config, this.config.content.global);
        }

        if (this.config.content[name] !== undefined) {
            deepmerge(config, this.config.content[name]);
        }

        return config;
    }

    runBundle(name) {
        const config = this.getBundleConfig(name);

        console.log(chalk.green('bundle:'), chalk.bold.white(name));
        if (config.ops !== undefined) {
            for (let item of config.ops) {
                const op = new runnerOp(name, item, config);
                op.start();
            }
        }
    }

    run() {
        for (let bundle in this.config.content) {
            if (bundle === 'global') {
                continue;
            }

            this.runBundle(bundle);
        }
    }
}

module.exports = runner;
