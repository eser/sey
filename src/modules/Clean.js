const chalk = require('chalk'),
    fsManager = require('../utils/fsManager.js');

class Clean {
    onLoad(moduleManager) {
        moduleManager.events.on('runner-before', this.execBefore);
        moduleManager.events.on('runner-after', this.execAfter);
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

module.exports = Clean;
