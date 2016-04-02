const chalk = require('chalk'),
    fsManager = require('../utils/fsManager.js');

class clean {
    onLoad(registry) {
        registry.events.on('runner-before', this.execBefore);
        registry.events.on('runner-after', this.execAfter);
    }

    execBefore(config) {
        if (config.global.clean.before === undefined) {
            return;
        }

        console.log('   ', chalk.cyan('clean'));
        fsManager.rm(config.global.clean.before);
    }

    execAfter(config) {
        if (config.global.clean.after === undefined) {
            return;
        }

        console.log('   ', chalk.cyan('clean'));
        fsManager.rm(config.global.clean.after);
    }
}

module.exports = clean;
