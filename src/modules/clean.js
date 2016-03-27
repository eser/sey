const chalk = require('chalk'),
    fsManager = require('../utils/fsManager.js');

class clean {
    onLoad(registry) {
        registry.events.on('before-init', this.execBefore);
        registry.events.on('after-finalize', this.execAfter);
    }

    execBefore(config, bundle) {
        if (config.clean.before === undefined) {
            return;
        }

        console.log('   ', chalk.cyan('clean'));
        fsManager.rm(config.clean.before);
    }

    execAfter(config, bundle) {
        if (config.clean.after === undefined) {
            return;
        }

        console.log('   ', chalk.cyan('clean'));
        fsManager.rm(config.clean.after);
    }
}

module.exports = clean;
