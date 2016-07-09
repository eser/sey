const events = require('events'),
    childProcess = require('child_process'),
    ConfigManager = require('./config/index.js'),
    AddInManager = require('./addins/index.js');

class Sey {
    constructor() {
        this.events = new events.EventEmitter();
        this.config = new ConfigManager();
        this.addins = new AddInManager(this);
    }

    exec(file) {
        const backup = global.sey;

        global.sey = this;

        const returnValue = require(file);

        global.sey = backup;

        return returnValue;
    }

    shell(commands) {
        const commands_ = (commands.constructor === Array) ? commands : [ commands ];

        for (let command of commands_) {
            childProcess.spawnSync(
                command,
                [],
                {
                    stdio: 'inherit',
                    shell: true
                }
            );
        }
    }
}

module.exports = Sey;
